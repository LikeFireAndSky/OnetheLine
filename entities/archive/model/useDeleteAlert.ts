import useDeleteLog from '@/entities/archive/api/useDeleteLog';
import React, { useState, useCallback } from 'react';

/**
 * useDeleteAlert 커스텀 훅
 *
 * @param sentenceId - 삭제할 문장의 ID
 * @param bookIsbn - 삭제할 문장이 속한 책의 ISBN
 * @returns { open, handleOpen, handleDelete, deleting }
 *          open: 삭제 알림 UI의 열린/닫힘 상태
 *          handleOpen: 알림 UI의 상태를 토글하는 함수
 *          handleDelete: 삭제 API를 호출한 후 알림 UI를 토글하는 함수
 *          deleting: 삭제 요청이 진행 중인 상태 (mutation.isPending)
 */
export const useDeleteAlert = (sentenceId: string, bookIsbn: string) => {
	// 알림 창(open)의 상태를 관리 (false: 닫힘, true: 열림)
	const [open, setOpen] = useState(false);

	// 문장 삭제를 위한 API 호출 훅
	const mutation = useDeleteLog();

	/**
	 * 알림 UI의 열림/닫힘 상태를 토글하는 함수
	 */
	const handleOpen = useCallback(() => {
		setOpen(prev => !prev);
	}, []);

	/**
	 * 삭제 요청을 실행한 후 알림 UI를 토글하는 함수
	 * - mutation.mutate()를 호출하여 삭제 API를 실행
	 * - API 호출 후 알림 창 상태를 변경
	 */
	const handleDelete = useCallback(() => {
		mutation.mutate({ bookIsbn, sentenceId });
		handleOpen();
	}, [mutation, bookIsbn, sentenceId, handleOpen]);

	// 삭제 요청 진행 상태 (mutation 훅의 isPending 값)
	const deleting = mutation.isPending;

	return { open, handleOpen, handleDelete, deleting };
};
