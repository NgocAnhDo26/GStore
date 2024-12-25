import { prisma } from "../../config/config.js";
import { getImage } from "../util/util.js";
export async function fetchBestSellersProducts() {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        price_sale: true,
        product_image: {
          select: {
            public_id: true,
          },
          where: {
            is_profile_img: true,
          },
        },
      },
      orderBy: {
        sales: "desc", // The most sale products
      },
      take: 12,
    });
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      price_sale: product.price_sale,
      profile_img: getImage(product.product_image[0]?.public_id),
    }));
  }
  
  export async function fetchFeatureProducts() {
    const products = await prisma.$queryRaw`
    SELECT p.id, p.name, p.price, p.price_sale, pi.public_id as profile_img
    FROM product p
    JOIN product_image pi on p.id = pi.product_id
    LEFT JOIN product_review pr ON p.id = pr.product_id
    WHERE pi.is_profile_img = true
    GROUP BY p.id, pi.public_id
    ORDER BY COALESCE(AVG(pr.rating), 0) DESC
    LIMIT 12;
  `;
    return products;
  }
