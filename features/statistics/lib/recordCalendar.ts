// 나의 기록 달력: 서재 데이터(책별 문장 목록)를 날짜별로 묶고 달력 칸을 계산하는 순수 함수들

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 달력에서 하루에 보여줄 문장 정보
export type DayRecord = {
	id: string;
	content: string;
	bookTitle: string;
	category: string;
	timestamp: number;
};

// /api/log/books 응답의 책 항목 중 달력에 필요한 부분만
export type CalendarLogSource = {
	BookTitle: string;
	Category: string;
	Contents?: {
		SentenceID: string;
		Content: string;
		Timestamp: string | number;
	}[];
};

/**
 * 저장된 Timestamp(밀리초 숫자 또는 숫자 문자열, 혹은 날짜 문자열)를 밀리초로 변환
 * @returns 해석할 수 없으면 null
 */
export const parseTimestamp = (value: unknown): number | null => {
	if (typeof value === 'number') return Number.isFinite(value) ? value : null;
	if (typeof value !== 'string' || value.trim() === '') return null;
	const numeric = Number(value);
	if (Number.isFinite(numeric)) return numeric;
	const parsed = Date.parse(value);
	return Number.isNaN(parsed) ? null : parsed;
};

/**
 * 사용자의 현지 시간 기준 날짜 키 (YYYY-MM-DD)
 * - toISOString은 UTC 기준이라 한국 시간 자정~오전 9시 기록이 전날로 밀리므로 사용하지 않음
 */
export const toDateKey = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

/**
 * 책별 문장 목록을 날짜별로 묶음 (같은 날 안에서는 최근 기록이 먼저)
 */
export const groupRecordsByDate = (
	logs: CalendarLogSource[],
): Map<string, DayRecord[]> => {
	const byDate = new Map<string, DayRecord[]>();

	for (const log of logs) {
		for (const content of log.Contents ?? []) {
			const timestamp = parseTimestamp(content.Timestamp);
			if (timestamp === null) continue;

			const key = toDateKey(new Date(timestamp));
			const records = byDate.get(key) ?? [];
			records.push({
				id: content.SentenceID,
				content: content.Content,
				bookTitle: log.BookTitle,
				category: log.Category,
				timestamp,
			});
			byDate.set(key, records);
		}
	}

	byDate.forEach(records => records.sort((a, b) => b.timestamp - a.timestamp));
	return byDate;
};

/**
 * 한 달을 일요일 시작 주 단위로 나눈 달력 칸 (달에 속하지 않는 칸은 null)
 * @param year - 연도 (예: 2026)
 * @param month - 0부터 시작하는 월 (0 = 1월)
 */
export const buildMonthWeeks = (
	year: number,
	month: number,
): (Date | null)[][] => {
	const firstWeekday = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const cells: (Date | null)[] = [
		...Array.from({ length: firstWeekday }, () => null),
		...Array.from(
			{ length: daysInMonth },
			(_, index) => new Date(year, month, index + 1),
		),
	];
	while (cells.length % 7 !== 0) cells.push(null);

	const weeks: (Date | null)[][] = [];
	for (let i = 0; i < cells.length; i += 7) {
		weeks.push(cells.slice(i, i + 7));
	}
	return weeks;
};

/**
 * 해당 월에 기록이 있는 날짜 키 목록 (최근 날짜가 먼저)
 */
export const getRecordedDaysInMonth = (
	byDate: Map<string, DayRecord[]>,
	year: number,
	month: number,
): string[] => {
	const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
	return Array.from(byDate.keys())
		.filter(key => key.startsWith(prefix))
		.sort()
		.reverse();
};

/**
 * 하루 기록 수에 따른 도장 진하기 단계 (0: 없음, 1~3: 연함~진함)
 */
export const getStampLevel = (count: number): 0 | 1 | 2 | 3 => {
	if (count <= 0) return 0;
	if (count === 1) return 1;
	if (count === 2) return 2;
	return 3;
};
