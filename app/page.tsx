'use client';

import React from 'react';
import { animated } from '@react-spring/web';
import MainLog from '@/entities/line/ui/MainLog';
import { useGetLine } from '@/entities/line/api/useGetLine';
import LinkButton from '@/entities/line/ui/LinkButton';
import LinkCard from '../entities/line/ui/LinkCard';
import LogInButton from '@/processes/user/ui/LogInButton';
import { StatisticsContainer } from '@/features/statistics/ui/StatisticsContainer';
import RecentBooks from '@/features/shelf/ui/RecentBooks';
import { useFadeIn } from '@/shared/lib/useFadeIn';

const Home = () => {
	const [ref, fadeIn] = useFadeIn();

	const { data, isLoading, isError } = useGetLine();

	return (
		<animated.section
			ref={ref}
			style={fadeIn}
			className="w-full h-fit flex flex-col px-4 pt-6 pb-8 space-y-6"
		>
			<div className="w-full flex flex-col gap-1">
				<h1 className="page-title">One the Line</h1>
				<p className="page-subtitle">하루를 바꾸는 단 한 줄</p>
			</div>
			<MainLog
				data={data}
				isLoading={isLoading}
				isError={isError}
			/>
			<div className="w-full">
				{data && data.isAuthenticated ? (
					<div className="w-full grid grid-cols-2 gap-3">
						<LinkButton types="record" />
						<LinkButton types="view" />
					</div>
				) : (
					<LogInButton
						isAuthenticated={
							data && data.isAuthenticated ? data.isAuthenticated : false
						}
						isLoading={isLoading}
					/>
				)}
			</div>
			<div className="w-full grid grid-cols-2 gap-3">
				<LinkCard
					types="totalBooks"
					data={data}
					isLoading={isLoading}
					isError={isError}
				/>
				<LinkCard
					types="totalSentences"
					data={data}
					isLoading={isLoading}
					isError={isError}
				/>
			</div>
			<RecentBooks />
			<StatisticsContainer />
		</animated.section>
	);
};

export default Home;
