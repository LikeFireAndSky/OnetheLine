'use client';

import React from 'react';
import useLogInButton from '../model/useLogInButton';
import {
	ArrowLeftStartOnRectangleIcon,
	ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/outline';

const LogInButton = ({
	isAuthenticated,
	isLoading,
}: {
	isAuthenticated: boolean;
	isLoading: boolean;
}) => {
	const { buttonText, onClick, buttonClass } = useLogInButton({
		isAuthenticated,
	});
	const Icon = isAuthenticated
		? ArrowLeftStartOnRectangleIcon
		: ArrowRightEndOnRectangleIcon;

	return (
		<button
			type="button"
			className={buttonClass}
			onClick={onClick}
			disabled={isLoading}
		>
			<Icon
				aria-hidden
				className="w-5 h-5"
			/>
			{isLoading ? '확인 중...' : buttonText}
		</button>
	);
};

export default LogInButton;
