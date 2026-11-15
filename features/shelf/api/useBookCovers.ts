import { useQuery } from '@tanstack/react-query';

// ISBN별 표지 이미지 주소 (찾지 못하면 null)
export type BookCovers = Record<string, string | null>;

export const useBookCovers = (isbns: string[]) =>
	useQuery<BookCovers>({
		queryKey: ['bookCovers', isbns],
		queryFn: async () => {
			const params = new URLSearchParams({ isbns: isbns.join(',') });
			const res = await fetch(`/api/books/covers?${params}`);
			if (!res.ok) throw new Error('Failed to fetch book covers');
			const { covers } = await res.json();
			return covers;
		},
		enabled: isbns.length > 0,
		// 표지는 거의 바뀌지 않으므로 하루 동안 다시 묻지 않음
		staleTime: 1000 * 60 * 60 * 24,
		retry: 1,
	});
