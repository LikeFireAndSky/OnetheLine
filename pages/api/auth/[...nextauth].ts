import GoogleProvider from "next-auth/providers/google";
import NextAuth, { getServerSession } from "next-auth";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  secret: process.env.SECRET,
};

export const getSession = () => getServerSession(authOptions);

export default NextAuth(authOptions);
