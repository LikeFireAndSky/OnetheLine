import { changeTime } from '@/shared/lib/utils';
import React, { useState, useCallback } from 'react';
import useDeleteLog from '../api/useDeleteLog';
import { Contents } from '@/app/line/page';
import { useBookData } from '@/shared/share/BookDataContext';
import { useRouter } from 'next/navigation';

// 개별 문서 아이템 타입 정의
/**
 * useAccordion 커스텀 훅
 *
 * @param bookIndex - 현재 아코디언의 인덱스
 * @param contents - 문장 데이터 배열
 * @returns { open, onClick, previewData, contentsLength, handleDelete, krTime }
 *          open: 현재 열린 인덱스 (-1이면 모두 닫힘)
 *          onClick: 아코디언을 토글하는 함수
 *          previewData: contents에서 랜덤으로 선택한 문장(배열)
 *          contentsLength: contents 배열의 길이
 *          handleDelete: 문장 삭제를 위한 함수 (API 호출)
 *          krTime: timestamp를 한국 시간 형식으로 변환하는 함수
 */

type AccordionComponentProps = {
	bookIndex: number;
	BookId: string;
	BookPublishedDate: string;
	BookAuthor: string;
	BookTitle: string;
	Contents: Contents[];
	Category: string;
	BookPublisher: string;
};

const useAccordion = ({
	bookIndex,
	BookId,
	BookPublishedDate,
	BookAuthor,
	BookTitle,
	Contents,
	Category,
	BookPublisher,
}: AccordionComponentProps) => {
	// 현재 열려있는 아코디언의 인덱스를 관리 (-1이면 모두 닫힘)
	const [open, setOpen] = useState(-1);
	// 문장 삭제를 위한 커스텀 훅 (API 호출)
	const mutation = useDeleteLog();

	// onClick: 현재 아코디언이 열려있다면 닫고, 닫혀있다면 열기
	const onClick = useCallback(() => {
		setOpen(prev => (prev === bookIndex ? -1 : bookIndex));
	}, [bookIndex]);

	// previewData: contents가 없으면 빈 배열, 있으면 무작위로 한 요소를 선택하여 배열로 반환
	const previewData =
		!Contents || Contents.length === 0
			? []
			: [Contents[Math.floor(Math.random() * Contents.length)]];

	// contentsLength: contents 배열의 길이 (존재하지 않으면 0)
	const contentsLength = Contents?.length ?? 0;

	// handleDelete: 전달받은 sentenceId와 bookIsbn을 사용하여 삭제 API 호출
	const handleDelete = useCallback(
		(sentenceId: string, bookIsbn: string) => {
			mutation.mutate({ bookIsbn, sentenceId });
		},
		[mutation],
	);

	// krTime: 주어진 timestamp를 changeTime 함수로 변환하여 반환
	const krTime = useCallback((timestamp: string) => changeTime(timestamp), []);

	const { setBookData } = useBookData();
	const router = useRouter();

	const handleClick = () => {
		setBookData({
			BookId,
			BookAuthor,
			BookTitle,
			BookPublishedDate,
			Contents,
			Category,
			BookPublisher,
		});
		router.push('/log');
	};

	const ifOpenClose = () => {
		if (open === bookIndex) {
			onClick();
		}
	};

	// 위에서 정의한 값과 함수들을 반환
	return {
		open,
		onClick,
		previewData,
		contentsLength,
		handleDelete,
		krTime,
		ifOpenClose,
		handleClick,
	};
};

export default useAccordion;
