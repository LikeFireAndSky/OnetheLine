'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const navItems = [
	{
		title: '홈',
		icon: 'home',
		href: '/',
	},
	{
		title: '라인',
		icon: 'line',
		href: '/line',
	},
	{
		title: '로그',
		icon: 'log',
		href: '/log',
	},
];

const FooterNav = () => {
	const [active, setActive] = React.useState(-1); // 초기값을 -1로 설정
	const pathName = usePathname();
	const router = useRouter();

	// 경로에 따라 활성화 상태 설정
	useEffect(() => {
		if (pathName === '/') {
			setActive(0);
		} else if (pathName === '/line') {
			setActive(1);
		} else if (pathName === '/log') {
			setActive(2);
		}
	}, [pathName]);

	return (
		<section className="w-full h-16 flex justify-between shadow shadow-black">
			{navItems.map((navItem, index) => (
				<button
					onClick={() => {
						router.push(navItem.href);
						setActive(index); // 바로 활성화 상태 업데이트
					}}
					key={index}
					className={`w-1/3 h-full flex flex-col items-center justify-center transition-colors duration-700 ease-in-out ${
						active === index ? 'text-blue-gray-900' : 'text-blue-gray-100'
					}`}
				>
					<i className={`material-icons-outlined text-2xl`}>{navItem.icon}</i>
					<span className="text-xs">{navItem.title}</span>
				</button>
			))}
		</section>
	);
};

export default FooterNav;
