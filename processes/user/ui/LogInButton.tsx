'use client';

import React from 'react';
import useLogInButton from '../model/useLogInButton';
import { Button } from '@material-tailwind/react';
import { signOut } from 'next-auth/react';

const LogInButton = () => {
	const { buttonText, onClick, buttonColor } = useLogInButton();
	return (
		<Button
			className={`${buttonColor}`}
			onClick={onClick}
		>
			{buttonText}
		</Button>
	);
};

export default LogInButton;
