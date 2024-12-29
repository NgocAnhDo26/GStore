import { prisma } from "../../config/config.js";

export const getAllProductsWithKeys = async () => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        in_stock: true,
      },
    });

    const gameKeys = await prisma.key_game.findMany({
      select: {
        id: true,
        key_code: true,
        is_used: true,
        product_id: true,
      },
    });

    const gameKeyMap = gameKeys.reduce((acc, key) => {
      if (!acc[key.product_id]) {
        acc[key.product_id] = [];
      }
      acc[key.product_id].push({
        id: key.id,
        key_code: key.key_code,
        is_used: key.is_used,
      });
      return acc;
    }, {});

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      in_stock: product.in_stock,
      keys: gameKeyMap[product.id] || [],
    }));
  } catch (error) {
    console.error("Error fetching grouped game keys:", error);
    throw error;
  }
};


export const addGameKey = async (productId, keyCode) => {
  try {
    const newKey = await prisma.key_game.create({
      data: {
        product_id: parseInt(productId),
        key_code: keyCode,
      },
    });

    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { in_stock: { increment: 1 } },
    });

    return newKey;
  } catch (error) {
    console.error("Error adding game key:", error);
    throw error;
  }
};
export const checkExistGameKey = async (keyCode) => {
  try {
    const existingKey = await prisma.key_game.findFirst({
      where: { key_code: keyCode },
    });
    return existingKey;
  } catch (error) {
    console.error("Error checking existing game key:", error);
    throw error;
  }
}
