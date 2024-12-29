import { prisma, cloudinary } from "../../config/config.js";

// Add new product to database
export async function addNewProduct(product, images) {
  const {
    name,
    description,
    price,
    price_sale,
    in_stock,
    publisher_name,
    categories,
  } = product;

  if (
    !name ||
    !description ||
    !price ||
    !price_sale ||
    !in_stock ||
    !publisher_name ||
    !categories.length ||
    !images.length
  ) {
    throw new Error("Missing fields");
  }

  const existGame = await prisma.product.findUnique({
    select: { id: true },
    where: { name: name },
  });

  if (existGame) {
    throw new Error("Game already exists");
  }

  const publisher = await prisma.publisher.upsert({
    where: { name: publisher_name },
    update: {},
    create: { name: publisher_name },
    select: { id: true },
  });

  const newProduct = await prisma.product.create({
    data: {
      name: name,
      description: description,
      price: Number(price),
      price_sale: Number(price_sale),
      in_stock: Number(in_stock),
      publisher: { connect: { id: publisher.id } },
    },
    select: { id: true },
  });

  // Upload images to cloudinary
  await Promise.all(
    images.map(async (image, idx) => {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream((error, result) => {
            if (error) reject(error);
            resolve(result);
          })
          .end(image.buffer);
      });

      await prisma.product_image.create({
        data: {
          product_id: newProduct.id,
          public_id: result.public_id,
          is_profile_img: idx === 0,
        },
      });
    }),
  );

  await Promise.all(
    categories.map(async (cat) => {
      const category = await prisma.category.upsert({
        where: { name: cat },
        update: {},
        create: { name: cat },
        select: { id: true },
      });
      await prisma.category_product.create({
        data: {
          category_id: category.id,
          product_id: newProduct.id,
        },
      });
    }),
  );
  return { message: "Add new game successfully" };
}

// Edit product
export async function editProduct(product, images) {
  const {
    id,
    name,
    description,
    price,
    price_sale,
    in_stock,
    publisher_name,
    categories,
    old_images, // Send by public_id
  } = product;

  if (!id) {
    throw new Error("Missing product id");
  }

  const existGame = await prisma.product.findUnique({
    where: { id: Number(id) },
    select: {
      product_image: { select: { public_id: true } },
    },
  });

  if (!existGame) {
    throw new Error("Game is not available");
  }

  if (name) {
    const existName = await prisma.product.findUnique({
      where: {
        name: name,
        NOT: { id: id },
      },
      select: {
        id: true,
      },
    });

    if (existName) {
      throw new Error("Name exists");
    }
  }

  const publisher = await prisma.publisher.upsert({
    where: { name: publisher_name },
    update: {},
    create: { name: publisher_name },
    select: { id: true },
  });

  await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name,
      description,
      price: Number(price),
      price_sale: Number(price_sale),
      in_stock: Number(in_stock),
      publisher: { connect: { id: publisher.id } },
    },
  });

  // Delete image
  if (old_images.length) {
    await Promise.all(
      old_images.map(async (public_id) => {
        // Remove old image from db
        await prisma.product_image.delete({
          where: {
            product_id_public_id: {
              product_id: Number(id),
              public_id: public_id,
            },
          },
        });
        // Delete old image from cloudinary
        return new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) reject(error);
            resolve(result);
          });
        });
      }),
    );
  }

  if (images.length) {
    // Check if this product has profile image
    const isExistProfileImg = await prisma.product_image.findFirst({
      where: {
        product_id: Number(id),
        is_profile_img: true,
      },
    });
    // Upload new images
    await Promise.all(
      images.map(async (image, idx) => {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream((error, result) => {
              if (error) reject(error);
              resolve(result);
            })
            .end(image.buffer);
        });
        await prisma.product_image.create({
          data: {
            product_id: Number(id),
            public_id: result.public_id,
            is_profile_img: isExistProfileImg ? false : idx === 0,
          },
        });
      }),
    );
  }

  // Update categories
  const existingCategories = await prisma.category_product.findMany({
    where: { product_id: Number(id) },
    select: { category: { select: { name: true } } },
  });

  const existingCatNames = existingCategories.map((c) => c.category.name);

  // Remove old categories
  const toRemove = existingCatNames.filter(
    (name) => !categories.includes(name),
  );
  if (toRemove.length) {
    await prisma.category_product.deleteMany({
      where: {
        product_id: Number(id),
        category: { name: { in: toRemove } },
      },
    });
  }

  // Insert new categories
  const toAdd = categories.filter((name) => !existingCatNames.includes(name));
  if (toAdd.length) {
    for (const cat of toAdd) {
      const c = await prisma.category.upsert({
        where: { name: cat },
        update: {},
        create: { name: cat },
        select: { id: true },
      });
      await prisma.category_product.create({
        data: {
          category_id: c.id,
          product_id: Number(id),
        },
      });
    }
  }

  return { message: "Product updated successfully" };
}

