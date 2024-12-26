import express from "express";
import * as service from "./game_keyService.js";
import { prisma } from "../../config/config.js";
const router = express.Router();


router.get("/", async (req, res) => {
    try {
      // Fetch all products (games)
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          in_stock: true,
        },
      });
  
      // Fetch all game keys with product details
      const gameKeys = await prisma.key_game.findMany({
        select: {
          id: true,
          key_code: true,
          is_used: true,
          product_id: true,
        },
      });
  
      // Group game keys by product_id
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
  
      // Combine product and game key data
      const result = products.map((product) => ({
        id: product.id,
        name: product.name,
        in_stock: product.in_stock,
        keys: gameKeyMap[product.id] || [], // Empty array if no keys
      }));
  
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching grouped game keys:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  
// Add a new game key and update product stock
router.post("/", async (req, res) => {
    const { productId, keyCode } = req.body;

    if (!productId || !keyCode) {
        return res.status(400).json({ message: "Missing required fields: productId and keyCode" });
    }

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

        return res.status(201).json({
            message: "Game key added successfully",
            gameKey: newKey,
        });
    } catch (error) {
        console.error("Error adding game key:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
export default router;

