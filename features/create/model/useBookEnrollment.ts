import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import { BookFormValues, bookSchema } from '../config/bookEnrollmentConfig';
import { usePutReadingLog } from '../api/usePutReadingLog';
import { useGetBookInfo } from '../api/useGetBookInfo';
import { BookData, useBookData } from '@/shared/share/BookDataContext';

const useBookEnrollment = (bookData?: BookData) => {
	// 삭제 API 및 검색 API 관련 훅
	const mutation = usePutReadingLog();

	// 다이얼로그 열림 상태와 검색어 상태 관리
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	// 검색어를 인자로 하여 책 정보를 가져오는 API 호출
	const {
		data: searchResults,
		isLoading,
		isError,
		refetch,
	} = useGetBookInfo(searchQuery);

	// react-hook-form 초기화 (책 등록 관련 폼)
	const {
		control,
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		getValues,
		reset,
	} = useForm<BookFormValues>({
		resolver: zodResolver(bookSchema),
		resetOptions: { keepValues: true },
		defaultValues: {
			bookTitle: bookData?.BookTitle || '',
			bookIsbn: bookData?.BookId || '',
			category: bookData?.Category || '',
			sentence: '',
			bookAuthor: bookData?.BookAuthor || '',
			bookPublisher: bookData?.BookPublisher || '',
			bookPublishedDate: bookData?.BookPublishedDate || '',
		},
	});

	// debounced 함수: 검색어 업데이트를 300ms 지연 후에 실행하여 불필요한 호출을 줄임
	const debouncedSetSearchQuery = useMemo(
		() =>
			debounce((value: string) => {
				setSearchQuery(value);
			}, 300),
		[],
	);

	// 컴포넌트 언마운트 시 debounced 함수 취소
	useEffect(() => {
		return () => {
			debouncedSetSearchQuery.cancel();
		};
	}, [debouncedSetSearchQuery]);

	// 검색어 변경 핸들러 (debounce 적용)
	const handleSearchChange = useCallback(
		(query: string) => {
			debouncedSetSearchQuery(query);
		},
		[debouncedSetSearchQuery],
	);

	// mutation의 로딩 상태
	const mutationLoading = mutation.isPending;

	/**
	 * handleOpen: 검색어가 입력되어 있으면 검색 API를 재호출(refetch)하고 다이얼로그 상태를 토글,
	 *            입력이 없으면 alert를 띄웁니다.
	 */
	const handleOpen = useCallback(() => {
		if (searchQuery.trim()) {
			refetch();
			setOpen(prev => !prev);
		} else {
			alert('검색어를 입력해주세요.');
		}
	}, [searchQuery, refetch]);

	/**
	 * onSubmit: 폼 데이터를 받아 mutation을 실행한 후, sentence 필드만 초기화하고
	 *           나머지 책 정보는 유지하도록 폼 값을 다시 설정합니다.
	 */
	const onSubmit = useCallback(
		(data: BookFormValues) => {
			mutation.mutate({
				bookTitle: data.bookTitle,
				bookIsbn: data.bookIsbn,
				category: data.category,
				sentence: data.sentence,
				bookAuthor: data.bookAuthor,
				bookPublisher: data.bookPublisher,
				bookPublishedDate: data.bookPublishedDate,
			});

			// 등록 후 sentence 입력창만 초기화
			reset({ sentence: '' });

			// 등록 후 나머지 책 정보는 유지
			setValue('bookTitle', data.bookTitle);
			setValue('bookIsbn', data.bookIsbn);
			setValue('bookPublisher', data.bookPublisher);
			setValue('bookAuthor', data.bookAuthor);
			setValue('category', data.category);
			setValue('bookPublishedDate', data.bookPublishedDate);
		},
		[mutation, reset, setValue],
	);

	/**
	 * handleSelectBook: 선택한 책 정보를 폼에 채워넣고 다이얼로그를 닫습니다.
	 */
	const handleSelectBook = useCallback(
		(book: any) => {
			setValue('bookTitle', book.title);
			setValue('bookIsbn', book.isbn);
			setValue('bookPublisher', book.publisher);
			setValue(
				'bookAuthor',
				book.author?.length > 0 ? book.author : 'Unknown Author',
			);
			setValue('bookPublishedDate', book.pubdate);
			setOpen(false);
		},
		[setValue],
	);

	/**
	 * getBookTitle: 폼에서 bookTitle 값이 있으면 해당 제목을 반환하고, 없으면 기본 메시지를 반환합니다.
	 */
	const getBookTitle = useCallback(() => {
		return getValues('bookTitle')
			? getValues('bookTitle')
			: '책을 먼저 검색해주세요.';
	}, [getValues]);

	return {
		control,
		handleSubmit,
		register,
		errors,
		setValue,
		searchQuery,
		setSearchQuery: handleSearchChange,
		getValues,
		open,
		handleOpen,
		onSubmit,
		isLoading,
		isError,
		searchResults,
		handleSelectBook,
		getBookTitle,
		mutationLoading,
	};
};

export default useBookEnrollment;
