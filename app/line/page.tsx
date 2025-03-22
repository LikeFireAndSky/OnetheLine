'use client';

import React from 'react';
import AccordionComponent from '@/entities/archive/ui/Arccordion';
import { useGetReadingLog } from '@/entities/archive/api/useGetReadingLog';
import NoDataLinkCard from '@/entities/archive/ui/NoDataLinkCard';
import { useInView, animated } from '@react-spring/web';

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
	const [ref, inView] = useInView(() => ({
		from: { opacity: 0 },
		to: { opacity: 1 },
		config: {
			mass: 5,
			friction: 120,
			tension: 120,
		},
	}));

	const { data, isLoading, isError } = useGetReadingLog();

	return (
		<animated.section
			ref={ref}
			style={inView}
			className="w-full h-fit flex flex-col p-3 mt-3 space-y-5"
		>
			<div className="w-full flex flex-col space-y-1">
				<h1 className="text-2xl font-semibold">View the line</h1>
				<p className="text-base">오늘 하루를 바꿀 최고의 문장을 기록하세요.</p>
			</div>
			{isLoading && <div className=" animate-pulse">로딩중...</div>}
			{isError && <div>Error</div>}
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
