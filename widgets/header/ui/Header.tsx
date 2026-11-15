import Image from 'next/image';
import React from 'react';
import LOGO_IMAGE from '@/public/images/MAIN_LOGO.png';
import Link from 'next/link';
import Seal from '@/shared/ui/Seal';

const Header = () => {
	return (
		<header className="w-full flex justify-between items-center px-4 h-16 border-b border-rule">
			<Link
				href="/"
				aria-label="OneTheLine 홈으로"
			>
				<Image
					src={LOGO_IMAGE}
					alt="OneTheLine"
					className="w-32"
					priority
				/>
			</Link>
			<Seal size="sm" />
		</header>
	);
};

export default Header;
