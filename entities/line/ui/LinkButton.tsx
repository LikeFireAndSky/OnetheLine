'use client';

import React from 'react';
import useLinkButton, { LinkButtonTypes } from '../model/useLinkButton';
import Link from 'next/link';

const LinkButton = ({ types }: { types: LinkButtonTypes }) => {
	const buttonConfig = useLinkButton(types);
	return (
		<Link
			href={buttonConfig.href}
			className={buttonConfig.className}
		>
			{buttonConfig.icon}
			{buttonConfig.text}
		</Link>
	);
};

export default LinkButton;
