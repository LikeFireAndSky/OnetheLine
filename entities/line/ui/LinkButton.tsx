'use client';

import { Button } from '@material-tailwind/react';
import React from 'react';
import useLinkButton, { LinkButtonTypes } from '../model/useLinkButton';
import Link from 'next/link';

const LinkButton = ({ types }: { types: LinkButtonTypes }) => {
	const buttonConfig = useLinkButton(types);
	return (
		<Link
			href={buttonConfig.href}
			className="w-full"
		>
			<Button
				color={buttonConfig.color as any}
				className={buttonConfig.className}
			>
				{buttonConfig.icon}
				{buttonConfig.text}
			</Button>
		</Link>
	);
};

export default LinkButton;
