import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.users.create({
    data: {
      email: "alice@nextmail.com",
      name: "alice",
      password: await bcrypt.hash("123456", 10),
    },
  });
  const allUsers = await prisma.users.findMany();
  console.log(allUsers);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
