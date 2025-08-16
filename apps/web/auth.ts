/*  eslint-disable  */
import NextAuth from "next-auth";
import { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "@workspace/db";
import { JWT } from "next-auth/jwt";
import { apiClient } from "./lib/api-client";
import { CustomAuthError } from "./lib/auth/custom-auth-error";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    accessToken: string;
    refreshToken?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      accessToken: string;
      refreshToken?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: Role;
    accessToken: string;
    refreshToken?: string;
  }
}

type BackendAuthResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await apiClient.post("/api/v1/auth/login", {
          body: JSON.stringify(credentials),
        });

        if (response.error) {
          throw new CustomAuthError(response.error);
        }

        const data: BackendAuthResponse = await response.data;

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          accessToken: data.tokens.accessToken,
          refreshToken: data.tokens.refreshToken,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
