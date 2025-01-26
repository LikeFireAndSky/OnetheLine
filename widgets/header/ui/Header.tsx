import Image from 'next/image';
import React from 'react';
import LOGO_IMAGE from '@/public/images/MAIN_LOGO.png';

const Header = () => {
	return (
		<header className="w-full flex justify-start px-3 items-center h-16 border-b">
			<Image
				src={LOGO_IMAGE}
				alt="logo"
				className="w-36"
			/>
		</header>
	);
};

export default Header;
