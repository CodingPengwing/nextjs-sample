import type { NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { sql } from "@vercel/postgres";
// import type { User } from "@/app/lib/definitions";
// import { z } from "zod";
// import bcrypt from "bcrypt";

// async function getUser(email: string): Promise<User | undefined> {
//   try {
//     const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
//     return user.rows[0];
//   } catch (error) {
//     console.error("Failed to fetch user:", error);
//     throw new Error("Failed to fetch user.");
//   }
// }

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: {
    //       label: "Email:",
    //       type: "text",
    //       placeholder: "Your email",
    //     },
    //     password: {
    //       label: "Password:",
    //       type: "password",
    //       placeholder: "Your password",
    //     },
    //   },
    //   async authorize(credentials) {
    //     const parsedCredentials = z
    //       .object({ email: z.string().email(), password: z.string().min(6) })
    //       .safeParse(credentials);

    //     if (parsedCredentials.success) {
    //       const { email, password } = parsedCredentials.data;
    //       const user = await getUser(email);
    //       if (!user) return null;

    //       const passwordsMatch = await bcrypt.compare(password, user.password);

    //       if (passwordsMatch) return user;
    //     }

    //     console.log("Invalid credentials");
    //     return null;
    //   },
    // }),
  ], // Add providers with an empty array for now
} satisfies NextAuthConfig;
