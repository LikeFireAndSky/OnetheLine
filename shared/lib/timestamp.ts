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
