'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

const useLogInButton = () => {
	const { data: session } = useSession();

	const returnData = {
		userId: session ? session.userId : null,
		buttonText: session ? '로그아웃' : '로그인',
		buttonColor: session ? 'bg-gray-400' : 'bg-green-700',
		onClick: session ? () => signOut() : () => signIn(),
	};

	return returnData;
};

export default useLogInButton;
