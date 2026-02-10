import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Ensure NEXTAUTH_URL and NEXTAUTH_SECRET are set to avoid production errors
if (!process.env.NEXTAUTH_URL) {
    // Prefer explicit NEXT_PUBLIC_SITE_URL, fallback to localhost with PORT or 3000
    process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${process.env.PORT || 3000}`;
    console.warn('[NextAuth] NEXTAUTH_URL was not set. Using fallback:', process.env.NEXTAUTH_URL);
}

if (!process.env.NEXTAUTH_SECRET) {
    // Generate a temporary secret to avoid NextAuth throwing NO_SECRET in production
    // NOTE: For security, set a stable NEXTAUTH_SECRET in the environment for production.
    process.env.NEXTAUTH_SECRET = crypto.randomBytes(48).toString('base64');
    console.warn('[NextAuth] NEXTAUTH_SECRET was not set. Generated a temporary secret — set NEXTAUTH_SECRET in production env for security.');
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "E-mail", type: "email" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) {
                        return null;
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.passwordHash
                    );

                    if (!isValid) {
                        return null;
                    }

                    return {
                        id: user.id.toString(),
                        name: user.name || "",
                        email: user.email,
                    };
                } catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('💥 [NextAuth DEBUG] Erro no authorize:', error);
                    }
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async session({ session, token }) {
            if (session?.user && token?.sub) {
                session.user.id = token.sub;
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = user.role;
            }
            return token;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
