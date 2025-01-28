import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const config = {
	matcher: ['/((?!term|privacy|welcome).*)'], // '/' 포함, '/term', '/privacy' 제외
};

export default withAuth(
	function middleware(req) {
		const isLoggedIn = !!req.nextauth.token;
		const path = req.nextUrl.pathname;

		if (path === '/term' || path === '/privacy') {
			return NextResponse.next();
		}

		// 로그인하지 않은 경우에 대한 리다이렉트 조건
		if (!isLoggedIn) {
			return NextResponse.redirect(process.env.NEXTAUTH_URL + '/term');
		}

		return NextResponse.next();
	},

	{
		callbacks: {
			authorized: ({ token }) => !!token, // 토큰이 존재할 경우에만 인증된 사용자로 간주
		},
		secret: process.env.NEXTAUTH_SECRET, // 환경 변수 설정
	},
);
