import {
	buildMonthWeeks,
	getRecordedDaysInMonth,
	getStampLevel,
	groupRecordsByDate,
	parseTimestamp,
	toDateKey,
} from '../lib/recordCalendar';

describe('recordCalendar', () => {
	describe('parseTimestamp', () => {
		it('밀리초 숫자와 숫자 문자열을 그대로 사용한다', () => {
			expect(parseTimestamp(1763164800000)).toBe(1763164800000);
			expect(parseTimestamp('1763164800000')).toBe(1763164800000);
		});

		it('날짜 문자열도 해석한다', () => {
			expect(parseTimestamp('2026-11-15T00:00:00Z')).toBe(
				Date.UTC(2026, 10, 15),
			);
		});

		it('해석할 수 없는 값은 null', () => {
			expect(parseTimestamp(undefined)).toBeNull();
			expect(parseTimestamp('')).toBeNull();
			expect(parseTimestamp('not a date')).toBeNull();
			expect(parseTimestamp(Number.NaN)).toBeNull();
		});
	});

	describe('toDateKey', () => {
		it('현지 시간 기준 YYYY-MM-DD를 만든다', () => {
			expect(toDateKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
			expect(toDateKey(new Date(2026, 10, 15, 0, 1))).toBe('2026-11-15');
		});
	});

	describe('groupRecordsByDate', () => {
		const logs = [
			{
				BookTitle: '데미안',
				Category: 'literature-arts',
				Contents: [
					{
						SentenceID: 'a',
						Content: '첫 문장',
						Timestamp: new Date(2026, 10, 15, 9).getTime(),
					},
					{
						SentenceID: 'b',
						Content: '같은 날 늦은 문장',
						Timestamp: String(new Date(2026, 10, 15, 22).getTime()),
					},
				],
			},
			{
				BookTitle: '코스모스',
				Category: 'science-technology',
				Contents: [
					{
						SentenceID: 'c',
						Content: '다른 날',
						Timestamp: new Date(2026, 10, 3, 12).getTime(),
					},
					{ SentenceID: 'd', Content: '깨진 시간', Timestamp: 'oops' },
				],
			},
			{ BookTitle: '빈 책', Category: 'etc' },
		];

		it('날짜별로 묶고 같은 날은 최근 기록이 먼저 온다', () => {
			const byDate = groupRecordsByDate(logs);
			expect(Array.from(byDate.keys()).sort()).toEqual([
				'2026-11-03',
				'2026-11-15',
			]);
			expect(byDate.get('2026-11-15')?.map(r => r.id)).toEqual(['b', 'a']);
			expect(byDate.get('2026-11-03')?.[0]).toMatchObject({
				content: '다른 날',
				bookTitle: '코스모스',
				category: 'science-technology',
			});
		});

		it('시간을 해석할 수 없는 문장과 문장이 없는 책은 건너뛴다', () => {
			const byDate = groupRecordsByDate(logs);
			const ids = Array.from(byDate.values())
				.flat()
				.map(r => r.id);
			expect(ids).not.toContain('d');
			expect(ids).toHaveLength(3);
		});

		it('해당 월의 기록한 날을 최근 순으로 돌려준다', () => {
			const byDate = groupRecordsByDate(logs);
			expect(getRecordedDaysInMonth(byDate, 2026, 10)).toEqual([
				'2026-11-15',
				'2026-11-03',
			]);
			expect(getRecordedDaysInMonth(byDate, 2026, 9)).toEqual([]);
		});
	});

	describe('buildMonthWeeks', () => {
		it('일요일 시작 주 단위로 달을 나누고 빈칸은 null', () => {
			// 2026년 11월 1일은 일요일, 30일까지
			const weeks = buildMonthWeeks(2026, 10);
			expect(weeks).toHaveLength(5);
			expect(weeks[0][0]?.getDate()).toBe(1);
			expect(weeks[4][1]?.getDate()).toBe(30);
			expect(weeks[4].slice(2)).toEqual([null, null, null, null, null]);
		});

		it('달 앞쪽 빈칸을 채운다', () => {
			// 2026년 1월 1일은 목요일
			const weeks = buildMonthWeeks(2026, 0);
			expect(weeks[0].slice(0, 4)).toEqual([null, null, null, null]);
			expect(weeks[0][4]?.getDate()).toBe(1);
			expect(weeks.every(week => week.length === 7)).toBe(true);
		});
	});

	describe('getStampLevel', () => {
		it('기록 수에 따라 도장 진하기를 정한다', () => {
			expect(getStampLevel(0)).toBe(0);
			expect(getStampLevel(1)).toBe(1);
			expect(getStampLevel(2)).toBe(2);
			expect(getStampLevel(5)).toBe(3);
		});
	});
});
