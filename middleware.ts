import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	// Define the paths you want to protect
	const protectedPaths = ['/log', '/line', '/setting']; // Add the paths you want to protect

	// Check if the request is for a protected path
	const path = req.nextUrl.pathname;
	const isProtected = protectedPaths.some(protectedPath =>
		path.startsWith(protectedPath),
	);

	if (isProtected) {
		// Get the token from the request
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

		// If there's no token, redirect to the "/term" page
		if (!token) {
			const url = new URL('/', req.nextUrl.origin);
			return NextResponse.redirect(url);
		}
	}

	// If the user is authenticated or the path is not protected, continue
	return NextResponse.next();
}
