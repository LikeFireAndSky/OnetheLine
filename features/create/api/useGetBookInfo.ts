import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const getBookInfo = async (bookTitle: string) => {
	const response = await axios.get('api/naver/v1/search/book.json', {
		params: {
			query: bookTitle,
			display: 10,
			sort: 'sim',
		},
		headers: {
			'X-Naver-Client-Id': process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
			'X-Naver-Client-Secret': process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
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
