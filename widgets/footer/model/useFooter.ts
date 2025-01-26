import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { navItems } from '../config/footerConfig';

const useFooter = () => {
	const [active, setActive] = React.useState(-1); // 초기값을 -1로 설정
	const pathName = usePathname();
	const router = useRouter();

	// 경로에 따라 활성화 상태 설정
	useEffect(() => {
		if (pathName === '/') {
			setActive(0);
		} else if (pathName === '/log') {
			setActive(1);
		} else if (pathName === '/line') {
			setActive(2);
		} else if (pathName === '/setting') {
			setActive(3);
		}
	}, [pathName]);

	const onClick = (index: number) => {
		router.push(navItems[index].href);
		setActive(index); // 바로 활성화 상태 업데이트
	};

	return { active, router, setActive, onClick };
};

export default useFooter;
