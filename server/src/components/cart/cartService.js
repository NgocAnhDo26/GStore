import { prisma } from "../../config/config.js";
import { getImage } from "../util/util.js";

export async function fetchAllGames(accountID) {
  const games = await prisma.cart.findMany({
    select: {
      product: {
        select: {
          id: true,
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
      account_id: accountID,
    },
  });

  if (!games.length) {
    throw new Error(`Cart is empty`);
  }

  const formatResult = games.map((game) => ({
    name: game.product.name,
    publisher_name: game.product.publisher.name,
    profile_img: getImage(game.product.product_image[0]?.public_id),
    price: game.product.price,
    price_sale: game.product.price_sale,
    total_save: game.product.price - game.product.price_sale,
    quantity: game.quantity,
  }));
  return formatResult;
}

// Can add list new game or 1 game
export async function addNewGame(accountID, productList) {
  const { products } = productList; // products: [{productID, quantity}]
  const result = { products: [] };

  if (!products.length) {
    throw new Error("No product add to cart ");
  }

  await Promise.all(
    products.map(async (product) => {
      const productInfo = await prisma.product.findUnique({
        where: { id: product.id },
        select: { in_stock: true },
      });

      if (!productInfo) {
        throw new Error(`Product ${product.id} not found`);
      }

      if (product.quantity > productInfo.in_stock) {
        throw new Error(
          `Product ${product.id}: requested quantity ${product.quantity} exceeds in-stock amount`,
        );
      }

      const newGame = await prisma.cart.upsert({
        where: {
          account_id_product_id: {
            account_id: accountID,
            product_id: product.id,
          },
        },
        create: {
          account_id: accountID,
          product_id: product.id,
          quantity: product.quantity,
        },
        update: {
          quantity: product.quantity,
        },
        select: {
          product: {
            select: {
              id: true,
              name: true,
              publisher: { select: { name: true } },
              product_image: {
                select: { public_id: true },
                where: { is_profile_img: true },
              },
              price: true,
              price_sale: true,
            },
          },
          quantity: true,
        },
      });

      const formatResult = {
        name: newGame.product.name,
        publisher_name: newGame.product.publisher.name,
        profile_img: getImage(newGame.product.product_image[0]?.public_id),
        price: newGame.product.price,
        price_sale: newGame.product.price_sale,
        total_save: newGame.product.price - newGame.product.price_sale,
        quantity: newGame.quantity,
      };

      result.products.push(formatResult);
    }),
  );

  return result;
}

export async function removeGame(accountID, params) {
  const { productID } = params;
  const existedGame = await prisma.cart.findUnique({
    select: {
      product_id: true,
    },
    where: {
      account_id_product_id: {
        account_id: accountID,
        product_id: Number(productID),
      },
    },
  });

  if (!existedGame) {
    throw new Error(`Product ${productID} is not available in cart`);
  }

  const deletedGame = await prisma.cart.delete({
    where: {
      account_id_product_id: {
        account_id: accountID,
        product_id: Number(productID),
      },
    },
  });
  return deletedGame;
}

export async function updateGame(accountID, product) {
  const { productID, quantity } = product;
  const existedGame = await prisma.cart.findUnique({
    select: {
      product: {
        select: {
          in_stock: true,
        },
      },
    },
    where: {
      account_id_product_id: {
        account_id: accountID,
        product_id: productID,
      },
    },
  });

  if (!existedGame) {
    throw new Error(`Game ${productID} is not available in cart`);
  }

  if (existedGame.product.in_stock < quantity) {
    throw new Error(`Game ${productID} is out of stock`);
  }

  const updatedGame = await prisma.cart.update({
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
        account_id: accountID,
        product_id: productID,
      },
    },
  });

  const price = updatedGame.product.price * product.quantity,
    price_sale = updatedGame.product.price_sale * product.quantity;
  const formatResult = {
    price: price,
    price_sale: price_sale,
    total_save: price - price_sale,
  };
  return formatResult;
}
