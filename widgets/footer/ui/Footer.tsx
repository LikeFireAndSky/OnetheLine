'use client';

import React from 'react';
import { navItems } from '../config/footerConfig';
import useFooter from '../model/useFooter';

const Footer = () => {
	const { active, onClick } = useFooter();

	return (
		<nav
			aria-label="주요 메뉴"
			className="w-full h-16 grid grid-cols-4 border-t border-rule bg-hanji-light/80"
		>
			{navItems.map((navItem, index) => {
				const isActive = active === index;
				return (
					<button
						type="button"
						onClick={() => onClick(index)}
						key={navItem.href}
						aria-current={isActive ? 'page' : undefined}
						className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors duration-300 ease-in-out ${
							isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
						}`}
					>
						{/* 현재 메뉴 표시: 낙관 주홍색 막대 */}
						<span
							aria-hidden
							className={`absolute top-0 h-[3px] w-7 rounded-b-sm bg-seal transition-opacity duration-300 ${
								isActive ? 'opacity-100' : 'opacity-0'
							}`}
						/>
						{navItem.icon}
						<span
							className={`text-[12px] ${isActive ? 'font-bold' : 'font-medium'}`}
						>
							{navItem.title}
						</span>
					</button>
				);
			})}
		</nav>
	);
};

export default Footer;
