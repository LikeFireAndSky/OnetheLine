// StatisticsContainer.tsx
import React from 'react';
import CategoryPieChart from './CategoryPieChart';
import BookBarChart from './BookBarChart';
import RecordCalendar from './RecordCalendar';

export const StatisticsContainer = () => {
	return (
		<section className="w-full flex flex-col items-center space-y-4">
			<RecordCalendar />
			<CategoryPieChart />
			<BookBarChart />
		</section>
	);
};
