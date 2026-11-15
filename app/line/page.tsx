'use client';

import React from 'react';
import AccordionComponent from '@/entities/archive/ui/Arccordion';
import { useGetReadingLog } from '@/entities/archive/api/useGetReadingLog';
import NoDataLinkCard from '@/entities/archive/ui/NoDataLinkCard';
import { animated } from '@react-spring/web';
import { useFadeIn } from '@/shared/lib/useFadeIn';

export type Contents = {
	SentenceID: string;
	Timestamp: string;
	Content: string;
};

export type ReadingLog = {
	UserId: string;
	BookId: string;
	BookTitle: string;
	LastUpdated: string;
	Category: string;
	BookAuthor: string;
	BookPublishedDate: string;
	BookPublisher: string;
	Contents: Contents[];
};

const Page = () => {
	const [ref, fadeIn] = useFadeIn();

	const { data, isLoading, isError } = useGetReadingLog();

	return (
		<animated.section
			ref={ref}
			style={fadeIn}
			className="w-full h-fit flex flex-col px-4 pt-6 pb-8 space-y-4"
		>
			<div className="w-full flex flex-col gap-1 pb-2">
				<h1 className="page-title">나의 서재</h1>
				<p className="page-subtitle">
					오늘 하루를 바꿀 최고의 문장을 기록하세요.
				</p>
			</div>
			{isLoading && (
				<p
					role="status"
					className="paper w-full px-5 py-6 text-[15px] text-ink-muted animate-pulse"
				>
					서재를 펼치는 중입니다...
				</p>
			)}
			{isError && (
				<p
					role="alert"
					className="paper w-full px-5 py-6 text-[15px] text-seal"
				>
					기록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
				</p>
			)}
			{data && data.count < 1 && <NoDataLinkCard />}
			{data &&
				data.data &&
				data?.data.map((log: ReadingLog, index: number) => (
					<AccordionComponent
						key={log.BookId + log.Category}
						UserId={log.UserId}
						BookAuthor={log.BookAuthor}
						LastUpdated={log.LastUpdated}
						bookIndex={index}
						BookId={log.BookId}
						BookTitle={log.BookTitle}
						Category={log.Category}
						Contents={log.Contents}
						BookPublisher={log.BookPublisher}
						BookPublishedDate={log.BookPublishedDate}
					/>
				))}
		</animated.section>
	);
};

export default Page;
