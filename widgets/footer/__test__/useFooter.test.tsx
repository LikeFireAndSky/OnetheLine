// useFooter.test.ts
import { renderHook, act } from '@testing-library/react';
import useFooter from '../model/useFooter'; // 실제 경로에 맞게 수정하세요.
import { usePathname, useRouter } from 'next/navigation';
import { navItems } from '../config/footerConfig';

// next/navigation 모듈을 모킹합니다.
jest.mock('next/navigation', () => ({
	usePathname: jest.fn(),
	useRouter: jest.fn(),
}));

describe('useFooter hook', () => {
	const mockPush = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		// useRouter는 push 함수를 가진 객체를 반환하도록 모킹
		(useRouter as jest.Mock).mockReturnValue({ push: mockPush });
	});

	it('should set active to 0 when pathname is "/"', () => {
		(usePathname as jest.Mock).mockReturnValue('/');
		const { result } = renderHook(() => useFooter());
		expect(result.current.active).toBe(0);
	});

	it('should set active to 1 when pathname is "/log"', () => {
		(usePathname as jest.Mock).mockReturnValue('/log');
		const { result } = renderHook(() => useFooter());
		expect(result.current.active).toBe(1);
	});

	it('should set active to 2 when pathname is "/line"', () => {
		(usePathname as jest.Mock).mockReturnValue('/line');
		const { result } = renderHook(() => useFooter());
		expect(result.current.active).toBe(2);
	});

	it('should set active to 3 when pathname is "/setting"', () => {
		(usePathname as jest.Mock).mockReturnValue('/setting');
		const { result } = renderHook(() => useFooter());
		expect(result.current.active).toBe(3);
	});

	it('should remain -1 when pathname does not match any case', () => {
		(usePathname as jest.Mock).mockReturnValue('/unknown');
		const { result } = renderHook(() => useFooter());
		expect(result.current.active).toBe(-1);
	});

	it('onClick should call router.push with correct href and update active', () => {
		// 초기 pathname은 '/'로 설정하더라도 onClick 호출 시 active가 업데이트됨
		(usePathname as jest.Mock).mockReturnValue('/');
		const { result } = renderHook(() => useFooter());

		act(() => {
			result.current.onClick(2);
		});
		expect(mockPush).toHaveBeenCalledWith(navItems[2].href);
		expect(result.current.active).toBe(2);
	});
});
