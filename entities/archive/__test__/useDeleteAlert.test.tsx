// useDeleteAlert.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useDeleteAlert } from '../model/useDeleteAlert'; // 실제 파일 경로에 맞게 수정하세요

// useDeleteLog 훅을 모킹합니다.
const mockMutate = jest.fn();
jest.mock('@/entities/archive/api/useDeleteLog', () => ({
	__esModule: true,
	default: () => ({
		mutate: mockMutate,
		// 테스트 시 isPending 값으로 false를 기본으로 사용합니다.
		isPending: false,
	}),
}));

describe('useDeleteAlert hook', () => {
	const sentenceId = 'sentence-1';
	const bookIsbn = 'book-123';

	beforeEach(() => {
		// 각 테스트마다 mock 상태를 초기화
		mockMutate.mockClear();
	});

	it('초기 open 값은 false여야 합니다.', () => {
		const { result } = renderHook(() => useDeleteAlert(sentenceId, bookIsbn));
		expect(result.current.open).toBe(false);
	});

	it('handleOpen 호출 시 open 값이 토글되어야 합니다.', () => {
		const { result } = renderHook(() => useDeleteAlert(sentenceId, bookIsbn));
		// 첫 번째 토글: false -> true
		act(() => {
			result.current.handleOpen();
		});
		expect(result.current.open).toBe(true);
		// 두 번째 토글: true -> false
		act(() => {
			result.current.handleOpen();
		});
		expect(result.current.open).toBe(false);
	});

	it('handleDelete 호출 시 mutation.mutate가 올바른 인자로 호출되고 open 상태가 토글되어야 합니다.', () => {
		const { result } = renderHook(() => useDeleteAlert(sentenceId, bookIsbn));

		// 테스트를 위해 먼저 handleOpen을 호출하여 open을 true로 설정합니다.
		act(() => {
			result.current.handleOpen();
		});
		expect(result.current.open).toBe(true);

		// handleDelete 호출 시 mutation.mutate가 호출되고, open 값이 토글되어 false가 되어야 합니다.
		act(() => {
			result.current.handleDelete();
		});
		expect(mockMutate).toHaveBeenCalledWith({ bookIsbn, sentenceId });
		expect(result.current.open).toBe(false);
	});

	it('deleting 값은 mutation.isPending 값을 그대로 반환해야 합니다.', () => {
		const { result } = renderHook(() => useDeleteAlert(sentenceId, bookIsbn));
		// 기본 mock에서 isPending은 false입니다.
		expect(result.current.deleting).toBe(false);
	});
});
