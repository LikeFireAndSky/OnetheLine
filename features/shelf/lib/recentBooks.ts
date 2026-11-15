import { parseTimestamp } from '@/shared/lib/timestamp';

// /api/log/books 응답의 책 항목
export type ShelfLogSource = {
	BookId: string;
	BookTitle: string;
	BookAuthor: string;
	BookPublisher?: string;
	BookPublishedDate: string;
	Category: string;
	LastUpdated?: string | number;
	Contents?: {
		SentenceID: string;
		Content: string;
		Timestamp: string | number;
	}[];
};

export type RecentBook = ShelfLogSource & {
	// 마지막으로 문장을 남긴 시각 (밀리초)
	lastActivity: number;
	sentenceCount: number;
};

/**
 * 최근에 문장을 남긴 순서로 책을 고름
 * - LastUpdated가 없는 예전 데이터도 있으므로 문장 Timestamp 중 가장 최근 값도 함께 봄
 */
export const getRecentBooks = (
	logs: ShelfLogSource[],
	limit = 8,
): RecentBook[] =>
	logs
		.map(log => {
			const times = (log.Contents ?? [])
				.map(content => parseTimestamp(content.Timestamp))
				.filter((time): time is number => time !== null);
			return {
				...log,
				lastActivity: Math.max(
					parseTimestamp(log.LastUpdated) ?? 0,
					...times,
					0,
				),
				sentenceCount: log.Contents?.length ?? 0,
			};
		})
		.sort((a, b) => b.lastActivity - a.lastActivity)
		.slice(0, limit);
