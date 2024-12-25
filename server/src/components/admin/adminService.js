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
    return { message: "Missing fields" };
  }

  const existGame = await prisma.product.findUnique({
    select: { id: true },
    where: { name: name },
  });

  if (existGame) {
    return { message: "Game already exists" };
  }

  const publisher = await prisma.publisher.upsert({
    where: { name: publisher_name },
    update: {},
    create: { name: publisher_name },
    select: { id: true },
  });

  const newProduct = await prisma.product.create({
    create: {
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
        create: {
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
    return { message: "Missing product id" };
  }
  const existGame = await prisma.product.findUnique({
    where: { id: Number(id) },
    select: {
      product_image: { select: { public_id: true } },
    },
  });
  if (!existGame) {
    return { message: "Game is not available" };
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
      old_images.map((public_id) => {
        // Remove old image from db
        prisma.product_image.delete({
          where: {
            public_id: public_id,
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
    const isExistProfileImg = await prisma.product_image.findUnique({
      where: {
        product_id: id,
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
            product_id: id,
            public_id: result.public_id,
            is_profile_img: isExistProfileImg ? false : idx === 0,
          },
        });
      }),
    );
  }
  
  if (categories.length) {
    await Promise.all(
      categories.map(async (cat) => {
        // Add new category
        const c = await prisma.category.upsert({
          where: { name: cat },
          update: {},
          create: { name: cat },
          select: { id: true },
        });
        // Remove old product category
        await prisma.category_product
          .delete({
            where: {
              category_id_product_id: {
                category_id: c.id,
                product_id: id,
              },
            },
          })
          .catch(async (err) => {
            if (err.code === "P2015") {
              // Prisma code P2015: "A related record could not be found. {details}"
              // delete a not exist product category
              // add new product category here
              await prisma.category_product.create({
                data: {
                  category_id: c.id,
                  product_id: id,
                },
              });
            }
          });
      }),
    );
  }
  return { message: "Product updated successfully" };
}

// Remove product
export async function removeProduct(product_id) {
  const existGame = await prisma.product.findUnique({
    select: {
      id: true,
      product_image: {
        select: { public_id: true },
      },
    },
    where: { id: product_id },
  });
  if (!existGame) {
    return { message: "Game is not available" };
  }
  await prisma.category_product.deleteMany({
    where: { product_id: product_id },
  });
  // Delete images from cloudinary
  await Promise.all(
    existGame.product_image.map((image) => {
      new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(image.public_id, (error, result) => {
          if (error) reject(error);
          resolve(result);
        });
      });
    }),
  );
  await prisma.product_image.deleteMany({
    where: { product_id: product_id },
  });
  await prisma.product.delete({
    where: { id: product_id },
  });
  return { message: "Game removed successfully" };
}

export async function viewGameSales() {}
