import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import Staff from "@/models/Staff";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();

        // 1. Check Admin
        const admin = await Admin.findOne({ email: credentials.email });
        if (admin) {
          const isMatch = await admin.comparePassword(credentials.password);
          if (isMatch) {
            return {
              id: admin._id.toString(),
              email: admin.email,
              name: admin.name,
              role: "admin",
            };
          }
        }

        // 2. Check Staff
        const staff = await Staff.findOne({ email: credentials.email, isActive: true });
        if (staff) {
          const isMatch = await staff.comparePassword(credentials.password);
          if (isMatch) {
            return {
              id: staff._id.toString(),
              email: staff.email,
              name: staff.name,
              role: "staff",
            };
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // We might need separate login pages or handle redirection
  },
  secret: process.env.NEXTAUTH_SECRET,
};
