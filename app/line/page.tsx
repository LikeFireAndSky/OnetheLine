'use client';

import React from 'react';
import AccordionComponent from '@/entities/archive/ui/Arccordion';
import { useGetReadingLog } from '@/entities/archive/api/useGetReadingLog';
import NoDataLinkCard from '@/entities/archive/ui/NoDataLinkCard';

export type ReadingLog = {
	UserId: string;
	BookId: string;
	BookTitle: string;
	Category: string;
	Contents: { SentenceID: string; Timestamp: string; Content: string }[];
};

const Page = () => {
	const { data, isLoading, isError } = useGetReadingLog();

	return (
		<section className="w-full h-full flex flex-col p-3 mt-3 space-y-5">
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
						index={index}
						bookIsbn={log.BookId}
						title={log.BookTitle}
						category={log.Category}
						contents={log.Contents}
					/>
				))}
		</section>
	);
};

export default Page;
