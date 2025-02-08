import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import { BookFormValues, bookSchema } from '../config/bookEnrollmentConfig';
import { usePutReadingLog } from '../api/usePutReadingLog';
import { useGetBookInfo } from '../api/useGetBookInfo';

const useBookEnrollment = () => {
	const mutation = usePutReadingLog();
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');
	const {
		data: searchResults,
		isLoading,
		isError,
		refetch,
	} = useGetBookInfo(searchQuery);

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
		resetOptions: {
			keepValues: true,
		},
		defaultValues: {
			bookTitle: '',
			bookIsbn: '',
			category: '',
			sentence: '',
			bookAuthor: '',
			bookPublisher: '',
		},
	});

	const debouncedSetSearchQuery = debounce((value: string) => {
		setSearchQuery(value);
	}, 300);

	const handleSearchChange = (query: string) => {
		debouncedSetSearchQuery(query);
	};

	const mutationLoading = mutation.isPending;

	const handleOpen = () => {
		if (searchQuery.trim()) {
			refetch();
			setOpen(!open); // 검색 결과가 있으면 다이얼로그 열기
		} else {
			alert('검색어를 입력해주세요.'); // 검색어가 없는 경우 경고
		}
	};

	const onSubmit = (data: BookFormValues) => {
		mutation.mutate({
			bookTitle: data.bookTitle,
			bookIsbn: data.bookIsbn,
			category: data.category,
			sentence: data.sentence,
			bookAuthor: data.bookAuthor,
			bookPublisher: data.bookPublisher,
		});

		// 등록 후 sentence 입력창만 초기화
		reset({
			sentence: '',
		});

		// 등록 후 book 정보는 유지
		setValue('bookTitle', data.bookTitle);
		setValue('bookIsbn', data.bookIsbn);
		setValue('bookPublisher', data.bookPublisher);
		setValue('bookAuthor', data.bookAuthor);
		setValue('category', data.category);
	};

	const handleSelectBook = (book: any) => {
		setValue('bookTitle', book.title);
		setValue('bookIsbn', book.isbn);
		setValue('bookPublisher', book.publisher);
		setValue(
			'bookAuthor',
			book.author?.length > 0 ? book.author : 'Unknown Author',
		);
		setOpen(false);
	};

	const getBookTitle = () =>
		getValues('bookTitle') ? getValues('bookTitle') : '책을 먼저 검색해주세요.';

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
