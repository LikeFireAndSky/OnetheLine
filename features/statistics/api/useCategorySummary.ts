import { useQuery } from '@tanstack/react-query';

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
