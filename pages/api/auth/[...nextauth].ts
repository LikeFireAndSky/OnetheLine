import GoogleProvider from 'next-auth/providers/google';
import NaverProvider from 'next-auth/providers/naver';
import NextAuth, { getServerSession } from 'next-auth';
import { getUserById, saveUser } from '@/processes/user/api/saveUser';

export type SessionType = {
	user: {
		name: string;
		email: string;
		image: string;
	};
	accessToken: string;
	userId: string;
};

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		NaverProvider({
			clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID as string,
			clientSecret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET as string,
		}),
	],

	callbacks: {
		/**
		 * ✅ JWT 콜백: 최초 로그인 시 OAuth 프로필 정보를 token에 저장
		 */
		async jwt({ token, account, profile }: any) {
			if (account && profile) {
				if (account.provider === 'google') {
					token.userId = profile.sub;
					token.name = profile.name;
					token.email = profile.email;
					token.accessToken = account.access_token;
				} else if (account.provider === 'naver') {
					const { id, nickname, email } = profile.response;
					token.userId = id;
					token.name = nickname;
					token.email = email;
					token.accessToken = account.access_token;
				}

				// 사용자 정보 저장 (이미 있으면 패스)
				const existingUser = await getUserById(token.userId);
				if (!existingUser) {
					await saveUser({
						userId: token.userId,
						accessToken: token.accessToken || '',
						name: token.name || '',
						email: token.email || '',
					});
				}
			}
			return token;
		},

		/**
		 * ✅ 세션 콜백: 클라이언트에 내려줄 커스텀 세션 정보 구성
		 */
		async session({ session, token }: any) {
			session.userId = token.userId;
			session.accessToken = token.accessToken;
			return session;
		},

		/**
		 * ✅ 리디렉션 무한 루프 방지
		 */
		async redirect({ url, baseUrl }: any) {
			if (url.startsWith('/')) return `${baseUrl}${url}`;
			if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
	},

	// JWT 암호화 키
	secret: process.env.NEXTAUTH_SECRET,
};

// 서버에서 세션 쉽게 가져오기용 헬퍼
export const getSession = () => getServerSession(authOptions);

export default NextAuth(authOptions);
