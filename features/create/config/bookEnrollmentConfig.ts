import React from 'react';
import { z } from 'zod';

export const bookCategoriesKor = [
	{
		type: 'business-economics',
		kor: '경제/비즈니스',
	},
	{
		type: 'science-technology',
		kor: '과학/기술',
	},
	{
		type: 'selfHelp-psychology',
		kor: '자기계발/심리',
	},
	{
		type: 'society-environment',
		kor: '사회/환경',
	},
	{
		type: 'literature-arts',
		kor: '문학/예술',
	},
];

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
