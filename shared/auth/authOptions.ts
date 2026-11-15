import type { NextAuthOptions } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import { ensureUser } from '@/processes/user/api/saveUser';

/**
 * Cognito ID 토큰의 identities 클레임 항목
 * (Cognito에 연동된 외부 IdP 정보)
 */
type CognitoIdentity = {
	userId?: unknown;
	providerName?: unknown;
	providerType?: unknown;
	issuer?: unknown;
	primary?: unknown;
	dateCreated?: unknown;
};

/**
 * 콜백에 전달되는 Cognito ID 토큰 클레임 (필요한 것만)
 */
type CognitoIdTokenClaims = {
	sub?: string;
	name?: string;
	email?: string;
	identities?: unknown;
};

const GOOGLE_PROVIDER_NAME = 'Google';

// 끝에 붙은 '/'를 제거해 wellKnown 주소가 '//.well-known'이 되지 않도록 함
const COGNITO_ISSUER = (process.env.COGNITO_ISSUER ?? '').replace(/\/+$/, '');

/**
 * identities 클레임을 배열로 정규화 (배열 또는 JSON 문자열 모두 허용)
 */
const parseIdentities = (raw: unknown): CognitoIdentity[] => {
	let value = raw;
	if (typeof value === 'string') {
		try {
			value = JSON.parse(value);
		} catch {
			return [];
		}
	}
	if (!Array.isArray(value)) return [];
	return value.filter(
		(item): item is CognitoIdentity => typeof item === 'object' && item !== null,
	);
};

/**
 * Google 연동 계정의 원래 Google 'sub' 값을 찾음
 * (기존 DynamoDB 데이터의 userId와 동일한 값)
 */
const findGoogleIdentity = (
	raw: unknown,
): { userId: string; providerName: string } | null => {
	const identity = parseIdentities(raw).find(
		item =>
			item.providerName === GOOGLE_PROVIDER_NAME &&
			typeof item.userId === 'string' &&
			item.userId.length > 0,
	);
	if (!identity) return null;
	return {
		userId: identity.userId as string,
		providerName: GOOGLE_PROVIDER_NAME,
	};
};

export const authOptions: NextAuthOptions = {
	providers: [
		CognitoProvider({
			clientId: process.env.COGNITO_CLIENT_ID ?? '',
			clientSecret: process.env.COGNITO_CLIENT_SECRET ?? '',
			issuer: COGNITO_ISSUER,
			// authorize 엔드포인트는 wellKnown(discovery)에서 가져오고, 파라미터만 덮어씀
			// identity_provider=Google → Cognito Hosted UI를 건너뛰고 바로 Google로 이동
			authorization: {
				params: {
					scope: 'openid email profile',
					identity_provider: GOOGLE_PROVIDER_NAME,
				},
			},
			// 기본값은 state만 검사하므로 PKCE(인가 코드 탈취/주입 방지)와 nonce(ID 토큰 재사용 방지)를 추가
			// nonce를 보내지 않으면 Cognito가 Google을 거치는 첫 로그인에서 자체 nonce를 넣어 'nonce mismatch'로 실패함
			checks: ['pkce', 'state', 'nonce'],
		}),
	],

	session: {
		strategy: 'jwt',
	},

	pages: {
		signIn: '/user-login',
		error: '/user-login',
	},

	callbacks: {
		/**
		 * ✅ 로그인 허용 여부: Google 연동 계정만 허용
		 * (identity_provider 파라미터는 브라우저에서 바꿀 수 있으므로 서버에서 다시 확인)
		 */
		async signIn({ account, profile }) {
			if (account?.provider !== 'cognito') return false;
			const claims = profile as CognitoIdTokenClaims | undefined;
			return findGoogleIdentity(claims?.identities) !== null;
		},

		/**
		 * ✅ JWT 콜백: 최초 로그인 시 ID 토큰 클레임에서 사용자 정보를 token에 저장
		 * - profile은 Cognito ID 토큰 클레임
		 * - 프로바이더 access token은 저장하지 않음
		 */
		async jwt({ token, account, profile }) {
			if (account && profile) {
				const claims = profile as CognitoIdTokenClaims;
				const googleIdentity = findGoogleIdentity(claims.identities);

				// 기존 데이터 호환을 위해 Google 'sub'를 userId로 사용 (signIn 콜백에서 존재 보장)
				token.userId = googleIdentity?.userId;
				token.provider = googleIdentity?.providerName;
				token.name = claims.name ?? token.name;
				token.email = claims.email ?? token.email;

				// 사용자 정보 저장 (이미 있으면 패스) - 실패해도 로그인은 계속 진행
				if (token.userId && token.provider) {
					try {
						await ensureUser({
							userId: token.userId,
							name: token.name ?? '',
							email: token.email ?? '',
							provider: token.provider,
						});
					} catch (error) {
						console.error(
							'ensureUser failed during sign-in',
							error instanceof Error ? error.name : 'UnknownError',
						);
					}
				}
			}
			return token;
		},

		/**
		 * ✅ 세션 콜백: 클라이언트에 내려줄 세션에는 userId만 추가
		 */
		async session({ session, token }) {
			session.userId = token.userId;
			return session;
		},

		/**
		 * ✅ 리디렉션 무한 루프 방지 (같은 사이트 주소만 허용)
		 */
		async redirect({ url, baseUrl }) {
			if (url.startsWith('/')) return `${baseUrl}${url}`;
			try {
				if (new URL(url).origin === baseUrl) return url;
			} catch {
				return baseUrl;
			}
			return baseUrl;
		},
	},

	// JWT 암호화 키
	secret: process.env.NEXTAUTH_SECRET,
};
