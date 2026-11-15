import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 네이버 책 검색은 서버 API(/api/books/search)를 통해서만 호출 (API 키는 서버에만 존재)
const getBookInfo = async (bookTitle: string) => {
	const response = await axios.get('/api/books/search', {
		params: {
			query: bookTitle,
		},
	});
	return response.data;
};

export const useGetBookInfo = (bookTitle: string) => {
	const query = useQuery({
		queryKey: ['getBookInfo', bookTitle],
		queryFn: () => getBookInfo(bookTitle),

		enabled: false,

		retry: 1,
	});
	return query;
};
