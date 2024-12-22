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

  // upload images to cloudinary
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

// edit product
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
  } = product;
  if (!id) {
    return { message: "Missing product id" };
  }
  const existGame = await prisma.product.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
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
  if (images && images.length) {
    // delete old images from cloudinary
    await Promise.all(
      existGame.product_image.map((img) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(img.public_id, (error, result) => {
            if (error) reject(error);
            resolve(result);
          });
        });
      }),
    );
    // remove old images from db
    await prisma.product_image.deleteMany({
      where: { product_id: existGame.id },
    });
    // upload new images
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
            product_id: existGame.id,
            public_id: result.public_id,
            is_profile_img: idx === 0,
          },
        });
      }),
    );
  }
  if (categories && categories.length) {
    await prisma.category_product.deleteMany({
      where: { product_id: existGame.id },
    });
    await Promise.all(
      categories.map(async (cat) => {
        const c = await prisma.category.upsert({
          where: { name: cat },
          update: {},
          create: { name: cat },
          select: { id: true },
        });
        await prisma.category_product.create({
          data: {
            category_id: c.id,
            product_id: existGame.id,
          },
        });
      }),
    );
  }
  return { message: "Product updated successfully" };
}

// remove product
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
  // delete images from cloudinary
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
