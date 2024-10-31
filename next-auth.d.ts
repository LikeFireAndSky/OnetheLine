import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		accessToken?: string;
		userId?: string; // 사용자 구분을 위한 ID
		profile?: {
			sub?: string; // Google의 고유 식별자 (sub)
		};
	}

	interface JWT {
		accessToken?: string;
		userId?: string; // 고유 ID
		profile?: {
			sub?: string; // Google의 고유 식별자
		};
	}
}
