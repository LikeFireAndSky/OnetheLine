import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export type CategoryStat = {
	category: string;
	count: number;
};

export const useCategorySummary = () => {
	return useQuery<CategoryStat[]>({
		queryKey: ['stat', 'category'],
		queryFn: async () => {
			const res = await fetch('/api/stat/category-summary');
			if (!res.ok) throw new Error('Failed to fetch category summary');
			const { data } = await res.json();
			return data;
		},
	});
};

export type TopBook = {
	bookTitle: string;
	count: number;
};

export const useTopBooks = () =>
	useQuery<TopBook[]>({
		queryKey: ['stat', 'top-books'],
		queryFn: async () => {
			const res = await fetch('/api/stat/top-books');
			if (!res.ok) throw new Error('Failed to fetch top books');
			const { data } = await res.json();
			return data;
		},
	});

type CumulativePoint = {
	date: string;
	cumulative: number;
};

export const useRecentCumulative = () =>
	useQuery<CumulativePoint[]>({
		queryKey: ['stat', 'cumulative'],
		queryFn: async () => {
			const res = await fetch('/api/stat/recent-daily-summary');
			if (!res.ok) throw new Error('Failed to fetch cumulative data');
			const { data } = await res.json();
			return data;
		},
	});
