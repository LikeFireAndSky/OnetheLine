'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const useLogInButton = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
	const router = useRouter();

	const handleSignIn = () => router.push('user-login');

	const handleSignOut = async () => {
		await signOut({ redirect: false });
		// await update(); ❌ 제거
		window.location.reload();
	};

	const returnData = {
		buttonText: isAuthenticated ? '로그아웃' : '로그인',
		buttonColor: isAuthenticated ? 'bg-gray-400' : 'bg-black',
		onClick: isAuthenticated ? () => handleSignOut() : () => handleSignIn(),
	};

	return returnData;
};

export default useLogInButton;
