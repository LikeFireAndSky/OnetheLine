'use client';

import React from 'react';
import { navItems } from '../config/footerConfig';
import useFooter from '../model/useFooter';

const Footer = () => {
	const { active, onClick } = useFooter();

	return (
		<section className="w-full h-16 flex justify-between shadow shadow-black">
			{navItems.map((navItem, index) => (
				<button
					onClick={() => onClick(index)}
					key={index}
					className={`w-1/3 h-full flex flex-col items-center justify-center transition-colors duration-700 gap-1 ease-in-out ${
						active === index ? 'text-blue-gray-900' : 'text-blue-gray-100'
					}`}
				>
					<p className={`text-2xl`}>{navItem.icon}</p>
					<p className="text-xs">{navItem.title}</p>
				</button>
			))}
		</section>
	);
};

export default Footer;
