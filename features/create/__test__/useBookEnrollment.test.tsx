// useBookEnrollment.test.tsx
import { renderHook, act } from '@testing-library/react';
import useBookEnrollment from '../model/useBookEnrollment'; // 실제 경로에 맞게 수정

// 모킹: usePutReadingLog
const mockMutate = jest.fn();
const mockIsPending = false;
const mockRefetch = jest.fn();

jest.mock('../api/usePutReadingLog', () => ({
	__esModule: true,
	usePutReadingLog: () => ({
		mutate: mockMutate,
		isPending: mockIsPending,
	}),
}));

// 모킹: useGetBookInfo - 검색어(query)에 따라 간단한 결과를 반환하도록 설정
jest.mock('../api/useGetBookInfo', () => ({
	__esModule: true,
	useGetBookInfo: (query: string) => ({
		data: query
			? [
					{
						title: 'Test Book',
						isbn: '123',
						publisher: 'Test Publisher',
						author: 'Test Author',
						pubdate: '19990927',
					},
			  ]
			: [],
		isLoading: false,
		isError: false,
		refetch: mockRefetch,
	}),
}));

describe('useBookEnrollment hook', () => {
	beforeEach(() => {
		mockMutate.mockClear();
		mockRefetch.mockClear();
	});

	it('should initialize with default values', () => {
		const { result } = renderHook(() => useBookEnrollment());
		expect(result.current.searchQuery).toBe('');
		expect(result.current.open).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.searchResults).toEqual([]);
		expect(result.current.mutationLoading).toBe(false);
	});

	it('handleSearchChange updates searchQuery after debounce', () => {
		jest.useFakeTimers();
		const { result } = renderHook(() => useBookEnrollment());
		// handleSearchChange는 setSearchQuery로 할당되어 있음
		act(() => {
			result.current.setSearchQuery('New Query');
			jest.advanceTimersByTime(300);
		});
		expect(result.current.searchQuery).toBe('New Query');
		jest.useRealTimers();
	});

	it('handleOpen alerts when searchQuery is empty', () => {
		// alert 스파이 설정
		const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
		const { result } = renderHook(() => useBookEnrollment());
		act(() => {
			result.current.handleOpen();
		});
		expect(alertSpy).toHaveBeenCalledWith('검색어를 입력해주세요.');
		alertSpy.mockRestore();
	});

	it('handleOpen calls refetch and toggles open when searchQuery is non-empty', () => {
		jest.useFakeTimers();
		const { result } = renderHook(() => useBookEnrollment());
		// 검색어를 업데이트하여 비어있지 않은 상태로 만듦
		act(() => {
			result.current.setSearchQuery('Some Query');
			jest.advanceTimersByTime(300);
		});
		// 검색어가 있으므로 refetch가 호출되고 open 상태가 토글됨
		act(() => {
			result.current.handleOpen();
		});
		expect(mockRefetch).toHaveBeenCalled();
		expect(result.current.open).toBe(true);
		// 다시 호출하면 open 상태가 false로 토글됨
		act(() => {
			result.current.handleOpen();
		});
		expect(result.current.open).toBe(false);
		jest.useRealTimers();
	});

	it('onSubmit calls mutation.mutate with form data', () => {
		const { result } = renderHook(() => useBookEnrollment());
		const formData = {
			bookTitle: 'Title',
			bookIsbn: 'ISBN123',
			category: 'Fiction',
			sentence: 'A sample sentence',
			bookAuthor: 'Author Name',
			bookPublisher: 'Publisher Name',
			bookPublishedDate: '19990927',
		};
		act(() => {
			result.current.onSubmit(formData);
		});
		expect(mockMutate).toHaveBeenCalledWith(formData);
	});

	it('handleSelectBook sets book info and closes dialog', () => {
		const { result } = renderHook(() => useBookEnrollment());
		const dummyBook = {
			title: 'Dummy Book',
			isbn: 'DUMMYISBN',
			publisher: 'Dummy Publisher',
			author: 'Dummy Author',
		};
		// handleSelectBook를 호출하면 setValue를 통해 폼 값이 업데이트되고, open은 false가 됨
		act(() => {
			// 초기값을 빈 문자열로 설정한 후, handleSelectBook 호출
			result.current.setValue('bookTitle', '');
			result.current.handleSelectBook(dummyBook);
		});
		expect(result.current.getBookTitle()).toBe(dummyBook.title);
		expect(result.current.open).toBe(false);
	});

	it('getBookTitle returns default text if bookTitle is empty', () => {
		const { result } = renderHook(() => useBookEnrollment());
		act(() => {
			result.current.setValue('bookTitle', '');
		});
		expect(result.current.getBookTitle()).toBe('책을 먼저 검색해주세요.');
	});

	it('mutationLoading reflects mutation.isPending', () => {
		const { result } = renderHook(() => useBookEnrollment());
		expect(result.current.mutationLoading).toBe(false);
	});
});
