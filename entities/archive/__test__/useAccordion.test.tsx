// useAccordion.test.tsx
import { renderHook, act } from '@testing-library/react';
import useAccordion from '../model/useAccordion';
import { changeTime } from '@/shared/lib/utils';

// changeTime 함수를 모킹합니다.
jest.mock('@/shared/lib/utils', () => ({
	changeTime: jest.fn(timestamp => `changed: ${timestamp}`),
}));

// useDeleteLog 훅을 모킹합니다.
const mockMutate = jest.fn();
jest.mock('../api/useDeleteLog', () => ({
	__esModule: true,
	default: () => ({
		mutate: mockMutate,
	}),
}));

describe('useAccordion hook', () => {
	const sampleContents = [
		{
			SentenceID: '1',
			Timestamp: '2021-01-01T00:00:00Z',
			Content: 'Sentence 1',
		},
		{
			SentenceID: '2',
			Timestamp: '2021-01-02T00:00:00Z',
			Content: 'Sentence 2',
		},
	];

	beforeEach(() => {
		mockMutate.mockClear();
		(changeTime as jest.Mock).mockClear();
	});

	it('초기 open 값은 -1이어야 합니다.', () => {
		const { result } = renderHook(() =>
			useAccordion({ bookIndex: 1, Contents: sampleContents }),
		);
		expect(result.current.open).toBe(-1);
	});

	it('onClick 호출 시 open 상태가 토글되어야 합니다.', () => {
		const { result } = renderHook(() =>
			useAccordion({ bookIndex: 1, Contents: sampleContents }),
		);

		// 첫 번째 클릭: open 값이 index로 설정되어야 함
		act(() => {
			result.current.onClick();
		});
		expect(result.current.open).toBe(1);

		// 두 번째 클릭: open 값이 다시 -1로 변경되어야 함
		act(() => {
			result.current.onClick();
		});
		expect(result.current.open).toBe(-1);
	});

	it('previewData는 contents가 존재할 때 한 개의 요소를 반환해야 합니다.', () => {
		const { result } = renderHook(() =>
			useAccordion({ bookIndex: 0, Contents: sampleContents }),
		);
		const preview = result.current.previewData;
		expect(Array.isArray(preview)).toBe(true);
		expect(preview).toHaveLength(1);
		// 반환된 요소가 sampleContents 배열 내의 요소 중 하나여야 합니다.
		expect(sampleContents).toContainEqual(preview[0]);
	});

	it('contents가 빈 배열일 경우 previewData는 빈 배열을 반환해야 합니다.', () => {
		const { result } = renderHook(() =>
			useAccordion({ bookIndex: 0, Contents: [] }),
		);
		expect(result.current.previewData).toEqual([]);
	});

	it('contentsLength는 contents 배열의 길이를 반환해야 합니다.', () => {
		const { result } = renderHook(() =>
			useAccordion({ bookIndex: 0, Contents: sampleContents }),
		);
		expect(result.current.contentsLength).toBe(sampleContents.length);
	});

	it('handleDelete 호출 시 mutation.mutate가 올바른 인자로 호출되어야 합니다.', () => {
		const { result } = renderHook(() =>
			useAccordion({ bookIndex: 0, Contents: sampleContents }),
		);

		act(() => {
			result.current.handleDelete('1', 'book-123');
		});
		expect(mockMutate).toHaveBeenCalledWith({
			bookIsbn: 'book-123',
			sentenceId: '1',
		});
	});

	it('krTime은 changeTime을 호출하고, 그 결과를 반환해야 합니다.', () => {
		const { result } = renderHook(() =>
			useAccordion({ bookIndex: 0, Contents: sampleContents }),
		);
		const timestamp = '2021-01-01T00:00:00Z';
		const returnedTime = result.current.krTime(timestamp);
		expect(changeTime).toHaveBeenCalledWith(timestamp);
		expect(returnedTime).toBe(`changed: ${timestamp}`);
	});
});