// Remove product
export async function removeProduct(productID) {
  const existGame = await prisma.product.findUnique({
    select: {
      id: true,
      product_image: {
        select: { public_id: true },
      },
    },
    where: { id: productID },
  });
  if (!existGame) {
    throw new Error("Game is not available");
  }

  // Delete images from Cloudinary
  await Promise.all(
    existGame.product_image.map(
      (image) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(image.public_id, (error, result) => {
            if (error) reject(error);
            resolve(result);
          });
        }),
    ),
  );

  // Cascading delete product
  await prisma.product.delete({
    where: { id: productID },
  });

  return { message: "Game removed successfully" };
}

export async function viewGameSales(date) {
  const { duration, dateStr } = date;
  if (!["day", "month", "year"].includes(duration)) {
    throw new Error("Missing or invalid duration");
  }

  // Parse dateStr "DD/MM/YYYY"
  const [day, month, year] = dateStr.split("/").map(Number);
  let fromDate, toDate;

  if (duration === "day") {
    fromDate = new Date(year, month - 1, day, 0, 0, 0);
    toDate = new Date(year, month - 1, day, 23, 59, 59);
  } else if (duration === "month") {
    fromDate = new Date(year, month - 1, 1, 0, 0, 0);
    toDate = new Date(year, month, 1, 0, 0, 0); // Next month
  } else {
    fromDate = new Date(year, 0, 1, 0, 0, 0);
    toDate = new Date(year + 1, 0, 1, 0, 0, 0); // Next year
  }

  const data = await prisma.order_product.findMany({
    where: {
      orders: {
        status: "completed",
        create_time: { gte: fromDate, lte: toDate },
      },
    },
    select: {
      quantity: true,
      product: {
        select: {
          id: true,
          name: true,
          price_sale: true,
          category_product: {
            select: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let totalSales = 0;
  let totalRevenue = 0;
  const categoryMap = new Map();
  const productMap = new Map();

  for (const row of data) {
    const { product } = row;
    const sales = row.quantity;
    const revenue = product.price_sale * row.quantity;
    totalSales += sales;
    totalRevenue += revenue;

    if (!productMap.has(product.id)) {
      productMap.set(product.id, { game: product.name, sales: 0, revenue: 0 });
    }
    productMap.get(product.id).sales += sales;
    productMap.get(product.id).revenue += revenue;

    for (const cp of product.category_product) {
      const catName = cp.category.name;
      if (!categoryMap.has(catName)) {
        categoryMap.set(catName, { category: catName, sales: 0, revenue: 0 });
      }
      categoryMap.get(catName).sales += sales;
      categoryMap.get(catName).revenue += revenue;
    }
  }

  const saleByCategory = [...categoryMap.values()];
  const saleByGame = [...productMap.values()];

  return {
    totalSale: { sales: totalSales, revenue: totalRevenue },
    saleByCategorySortBySales: [...saleByCategory].sort(
      (a, b) => b.sales - a.sales,
    ),
    saleByCategorySortByRevenue: [...saleByCategory].sort(
      (a, b) => b.revenue - a.revenue,
    ),
    saleByGameSortBySales: [...saleByGame].sort((a, b) => b.sales - a.sales),
    saleByGameSortByRevenue: [...saleByGame].sort(
      (a, b) => b.revenue - a.revenue,
    ),
  };
}
