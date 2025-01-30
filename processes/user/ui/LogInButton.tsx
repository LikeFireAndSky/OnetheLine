'use client';

import React from 'react';
import useLogInButton from '../model/useLogInButton';
import { Button } from '@material-tailwind/react';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/16/solid';

const LogInButton = ({
	isAuthenticated,
	isLoading,
}: {
	isAuthenticated: boolean;
	isLoading: boolean;
}) => {
	const { buttonText, onClick, buttonColor } = useLogInButton({
		isAuthenticated,
	});
	return (
		<Button
			className={`flex items-center justify-center gap-1 rounded-sm w-full ${buttonColor}`}
			onClick={onClick}
		>
			{!isAuthenticated ? (
				<ArrowRightEndOnRectangleIcon className="w-4 h-4" />
			) : null}
			{isLoading ? '로그인 중...' : buttonText}
		</Button>
	);
};

export default LogInButton;
