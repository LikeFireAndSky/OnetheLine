import { renderHook } from '@testing-library/react';
import { useMainLog } from '../model/useMainLog';

// 타입 정의 (useMainLog에서 가져옴)
type LogData = {
	isAuthenticated: boolean;
	isEnrolled: boolean;
	data?: {
		Content: string;
		Timestamp: string;
		BookAuthor: string;
		BookPublisher: string;
		BookTitle: string;
	};
};

type MainLogProps = {
	data: LogData;
	isLoading: boolean;
	isError: boolean;
};

// changeTime 모킹
jest.mock('../../../shared/lib/utils', () => ({
	changeTime: (timestamp: string) => `formatted-${timestamp}`,
}));

describe('useMainLog', () => {
	// 로딩 상태 테스트
	it('isLoading이 true일 때 모든 텍스트가 "로딩중..."을 반환한다', () => {
		const { result } = renderHook(() =>
			useMainLog({
				data: { isAuthenticated: false, isEnrolled: false },
				isLoading: true,
				isError: false,
			}),
		);

		expect(result.current.contentText).toBe('로딩중...');
		expect(result.current.timeText).toBe('로딩중...');
		expect(result.current.authorText).toBe('로딩중...');
		expect(result.current.publisherText).toBe('로딩중...');
		expect(result.current.titleText).toBe('로딩중...');
	});

	// 에러 상태 테스트
	it('isError가 true일 때 모든 텍스트가 "에러가 발생했습니다."를 반환한다', () => {
		const { result } = renderHook(() =>
			useMainLog({
				data: { isAuthenticated: false, isEnrolled: false },
				isLoading: false,
				isError: true,
			}),
		);

		expect(result.current.contentText).toBe('에러가 발생했습니다.');
		expect(result.current.timeText).toBe('에러가 발생했습니다.');
		expect(result.current.authorText).toBe('에러가 발생했습니다.');
		expect(result.current.publisherText).toBe('에러가 발생했습니다.');
		expect(result.current.titleText).toBe('에러가 발생했습니다.');
	});

	// 인증되지 않은 상태 테스트
	it('isAuthenticated가 false일 때 기본 텍스트를 반환한다', () => {
		const { result } = renderHook(() =>
			useMainLog({
				data: { isAuthenticated: false, isEnrolled: false },
				isLoading: false,
				isError: false,
			}),
		);

		expect(result.current.contentText).toBe(
			'로그인 후 앞으로의 하루들을 바꿀 문장들을 기록하세요.',
		);
		expect(result.current.timeText).toBe(new Date().toLocaleDateString());
		expect(result.current.authorText).toBe('로');
		expect(result.current.publisherText).toBe('그인');
		expect(result.current.titleText).toBe('로그인이 필요합니다.');
	});

	// 인증되고 등록된 상태 테스트 (데이터 있음)
	it('인증되고 등록된 경우 데이터가 있을 때 해당 값을 반환한다', () => {
		const mockData = {
			isAuthenticated: true,
			isEnrolled: true,
			data: {
				Content: '테스트 내용',
				Timestamp: '2025-03-06',
				BookAuthor: '작가 이름',
				BookPublisher: '출판사 이름',
				BookTitle: '책 제목',
			},
		};

		const { result } = renderHook(() =>
			useMainLog({
				data: mockData,
				isLoading: false,
				isError: false,
			}),
		);

		expect(result.current.contentText).toBe('테스트 내용');
		expect(result.current.timeText).toBe('formatted-2025-03-06');
		expect(result.current.authorText).toBe('작가 이름');
		expect(result.current.publisherText).toBe('출판사 이름');
		expect(result.current.titleText).toBe('책 제목');
	});

	// 인증되고 등록된 상태 테스트 (데이터 없음)
	it('인증되고 등록된 경우 데이터가 없으면 기본값을 반환한다', () => {
		const { result } = renderHook(() =>
			useMainLog({
				data: { isAuthenticated: true, isEnrolled: true },
				isLoading: false,
				isError: false,
			}),
		);

		expect(result.current.contentText).toBe(
			'오늘 당신에게 필요한 문장은 무엇인가요? 지금 바로 기록해보세요🙂',
		);
		expect(result.current.timeText).toBe(new Date().toLocaleDateString());
		expect(result.current.authorText).toBe('');
		expect(result.current.publisherText).toBe('');
		expect(result.current.titleText).toBe('제목');
	});
}); // 실제 경로로 수정
