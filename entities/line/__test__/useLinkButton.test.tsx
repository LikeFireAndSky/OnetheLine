import { renderHook } from '@testing-library/react';
import useLinkButton from '../model/useLinkButton';

// 타입 정의 (useLinkButton에서 가져옴)
type ButtonConfig = {
	color: string;
	text: string;
	className: string;
	icon: JSX.Element;
	href: string;
};

describe('useLinkButton', () => {
	it('record 타입에 대해 올바른 설정을 반환한다', () => {
		const { result } = renderHook(() => useLinkButton('record'));

		expect(result.current).toEqual({
			color: 'black',
			text: '기록하기',
			className: 'w-full flex items-center justify-center gap-1 rounded-sm',
			icon: expect.any(Object), // JSX.Element만 확인
			href: '/log',
		});
	});

	it('view 타입에 대해 올바른 설정을 반환한다', () => {
		const { result } = renderHook(() => useLinkButton('view'));

		expect(result.current).toEqual({
			color: 'white',
			text: '기록보기',
			className:
				'w-full flex items-center justify-center gap-1 rounded-sm border border-black',
			icon: expect.any(Object), // JSX.Element만 확인
			href: '/line',
		});
	});

	it('term 타입에 대해 올바른 설정을 반환한다', () => {
		const { result } = renderHook(() => useLinkButton('term'));

		expect(result.current).toEqual({
			color: 'black',
			text: '서비스 이용 약관',
			className: 'w-full flex items-center justify-center gap-1 rounded-sm',
			icon: expect.any(Object), // JSX.Element만 확인
			href: '/term',
		});
	});

	it('privacy 타입에 대해 올바른 설정을 반환한다', () => {
		const { result } = renderHook(() => useLinkButton('privacy'));

		expect(result.current).toEqual({
			color: 'black',
			text: '개인정보 처리방침',
			className: 'w-full flex items-center justify-center gap-1 rounded-sm',
			icon: expect.any(Object), // JSX.Element만 확인
			href: '/privacy',
		});
	});
});
