import { prisma } from "../../config/config.js";
import { getImage } from "../util/util.js";

export async function fetchAllItems(account_id) {
  const items = await prisma.cart.findMany({
    select: {
      product: {
        select: {
          name: true,
          publisher: {
            select: {
              name: true,
            },
          },
          product_image: {
            select: {
              public_id: true,
            },
            where: {
              is_profile_img: true,
            },
          },
          price: true,
          price_sale: true,
        },
      },
      quantity: true,
    },

    where: {
      account_id: account_id,
    },
  });
  const formatItems = items.map((item) => ({
    name: item.product.name,
    publisher_name: item.product.publisher.name,
    profile_img: getImage(item.product.product_image[0]?.public_id),
    price: item.product.price,
    price_sale: item.product.price_sale,
    total_save: item.product.price - item.product.price_sale,
    quantity: item.quantity,
  }));
  return formatItems;
}

export async function addNewItem(params) {
  const { account_id, product_id } = params;
  const existItem = await prisma.cart.findUnique({
    select: {
      product_id: true,
    },
    where: {
      account_id_product_id: {
        account_id: Number(account_id),
        product_id: Number(product_id),
      },
    },
  });
  if (existItem) {
    return { message: "Item has been added to cart" };
  }
  const in_stock = await prisma.product.findUnique({
    select: {
      in_stock: true,
    },
    where: {
      id: Number(product_id),
    },
  });
  if (!in_stock.in_stock) {
    return { message: "The game is out of stock" };
  }
  const newItem = await prisma.cart.create({
    data: {
      account_id: Number(account_id),
      product_id: Number(product_id),
      quantity: 1,
    },
  });
  return newItem;
}

export async function removeItem(params) {
  const { account_id, product_id } = params;
  const existItem = await prisma.cart.findUnique({
    select: {
      product_id: true,
    },
    where: {
      account_id_product_id: {
        account_id: Number(account_id),
        product_id: Number(product_id),
      },
    },
  });
  if (!existItem) {
    return { message: "Item is not available in cart" };
  }
  const deleteItem = await prisma.cart.delete({
    where: {
      account_id_product_id: {
        account_id: Number(account_id),
        product_id: Number(product_id),
      },
    },
  });
  return deleteItem;
}

export async function updateItem(item) {
  const { account_id, product_id, quantity } = item;
  const existItem = await prisma.cart.findUnique({
    select: {
      product: {
        select: {
          in_stock: true,
        },
      },
    },
    where: {
      account_id_product_id: {
        account_id: account_id,
        product_id: product_id,
      },
    },
  });
  if (!existItem) {
    return { message: "Item is not available in cart" };
  }
  if (existItem.product.in_stock < quantity) {
    return { message: "The game is out of stock" };
  }
  const updateItem = await prisma.cart.update({
    select: {
      quantity: true,
      product: {
        select: {
          price: true,
          price_sale: true,
        },
      },
    },
    data: {
      quantity: quantity,
    },
    where: {
      account_id_product_id: {
        account_id: account_id,
        product_id: product_id,
      },
    },
  });
  const price = updateItem.product.price * item.quantity,
    price_sale = updateItem.product.price_sale * item.quantity;
  const formatItem = {
    price: price,
    price_sale: price_sale,
    total_save: price - price_sale,
  };
  return formatItem;
}
