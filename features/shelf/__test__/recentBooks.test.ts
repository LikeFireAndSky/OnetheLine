import { getRecentBooks } from '../lib/recentBooks';
import { normalizeIsbn } from '@/shared/lib/isbn';

const book = (id: string, extra: Record<string, unknown> = {}) => ({
	BookId: id,
	BookTitle: `책 ${id}`,
	BookAuthor: '저자',
	BookPublishedDate: '20200101',
	Category: 'literature-arts',
	...extra,
});

describe('normalizeIsbn', () => {
	it('13자리 ISBN을 우선 고른다', () => {
		expect(normalizeIsbn('8937460440 9788937460449')).toBe('9788937460449');
		expect(normalizeIsbn('978-89-374-6044-9')).toBe('9788937460449');
	});

	it('13자리가 없으면 10자리(X 포함)를 사용한다', () => {
		expect(normalizeIsbn('893746044x')).toBe('893746044X');
	});

	it('ISBN이 아니면 null', () => {
		expect(normalizeIsbn('')).toBeNull();
		expect(normalizeIsbn('abc')).toBeNull();
		expect(normalizeIsbn(undefined)).toBeNull();
	});
});

describe('getRecentBooks', () => {
	it('마지막으로 문장을 남긴 순서로 정렬하고 개수를 제한한다', () => {
		const logs = [
			book('old', { LastUpdated: '1000' }),
			book('new', { LastUpdated: '3000' }),
			// LastUpdated가 없는 예전 데이터는 문장 시간으로 판단
			book('legacy', {
				Contents: [
					{ SentenceID: 'a', Content: '문장', Timestamp: 2000 },
					{ SentenceID: 'b', Content: '문장', Timestamp: 'oops' },
				],
			}),
		];

		const recent = getRecentBooks(logs, 2);
		expect(recent.map(b => b.BookId)).toEqual(['new', 'legacy']);
		expect(recent[1]).toMatchObject({ lastActivity: 2000, sentenceCount: 2 });
	});

	it('시간 정보가 전혀 없는 책은 맨 뒤로 간다', () => {
		const recent = getRecentBooks([
			book('none'),
			book('dated', { LastUpdated: 5 }),
		]);
		expect(recent.map(b => b.BookId)).toEqual(['dated', 'none']);
		expect(recent[1].lastActivity).toBe(0);
	});
});
