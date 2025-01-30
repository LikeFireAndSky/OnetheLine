'use client';

import React from 'react';
import useLogInButton from '../model/useLogInButton';
import { Button } from '@material-tailwind/react';

const LogInButton = () => {
	const { buttonText, onClick, buttonColor } = useLogInButton();
	return (
		<Button
			className={` rounded-sm w-full ${buttonColor}`}
			onClick={onClick}
		>
			{buttonText}
		</Button>
	);
};

export default LogInButton;
