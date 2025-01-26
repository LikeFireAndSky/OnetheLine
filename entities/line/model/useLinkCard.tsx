import React from 'react';
import { DocumentTextIcon, FireIcon } from '@heroicons/react/16/solid';
export type linkCardTypes = 'totalBooks' | 'totalSentences';

export const useLinkCard = ({
	types,
	data,
	isLoading,
	isError,
}: {
	types: linkCardTypes;
	data: any;
	isLoading: boolean;
	isError: boolean;
}) => {
	const linkCardConfig = {
		totalBooks: {
			text: '전체 책 수',
			Icon: (
				<DocumentTextIcon
					color="black"
					className="w-5 h-5"
				/>
			),
			number: isLoading
				? '로딩중...'
				: isError
				? '에러가 발생했습니다.'
				: data.isEnrolled && data.data && data.data.totalBooks > 0
				? data.data.totalBooks
				: 0,
		},
		totalSentences: {
			text: '전체 구절 수',
			Icon: (
				<FireIcon
					color="black"
					className="w-5 h-5"
				/>
			),
			number: isLoading
				? '로딩중...'
				: isError
				? '에러가 발생했습니다.'
				: data.isEnrolled && data.SentenceCounts > 0
				? data.SentenceCounts
				: 0,
		},
	};

	const linkCardType =
		types === 'totalBooks'
			? linkCardConfig.totalBooks
			: linkCardConfig.totalSentences;

	return linkCardType;
};
