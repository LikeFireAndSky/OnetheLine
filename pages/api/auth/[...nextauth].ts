import GoogleProvider from 'next-auth/providers/google';
import NextAuth, { getServerSession } from 'next-auth';
import { getUserById, saveUser } from '@/lib/user';

export type SessionType = {
	user: {
		name: string;
		email: string;
		image: string;
	};
	accessToken: string;
};

const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],

	callbacks: {
		async jwt({
			token,
			account,
			profile,
		}: {
			token: any;
			account: any;
			profile?: any;
		}) {
			// 최초 로그인 시 access token 및 userId 저장
			if (account && profile) {
				token.accessToken = account.access_token;
				token.userId = profile.sub;

				// 유저가 이미 있는지 확인 후 없으면 저장
				const existingUser = await getUserById(token.userId);
				if (!existingUser) {
					await saveUser({
						userId: token.userId,
						accessToken: token.accessToken,
						name: profile.name,
						email: profile.email,
					});
				}
			}
			return token;
		},
		async session({ session, token }: { session: any; token: any }) {
			// 세션에 access token 포함
			session.accessToken = token.accessToken;
			session.userId = token.userId;
			return session;
		},
	},

	secret: process.env.SECRET,
};

export const getSession = () => getServerSession(authOptions);

export default NextAuth(authOptions);
