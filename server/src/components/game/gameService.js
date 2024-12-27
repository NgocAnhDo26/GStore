import { prisma } from "../../config/config.js";
import { getImage } from "../util/util.js";

// Function to fetch products with filters (query)
export async function fetchProductWithQuery(query) {
  let filters = {
    AND: [],
  };

  // Pagination settings
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 12;
  let offset = (page - 1) * limit;

  // Keyword search filters
  if (query.keyword) {
    filters.AND.push({
      OR: [
        { name: { contains: query.keyword } },
        { description: { contains: query.keyword } },
        { publisher: { name: { contains: query.keyword } } },
      ],
    });
  }

  if (query.category) {
    const categoriesKeywords = query.category.split("-");
    filters.AND.push({
      AND: categoriesKeywords.map((name) => ({
        category_product: {
          some: {
            category: {
              name: name,
            },
          },
        },
      })),
    });
  }

  // Price range filters
  if (query.minPrice || query.maxPrice) {
    filters.AND.push({
      price_sale: {
        gte: query.minPrice ? Number(query.minPrice) : 0,
        lte: query.maxPrice ? Number(query.maxPrice) : Number.MAX_SAFE_INTEGER,
      },
    });
  }

  // Prepare sorting
  let orderBy = {};
  if (query.order) {
    const [field, direction] = query.order.split("-");
    if (field == "price") {
      orderBy.price_sale = direction;
    } else {
      orderBy[field] = direction;
    }
  }

  // Fetch products with average ratings and category names
  const products = await prisma.product.findMany({
    where: filters,
    select: {
      id: true,
      name: true,
      price: true,
      price_sale: true,
      product_image: {
        select: { public_id: true },
        where: { is_profile_img: true },
      },
      category_product: {
        select: {
          category: {
            select: { name: true },
          },
        },
      },
      product_review: {
        select: { rating: true },
      },
    },
    orderBy: orderBy,
  });

  if (!products.length) {
    return []; // Empty products
  }

  // Process products to include average rating and category names
  const formattedProducts = products.map((product) => {
    const totalRating = product.product_review.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const averageRating = product.product_review.length
      ? Math.round((totalRating / product.product_review.length) * 10) / 10 // Round to 1 decimal place
      : null;

    const categoryNames = product.category_product.map(
      (cp) => cp.category.name,
    );

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      price_sale: product.price_sale,
      profile_img: getImage(product.product_image[0]?.public_id),
      averageRating,
      categories: categoryNames,
    };
  });

  // Filter by average rating ranges
  let filteredProducts = formattedProducts;
  if (query.rating) {
    switch (query.rating) {
      case "4-5":
        filteredProducts = filteredProducts.filter(
          (product) => product.averageRating >= 4 && product.averageRating <= 5,
        );
        break;
      case "3-4":
        filteredProducts = filteredProducts.filter(
          (product) => product.averageRating >= 3 && product.averageRating < 4,
        );
        break;
      case "2-3":
        filteredProducts = filteredProducts.filter(
          (product) => product.averageRating >= 2 && product.averageRating < 3,
        );
        break;
      case "<2":
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.averageRating !== null && product.averageRating < 2,
        );
        break;
    }
  }

  // Compute total pages after filtering
  const totalProducts = filteredProducts.length;
  const totalPage = Math.ceil(totalProducts / limit);

  // Return paginated products
  if (!filteredProducts.length) {
    return []; // Empty products
  }
  return {
    products: filteredProducts.slice(offset, offset + limit),
    totalPage,
    currentPage: page,
  };
}

// Function to fetch product by product ID
export async function fetchProductByID(productID) {
  // Fetch the product details
  const product = await prisma.product.findUnique({
    where: {
      id: productID,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      price_sale: true,
      create_time: true,
      publisher: {
        select: {
          name: true,
        },
      },
      category_product: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      product_image: {
        select: {
          public_id: true,
        },
        orderBy: {
          is_profile_img: "desc",
        },
      },
      product_review: {
        select: {
          account: {
            select: {
              username: true,
            },
          },
          create_time: true,
          content: true,
          rating: true,
        },
      },
    },
  });

  if (product != null) {
    // Compute the average rating
    let averageRating = null;
    if (product && product.product_review.length > 0) {
      const totalRating = product.product_review.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      averageRating =
        Math.round((totalRating / product.product_review.length) * 10) / 10;
    }

    const formattedProducts = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      price_sale: product.price_sale,
      create_time: product.create_time,
      publisher: product.publisher.name,
      categories: product.category_product.map((item) => item.category.name),
      profile_img: getImage(product.product_image[0].public_id),
      other_img: product.product_image
        .slice(1)
        .map((item) => getImage(item.public_id)),
      product_review: product.product_review.map((item) => ({
        username: item.account.username,
        create_time: item.create_time,
        content: item.content,
        rating: item.rating,
      })),
    };
    formattedProducts.averageRating = averageRating;
    return formattedProducts;
  }
  return {}; // Empty product
}

export async function fetchProductByListID(listID) {
  const { listProductID } = listID;
  const products = await prisma.product.findMany({
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
    where: {
      id: {
        in: listProductID,
      },
    },
  });
  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    price_sale: product.price_sale,
    publisher: product.publisher.name,
    profile_img: getImage(product.product_image[0].public_id),
  }));
  return formattedProducts;
}

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
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    price_sale: product.price_sale,
    profile_img: getImage(product.profile_img),
  }));
}

// Fetch categories and number of games in each category
export async function fetchCategories() {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      _count: {
        select: {
          category_product: true,
        },
      },
    },
  });
  const formattedCategories = categories.map((category) => ({
    name: category.name,
    count: category._count.category_product,
  }));
  return formattedCategories;
}
