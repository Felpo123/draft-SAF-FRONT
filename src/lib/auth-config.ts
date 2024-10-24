import NextAuth, { User as NextAuthUser } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { geoserverApi } from './api/geoserver/geoserverApi';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    role?: string;
  }
  interface Session {
    user: User;
    token: JWT;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          // const auth = await geoserverApi.authenticate(
          //   credentials.username as string,
          //   credentials.password as string
          // );

          const role = await geoserverApi.getUserRole(
            credentials.username as string,
            credentials.password as string
          );

          if (role) {
            user = {
              name: credentials.username as string,
              role: role.roles[0],
            };
          }

          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as string;
      return session;
    },
  },
});
