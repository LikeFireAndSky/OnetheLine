// useLogInButton.test.tsx
import { renderHook, act } from '@testing-library/react';
import useLogInButton from '../model/useLogInButton';
import { useSession, signIn, signOut } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
	useSession: jest.fn(),
	signIn: jest.fn(),
	signOut: jest.fn(),
}));

describe('useLogInButton hook', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return "로그인", bg-black and call signIn when not authenticated', () => {
		// 모킹: 인증되지 않은 상태 -> update는 아무 작업 없이 호출될 수 있도록 설정
		(useSession as jest.Mock).mockReturnValue({ update: jest.fn() });

		const { result } = renderHook(() =>
			useLogInButton({ isAuthenticated: false }),
		);

		// 인증되지 않은 경우 버튼 텍스트와 색상 확인
		expect(result.current.buttonText).toBe('로그인');
		expect(result.current.buttonColor).toBe('bg-black');

		// onClick 호출 시 signIn 함수가 호출되어야 함
		act(() => {
			result.current.onClick();
		});
		expect(signIn).toHaveBeenCalled();
	});

	it('should return "로그아웃", bg-gray-400 and handle sign out when authenticated', async () => {
		// 모킹: 인증된 상태 -> update를 모킹 (비동기)
		const updateMock = jest.fn().mockResolvedValue(undefined);
		(useSession as jest.Mock).mockReturnValue({ update: updateMock });

		// signOut도 비동기로 모킹
		(signOut as jest.Mock).mockResolvedValue(undefined);

		// window.location.reload를 재정의합니다.
		Object.defineProperty(window, 'location', {
			configurable: true,
			value: { reload: jest.fn() },
		});

		const { result } = renderHook(() =>
			useLogInButton({ isAuthenticated: true }),
		);

		// 인증된 경우 버튼 텍스트와 색상 확인
		expect(result.current.buttonText).toBe('로그아웃');
		expect(result.current.buttonColor).toBe('bg-gray-400');

		// onClick 호출 시 handleSignOut 함수가 실행되어야 함
		await act(async () => {
			await result.current.onClick();
		});
		// signOut가 redirect: false 옵션과 함께 호출되어야 함
		expect(signOut).toHaveBeenCalledWith({ redirect: false });
		// update 함수가 호출되어야 함
		expect(updateMock).toHaveBeenCalled();
		// window.location.reload가 호출되어 페이지가 리로드 되어야 함
		expect(window.location.reload).toHaveBeenCalled();
	});
});
