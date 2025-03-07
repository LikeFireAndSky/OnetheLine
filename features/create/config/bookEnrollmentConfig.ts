import { z } from 'zod';

export const bookCategoriesKor = [
	{
		type: 'business-economics',
		kor: '경제/비즈니스',
		color: 'bg-[#4E5FBF]',
	},
	{
		type: 'science-technology',
		kor: '과학/기술',
		color: 'bg-[#1D3159]',
	},
	{
		type: 'selfHelp-psychology',
		kor: '자기계발/심리',
		color: 'bg-[#8DA633]',
	},
	{
		type: 'society-environment',
		kor: '사회/환경',
		color: 'bg-[#F2B544]',
	},
	{
		type: 'literature-arts',
		kor: '문학/예술',
		color: 'bg-[#D9763D]',
	},
];

// bookCategoriesKor 배열을 Map으로 변환하여 O(1) 조회를 가능하게 함
const bookCategoriesMap = new Map(
	bookCategoriesKor.map(category => [category.type, category]),
);

/**
 * 주어진 카테고리 타입에 해당하는 배경색을 반환합니다.
 * @param category - 카테고리 타입 문자열
 * @returns 해당 카테고리의 배경색 문자열, 없으면 'bg-gray-300' 반환
 */
export const getCategoryColor = (category: string): string =>
	bookCategoriesMap.get(category)?.color ?? 'bg-gray-300';

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
	sentence: z
		.string()
		.min(2, '최소 2글자 이상 입력해주세요.')
		.max(500, '최대 500글자까지 입력 가능합니다.'),
});

export type BookFormValues = z.infer<typeof bookSchema>;
