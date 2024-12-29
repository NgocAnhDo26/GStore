import { prisma } from "../../config/config.js";
import bcrypt from "bcrypt";

// Function to fetch accounts with filters (query)
export async function fetchAccountWithQuery(query) {
  let filters = {
    AND: [],
  };

  // Keyword search filters
  if (query.email) {
    filters.AND.push({
      email: { contains: query.email },
    });
  }

  if (query.username) {
    filters.AND.push({
      username: { contains: query.username },
    });
  }

  // Filter admin
  if (query.admin) {
    filters.AND.push({
      is_admin: Boolean(Number(query.admin)), // query.admin: 1 or 0
    });
  }

  // Filter lock user
  if (query.lock) {
    filters.AND.push({
      is_lock: Boolean(Number(query.lock)), // query.lock: 1 or 0
    });
  }

  // Prepare sorting by email or username or create_time, ex: email-asc, username-desc
  let orderBy = {};
  if (query.order) {
    const [field, direction] = query.order.split("-");
    orderBy[field] = direction;
  }

  // Fetch accounts with filter and search
  const accounts = await prisma.account.findMany({
    where: filters,
    orderBy: orderBy,
  });

  return accounts;
}

// Function to fetch account by accountID
export async function fetchAccountByID(accountID) {
  // Fetch the account details
  const account = await prisma.account.findUnique({
    where: {
      id: accountID,
    },
  });

  return account;
}

// Add new account to database
export async function addNewAccount(account) {
  const {
    email,
    username,
    password,
    phone,
    address,
    birthdate,
    sex,
    is_lock,
    is_admin,
  } = account;

  if (!email || !username || !password) {
    throw new Error("Missing fields");
  }

  const existEmail = await prisma.account.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });

  if (existEmail) {
    throw new Error("Email exists");
  }

  const existUsername = await prisma.account.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });

  if (existUsername) {
    throw new Error("Username exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.account.create({
    data: {
      email: email,
      username: username,
      password: hashedPassword,
      ...(phone && { phone: phone }), // Include phone only if defined
      ...(address && { address: address }),
      ...(birthdate && { birthdate: birthdate }),
      ...(sex && { sex: sex }),
      ...(is_lock && { is_lock: is_lock }),
      ...(is_admin && { is_admin: is_admin }),
    },
    select: { id: true },
  });

  return { message: "Add new account successfully" };
}

// Edit account
export async function editAccount(account) {
  const {
    id,
    email,
    username,
    password,
    phone,
    address,
    birthdate,
    sex,
    is_lock,
    is_admin,
  } = account;

  if (!id) {
    throw new Error("Missing account id");
  }

  const existAccount = await prisma.account.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
    },
  });

  if (!existAccount) {
    throw new Error("Account is not available");
  }

  if (email) {
    const existEmail = await prisma.account.findUnique({
      where: {
        email: email,
        NOT: { id: id },
      },
      select: {
        id: true,
      },
    });

    if (existEmail) {
      throw new Error("Email exists");
    }
  }

  if (username) {
    const existUsername = await prisma.account.findUnique({
      where: {
        username: username,
        NOT: { id: id },
      },
      select: {
        id: true,
      },
    });

    if (existUsername) {
      throw new Error("Username exists");
    }
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : password;

  await prisma.account.update({
    where: { id: Number(id) },
    data: {
      ...(email && { email: email }),
      ...(username && { username: username }),
      ...(hashedPassword && { password: hashedPassword }),
      ...(phone && { phone: phone }),
      ...(address && { address: address }),
      ...(birthdate && { birthdate: birthdate }),
      ...(sex && { sex: sex }),
      ...(is_lock && { is_lock: is_lock }),
      ...(is_admin && { is_admin: is_admin }),
    },
  });

  return { message: "Account updated successfully" };
}

// Remove account
export async function removeProduct(accountID) {
  const existAccount = await prisma.account.findUnique({
    select: {
      id: true,
    },
    where: { id: accountID },
  });

  if (!existAccount) {
    throw new Error("Account is not available");
  }

  // Cascading delete product
  await prisma.account.delete({
    where: { id: accountID },
  });

  return { message: "Account removed successfully" };
}
