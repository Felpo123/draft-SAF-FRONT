import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { geoserverApi } from './api/geoserver/geoserverApi';

export const { handlers, signIn, signOut, auth } = NextAuth({
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

          // logic to verify if the user exists
          // user = await getUserFromDb(credentials.email, pwHash);

          // if (!user) {
          //   // No user found, so this is their first attempt to login
          //   // meaning this is also the place you could do registration
          //   throw new Error('User not found.');
          // }

          // return user object with their profile data
          const auth = await geoserverApi.authenticate(
            credentials.username as string,
            credentials.password as string
          );

          if (auth) {
            user = {
              name: credentials.username as string,
              email: credentials.username as string,
            };
          }

          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
});
