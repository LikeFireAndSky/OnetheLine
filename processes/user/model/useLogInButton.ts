'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const useLogInButton = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
	const router = useRouter();

	const handleSignIn = () => router.push('/user-login');

	const handleSignOut = async () => {
		await signOut({ redirect: false });
		window.location.reload();
	};

	const returnData = {
		buttonText: isAuthenticated ? '로그아웃' : '로그인',
		// btn-ink: 먹색 버튼, btn-line: 테두리 버튼 (app/globals.css)
		buttonClass: isAuthenticated ? 'btn-line' : 'btn-ink',
		onClick: isAuthenticated ? () => handleSignOut() : () => handleSignIn(),
	};

	return returnData;
};

export default useLogInButton;
