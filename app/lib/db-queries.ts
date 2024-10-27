"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

/* Accounts --------------------------------------- */

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

const findUserByEmailDbInput = function (email: string) {
  return Prisma.validator<Prisma.usersWhereInput>()({ email });
};

const dbFindUserByEmail = async function (email: string) {
  return await prisma.users.findUnique({
    where: findUserByEmailDbInput(email),
  });
};

/* Invoices --------------------------------------- */

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const dbCreateInvoice = async function (input: Prisma.invoicesCreateInput) {
  await prisma.invoices.create({ data: input });
};

const dbUpdateInvoice = async function (
  id: string,
  input: Prisma.invoicesUpdateInput
) {
  await prisma.invoices.update({ where: { id }, data: input });
};

const dbDeleteInvoice = async function (id: string) {
  await prisma.invoices.delete({ where: { id } });
};

export async function createInvoiceUsingForm(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = InvoiceDbCreateInput.safeParse({
    customer_id: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
    date: new Date().toISOString(),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const { customer_id, amount, status, date } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await dbCreateInvoice({ customer_id, amount: amountInCents, status, date });
  } catch {
    return { message: "Database Error: Failed to Create Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoiceUsingForm(id: string, formData: FormData) {
  const { customer_id, amount, status, date } = InvoiceDbCreateInput.parse({
    customer_id: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
    date: new Date().toISOString(),
  });

  const amountInCents = amount * 100;

  try {
    await dbUpdateInvoice(id, {
      customer_id,
      amount: amountInCents,
      status,
      date,
    });
  } catch {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await dbDeleteInvoice(id);
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice ." };
  } catch {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}
