import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
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
        async session({ session, token }: any) {
            if (session?.user && token?.sub) {
                session.user.id = token.sub;
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.sub = user.id;
                token.role = user.role;
            }
            return token;
        },
    },
    pages: {
        // signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
