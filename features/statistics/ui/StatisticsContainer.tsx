// StatisticsContainer.tsx
import React from 'react';
import CategoryPieChart from './CategoryPieChart';
import BookBarChart from './BookBarChart';
import RecentLineChart from './RecentLineChart';

export const StatisticsContainer = () => {
	return (
		<section className="w-full flex flex-col items-center pb-3 space-y-5">
			<CategoryPieChart />
			<BookBarChart />
			<RecentLineChart />
		</section>
	);
};
