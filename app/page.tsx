'use client';

import React from 'react';
import { useInView, animated } from '@react-spring/web';
import MainLog from '@/entities/line/ui/MainLog';
import { useGetLine } from '@/entities/line/api/useGetLine';
import LinkButton from '@/entities/line/ui/LinkButton';
import LinkCard from '../entities/line/ui/LinkCard';
import LogInButton from '@/processes/user/ui/LogInButton';
import { StatisticsContainer } from '@/features/statistics/ui/StatisticsContainer';

const Home = () => {
	const [ref, inView] = useInView(() => ({
		from: { opacity: 0 },
		to: { opacity: 1 },
		config: {
			mass: 5,
			friction: 120,
			tension: 120,
		},
	}));

	const { data, isLoading, isError } = useGetLine();

	return (
		<animated.section
			ref={ref}
			style={inView}
			className="w-full h-fit flex flex-col p-3 mt-3 space-y-5"
		>
			<div className="w-full flex flex-col space-y-1">
				<h1 className="text-2xl font-semibold">One the Line</h1>
				<p className="text-base">하루를 바꾸는 단 한 줄</p>
			</div>
			<MainLog
				data={data}
				isLoading={isLoading}
				isError={isError}
			/>
			<div className={`w-full gap-3`}>
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
			<StatisticsContainer />
		</animated.section>
	);
};

export default Home;
