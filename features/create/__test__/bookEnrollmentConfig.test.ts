// bookEnrollmentConfig.test.ts
import { z } from 'zod';
import {
	getCategoryColor,
	getCategoryKor,
	getCategoryHex,
	bookSchema,
} from '../config/bookEnrollmentConfig';

describe('Book Enrollment Config', () => {
	describe('Category Functions', () => {
		it('should return correct color for valid category', () => {
			expect(getCategoryColor('business-economics')).toBe('bg-[#2F4B6E]');
			expect(getCategoryColor('science-technology')).toBe('bg-[#4F7F78]');
			expect(getCategoryColor('selfHelp-psychology')).toBe('bg-[#5A7247]');
			expect(getCategoryColor('society-environment')).toBe('bg-[#A97A2C]');
			expect(getCategoryColor('literature-arts')).toBe('bg-[#7A3E55]');
		});

		it('should return default color for invalid category', () => {
			expect(getCategoryColor('non-existent')).toBe('bg-ink-faint');
		});

		it('should return hex colors matching the color classes', () => {
			expect(getCategoryHex('business-economics')).toBe('#2F4B6E');
			expect(getCategoryHex('literature-arts')).toBe('#7A3E55');
			expect(getCategoryHex('non-existent')).toBe('#8A8277');
		});

		it('should return correct Korean label for valid category', () => {
			expect(getCategoryKor('business-economics')).toBe('경제/비즈니스');
			expect(getCategoryKor('science-technology')).toBe('과학/기술');
			expect(getCategoryKor('selfHelp-psychology')).toBe('자기계발/심리');
			expect(getCategoryKor('society-environment')).toBe('사회/환경');
			expect(getCategoryKor('literature-arts')).toBe('문학/예술');
		});

		it('should return default Korean label for invalid category', () => {
			expect(getCategoryKor('non-existent')).toBe('기타');
		});
	});

	describe('bookSchema Validation', () => {
		const validData = {
			bookTitle: 'Test Book',
			bookIsbn: '1234567890',
			category: 'business-economics',
			bookPublisher: 'Test Publisher',
			bookAuthor: 'Test Author',
			sentence: 'This is a valid sentence.',
			bookPublishedDate: '2022-01-01',
		};

		it('should validate valid data successfully', () => {
			const result = bookSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validData);
			}
		});

		it('should fail validation when required fields are empty', () => {
			const invalidData = {
				bookTitle: '',
				bookIsbn: '',
				category: '',
				bookPublisher: '',
				bookAuthor: '',
				sentence: '',
				bookPublishedDate: '',
			};
			const result = bookSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const errors = z.flattenError(result.error).fieldErrors;
				expect(errors.bookTitle).toContain('책을 검색하여 등록해주세요.');
				expect(errors.bookIsbn).toContain('ISBN is required.');
				expect(errors.category).toContain('카테고리를 선택해주세요.');
				expect(errors.bookPublisher).toContain('출판사를 입력해주세요.');
				expect(errors.bookAuthor).toContain('저자를 입력해주세요.');
				expect(errors.sentence).toContain('최소 2글자 이상 입력해주세요.');
				expect(errors.bookPublishedDate).toContain('출판일을 입력해주세요.');
			}
		});

		it('should fail when sentence is too short', () => {
			const invalidData = { ...validData, sentence: 'a' };
			const result = bookSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const errors = z.flattenError(result.error).fieldErrors;
				expect(errors.sentence).toContain('최소 2글자 이상 입력해주세요.');
			}
		});

		it('should fail when sentence is too long', () => {
			const longSentence = 'a'.repeat(501);
			const invalidData = { ...validData, sentence: longSentence };
			const result = bookSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const errors = z.flattenError(result.error).fieldErrors;
				expect(errors.sentence).toContain('최대 500글자까지 입력 가능합니다.');
			}
		});
	});
});
