import { prisma } from "../../config/config.js";

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
              url: true,
            },
            where: {
              is_profile_img: true,
            },
            take: 1,
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
    profile_img: item.product.product_image[0]?.url,
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
