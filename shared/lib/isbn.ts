/**
 * 저장된 ISBN 문자열에서 조회용 ISBN 하나를 고름
 * - 네이버 책 검색의 isbn 값은 '10자리 13자리'처럼 공백으로 두 개가 붙어 오기도 함
 * - 13자리를 우선 사용하고, 없으면 10자리(X 포함)를 사용
 * @returns 유효한 ISBN이 없으면 null
 */
export const normalizeIsbn = (raw: unknown): string | null => {
	if (typeof raw !== 'string') return null;
	const tokens = raw
		.split(/[\s,]+/)
		.map(token => token.replace(/-/g, '').toUpperCase())
		.filter(Boolean);
	const isbn13 = tokens.find(token => /^\d{13}$/.test(token));
	if (isbn13) return isbn13;
	return tokens.find(token => /^\d{9}[\dX]$/.test(token)) ?? null;
};
