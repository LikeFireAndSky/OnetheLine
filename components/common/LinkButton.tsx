import Link from 'next/link';
import React from 'react';

const LinkButton = () => {
	return (
		<Link
			href={'/log'}
			className="px-3 py-1"
		>
			LinkButton
		</Link>
	);
};

export default LinkButton;
