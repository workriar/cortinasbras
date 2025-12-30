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
                console.log('🔐 [NextAuth] Tentativa de login:', credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.log('❌ [NextAuth] Credenciais vazias');
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    console.log('👤 [NextAuth] Usuário encontrado:', user ? 'SIM' : 'NÃO');

                    if (!user) {
                        console.log('❌ [NextAuth] Usuário não existe no banco');
                        return null;
                    }

                    console.log('🔑 [NextAuth] Testando senha...');
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.passwordHash
                    );

                    console.log('✅ [NextAuth] Senha válida:', isValid);

                    if (!isValid) {
                        console.log('❌ [NextAuth] Senha incorreta');
                        return null;
                    }

                    console.log('🎉 [NextAuth] Login bem-sucedido para:', user.email);
                    return {
                        id: user.id.toString(),
                        name: user.name || "",
                        email: user.email,
                    };
                } catch (error) {
                    console.error('💥 [NextAuth] Erro no authorize:', error);
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
            }
            return session;
        },
        async jwt({ token, user }: any) {
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
