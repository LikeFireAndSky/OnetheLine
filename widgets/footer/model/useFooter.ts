import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useCallback, useState } from 'react';
import { navItems } from '../config/footerConfig';

// 경로별로 활성화할 인덱스를 미리 정의한 매핑 객체입니다.
const pathIndexMap: Record<string, number> = {
	'/': 0,
	'/log': 1,
	'/line': 2,
	'/setting': 3,
};

/**
 * useFooter 커스텀 훅
 * - 현재 브라우저 경로에 따라 footer의 활성화 상태를 관리하고,
 *   메뉴 클릭 시 해당 경로로 이동하며 활성 상태를 업데이트합니다.
 *
 * @returns {Object} active: 현재 활성화된 메뉴 인덱스,
 *                   router: Next.js 라우터 객체,
 *                   setActive: 활성 상태 업데이트 함수,
 *                   onClick: 메뉴 클릭 핸들러.
 */
const useFooter = () => {
	// active 상태: 현재 활성화된 메뉴의 인덱스, 초기값은 -1 (아무것도 선택되지 않음)
	const [active, setActive] = useState(-1);
	// 현재 경로를 가져옵니다.
	const pathName = usePathname();
	// Next.js 라우터 객체를 가져옵니다.
	const router = useRouter();

	// pathName이 null이 아닐 경우에만 매핑 객체를 사용하여 인덱스를 업데이트합니다.
	useEffect(() => {
		if (!pathName) {
			setActive(-1);
		} else {
			setActive(pathIndexMap[pathName] ?? -1);
		}
	}, [pathName]);

	/**
	 * onClick 핸들러: 메뉴 항목 클릭 시 호출됩니다.
	 * - navItems 배열의 해당 인덱스의 href로 라우터를 통해 이동합니다.
	 * - 동시에 active 상태를 업데이트하여 UI에 즉시 반영합니다.
	 *
	 * @param index - 클릭한 메뉴 항목의 인덱스.
	 */
	const onClick = useCallback(
		(index: number) => {
			router.push(navItems[index].href);
			setActive(index);
		},
		[router],
	);

	return { active, router, setActive, onClick };
};

export default useFooter;
