import { changeTime } from '@/shared/lib/utils';
import React from 'react';
import useDeleteLog from '../api/useDeleteLog';

const useAccordion = ({
	index,
	contents,
}: {
	index: number;
	contents: { SentenceID: string; Timestamp: string; Content: string }[];
}) => {
	const [open, setOpen] = React.useState(-1);
	const mutation = useDeleteLog();

	const handleOpen = (value: number) => setOpen(open === value ? -1 : value);

	const onClick = () => handleOpen(index);

	// contents에서 2개 이하의 문장을 랜덤으로 선택한 후 그 문장을 배열로 반환, 단 contents가 2개 이하일 경우 contents를 그대로 반환
	const previewContents = () => {
		// contents가 비어있다면 빈 배열을 반환
		if (!contents || contents.length === 0) return [];

		// contents 길이 내에서 무작위 인덱스 선택
		const randomIndex = Math.floor(Math.random() * contents.length);

		// 선택된 한 개 아이템만 배열 형태로 반환
		return [contents[randomIndex]];
	};

	const previewData = previewContents();
	const contentsLength = contents ? contents.length : 0;

	const handleDelete = (sentenceId: string, bookIsbn: string) => {
		mutation.mutate({ bookIsbn, sentenceId });
	};

	const krTime = (timestamp: string) => changeTime(timestamp);

	return { open, onClick, previewData, contentsLength, handleDelete, krTime };
};

export default useAccordion;
