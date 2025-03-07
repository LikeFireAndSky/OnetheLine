import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { navItems } from '../config/footerConfig';

// useFooter 커스텀 훅은 현재 경로에 따라 footer의 활성화 상태를 관리하고,
// 특정 항목 클릭 시 해당 경로로 이동하도록 도와줍니다.
const useFooter = () => {
	// active 상태: 현재 활성화된 메뉴의 인덱스를 저장합니다.
	// 초기값은 -1로 설정하여 어떤 메뉴도 활성화되지 않았음을 나타냅니다.
	const [active, setActive] = React.useState(-1);

	// usePathname: 현재 브라우저의 경로(pathname)를 가져옵니다.
	const pathName = usePathname();
	// useRouter: Next.js 라우터 객체를 가져와 경로 변경 등에 사용합니다.
	const router = useRouter();

	// useEffect를 사용하여 경로(pathName)가 변경될 때마다 active 상태를 업데이트합니다.
	useEffect(() => {
		// 경로가 '/'이면 첫 번째 메뉴를 활성화 (인덱스 0)
		if (pathName === '/') {
			setActive(0);
		}
		// 경로가 '/log'이면 두 번째 메뉴를 활성화 (인덱스 1)
		else if (pathName === '/log') {
			setActive(1);
		}
		// 경로가 '/line'이면 세 번째 메뉴를 활성화 (인덱스 2)
		else if (pathName === '/line') {
			setActive(2);
		}
		// 경로가 '/setting'이면 네 번째 메뉴를 활성화 (인덱스 3)
		else if (pathName === '/setting') {
			setActive(3);
		}
	}, [pathName]); // pathName이 변경될 때마다 실행

	// onClick 함수: 메뉴 항목을 클릭할 때 호출됩니다.
	// index: 클릭한 메뉴 항목의 인덱스를 인자로 받습니다.
	const onClick = (index: number) => {
		// navItems 배열에서 해당 인덱스의 href로 라우터를 통해 이동합니다.
		router.push(navItems[index].href);
		// 클릭 즉시 active 상태를 업데이트하여 UI에 반영합니다.
		setActive(index);
	};

	// active 상태, 라우터 객체, setActive 함수, onClick 함수를 반환합니다.
	return { active, router, setActive, onClick };
};

export default useFooter;
