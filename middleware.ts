import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// 토큰 해석에 실패하면 비로그인으로 처리
const readToken = async (req: NextRequest) => {
	try {
		return await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	} catch {
		return null;
	}
};

export async function middleware(req: NextRequest) {
	// 보호 경로는 아래 config.matcher로만 지정 ('/login' 같은 경로가 걸리지 않도록)
	const token = await readToken(req);

	// 로그인하지 않았다면 로그인 페이지로 보내고, 로그인 후 원래 경로로 돌아오도록 함
	if (!token) {
		const { pathname, search } = req.nextUrl;
		const url = new URL('/user-login', req.nextUrl.origin);
		url.searchParams.set('callbackUrl', `${pathname}${search}`);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/log/:path*', '/line/:path*'],
};
