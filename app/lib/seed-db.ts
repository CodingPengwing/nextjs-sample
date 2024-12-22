"use server";
import { z } from "zod";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const InvoiceDbCreateInput = z.object({
  customer_id: z.string({ invalid_type_error: "Please select a customer" }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0" }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
}) satisfies z.Schema<Prisma.invoicesCreateInput>;

const prisma = new PrismaClient().$extends({
  query: {
    invoices: {
      create({ args, query }) {
        args.data = InvoiceDbCreateInput.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = InvoiceDbCreateInput.partial().parse(args.data);
        return query(args);
      },
      updateMany({ args, query }) {
        args.data = InvoiceDbCreateInput.partial().parse(args.data);
        return query(args);
      },
      upsert({ args, query }) {
        args.create = InvoiceDbCreateInput.parse(args.create);
        args.update = InvoiceDbCreateInput.partial().parse(args.update);
        return query(args);
      },
    },
  },
});

type NewAccountDbInput = {
  name: string;
  email: string;
  password: string;
};

const makeNewAccountDbInput = function ({
  name,
  email,
  password,
}: NewAccountDbInput) {
  return Prisma.validator<Prisma.usersCreateInput>()({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
  });
};

const dbCreateNewAccount = async function (input: NewAccountDbInput) {
  await prisma.users.create({ data: makeNewAccountDbInput(input) });
};

const main = async () => {
  await dbCreateNewAccount({
    name: "Evan",
    email: "evan@nextmail.com",
    password: "123456",
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
