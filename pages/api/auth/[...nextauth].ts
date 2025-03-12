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
};

// NextAuth 설정
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
		 * JWT 콜백
		 * - 최초 OAuth 완료 후, token 객체에 user 정보를 저장
		 */
		async jwt({ token, account, profile }: any) {
			// OAuth 인증 직후 (로그인 시점)에는 account, profile이 존재
			if (account && profile) {
				// provider별로 profile 구조가 다르므로 분기 처리
				if (account.provider === 'google') {
					// 구글의 경우
					// - profile.sub가 고유 ID
					// - profile.name / profile.email / profile.picture 등이 주로 옴
					token.userId = profile.sub;
					token.name = profile.name;
					token.email = profile.email;
					token.accessToken = account.access_token;
				} else if (account.provider === 'naver') {
					// 네이버의 경우
					// - profile.response 안에 실제 데이터가 들어있음
					//   ex) { id, nickname, email, name, ... }
					const { id, nickname, email } = profile.response;
					token.userId = id;
					token.name = nickname; // '섭섭이' 등 닉네임
					token.email = email;
					token.accessToken = account.access_token;
				}

				// DB에 해당 userId가 있는지 확인
				const existingUser = await getUserById(token.userId);

				// 없으면 새로 저장
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
		 * session 콜백
		 * - 클라이언트에서 useSession()으로 세션 조회 시, 이 값이 내려옴
		 */
		async session({ session, token }: any) {
			// 세션에 토큰 값을 집어넣어 사용
			session.userId = token.userId;
			session.accessToken = token.accessToken;

			// session.user 안에 추가 정보 (이름/이메일 등)도 동기화
			// (NextAuth 기본적으로 user: { name, email, image }는 profile에서 가져옴)
			// 필요 시:
			session.user.name = token.name;
			session.user.email = token.email;
			// 세션의 user.image는 구글 로그인 시 profile.picture로 자동 설정될 수도 있음

			return session;
		},
	},

	// JWT 암호화를 위한 secret
	secret: process.env.NEXTAUTH_SECRET,
};

// 서버 컴포넌트나 API 라우트에서 getServerSession을 간편히 사용하기 위함
export const getSession = () => getServerSession(authOptions);

export default NextAuth(authOptions);
