import { z } from 'zod';

// 카테고리 색: 한지와 먹 테마에 맞춘 차분한 전통 색
// (color는 Tailwind 클래스, hex는 차트처럼 클래스를 쓸 수 없는 곳에서 사용)
export const bookCategoriesKor = [
	{
		type: 'business-economics',
		kor: '경제/비즈니스',
		color: 'bg-[#2F4B6E]', // 쪽빛
		hex: '#2F4B6E',
	},
	{
		type: 'science-technology',
		kor: '과학/기술',
		color: 'bg-[#4F7F78]', // 청자
		hex: '#4F7F78',
	},
	{
		type: 'selfHelp-psychology',
		kor: '자기계발/심리',
		color: 'bg-[#5A7247]', // 송록
		hex: '#5A7247',
	},
	{
		type: 'society-environment',
		kor: '사회/환경',
		color: 'bg-[#A97A2C]', // 황토
		hex: '#A97A2C',
	},
	{
		type: 'literature-arts',
		kor: '문학/예술',
		color: 'bg-[#7A3E55]', // 자주
		hex: '#7A3E55',
	},
];

// 알 수 없는 카테고리용 색 (먹색 계열)
const FALLBACK_HEX = '#8A8277';

// bookCategoriesKor 배열을 Map으로 변환하여 O(1) 조회를 가능하게 함
const bookCategoriesMap = new Map(
	bookCategoriesKor.map(category => [category.type, category]),
);

/**
 * 주어진 카테고리 타입에 해당하는 배경색 클래스를 반환합니다.
 * @param category - 카테고리 타입 문자열
 * @returns 해당 카테고리의 배경색 클래스, 없으면 'bg-ink-faint' 반환
 */
export const getCategoryColor = (category: string): string =>
	bookCategoriesMap.get(category)?.color ?? 'bg-ink-faint';

/**
 * 주어진 카테고리 타입에 해당하는 색상 코드를 반환합니다. (차트, 인라인 스타일용)
 * @param category - 카테고리 타입 문자열
 * @returns 해당 카테고리의 hex 색상, 없으면 먹색 계열 기본값 반환
 */
export const getCategoryHex = (category: string): string =>
	bookCategoriesMap.get(category)?.hex ?? FALLBACK_HEX;

/**
 * 주어진 카테고리 타입에 해당하는 한글 라벨을 반환합니다.
 * @param category - 카테고리 타입 문자열
 * @returns 해당 카테고리의 한글 라벨, 없으면 '기타' 반환
 */
export const getCategoryKor = (category: string): string =>
	bookCategoriesMap.get(category)?.kor ?? '기타';

export const bookSchema = z.object({
	bookTitle: z.string().nonempty('책을 검색하여 등록해주세요.'),
	bookIsbn: z.string().nonempty('ISBN is required.'),
	category: z.string().nonempty('카테고리를 선택해주세요.'),
	bookPublisher: z.string().nonempty('출판사를 입력해주세요.'),
	bookAuthor: z.string().nonempty('저자를 입력해주세요.'),
	bookPublishedDate: z.string().nonempty('출판일을 입력해주세요.'),
	sentence: z
		.string()
		.min(2, '최소 2글자 이상 입력해주세요.')
		.max(500, '최대 500글자까지 입력 가능합니다.'),
});

export type BookFormValues = z.infer<typeof bookSchema>;
