'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

const useLogInButton = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
	const { update } = useSession();

	const handleSignOut = async () => {
		await signOut({
			redirect: false,
		});
		await update();

		window.location.reload();
	};

	const returnData = {
		buttonText: isAuthenticated ? '로그아웃' : '로그인',
		buttonColor: isAuthenticated ? 'bg-gray-400' : 'bg-black',
		onClick: isAuthenticated ? () => handleSignOut() : () => signIn(),
	};

	return returnData;
};

export default useLogInButton;
