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
                console.log('🔐 [NextAuth DEBUG] Tentativa de login:', credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.log('❌ [NextAuth DEBUG] Credenciais vazias');
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    console.log('👤 [NextAuth DEBUG] Usuário encontrado:', user ? `ID: ${user.id} - Role: ${user.role}` : 'NÃO');

                    if (!user) {
                        console.log('❌ [NextAuth DEBUG] Usuário não existe no banco');
                        return null;
                    }

                    console.log('🔑 [NextAuth DEBUG] Hash no banco:', user.passwordHash.substring(0, 10) + '...');

                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.passwordHash
                    );

                    console.log('✅ [NextAuth DEBUG] Senha válida:', isValid);

                    if (!isValid) {
                        console.log('❌ [NextAuth DEBUG] Senha incorreta. Senha enviada:', credentials.password);
                        return null;
                    }

                    console.log('🎉 [NextAuth DEBUG] Login bem-sucedido para:', user.email);
                    return {
                        id: user.id.toString(),
                        name: user.name || "",
                        email: user.email,
                    };
                } catch (error) {
                    console.error('💥 [NextAuth DEBUG] Erro no authorize:', error);
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
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
