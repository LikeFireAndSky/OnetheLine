import { api } from '@/shared/api/apiUtils';
import { useQuery } from '@tanstack/react-query';

export const getReadingLog = async () => {
	const response = await api.get('/log/books', {});
	return response.data;
};

export const useGetReadingLog = () => {
	const query = useQuery({
		queryKey: ['getReadingLog'],
		queryFn: getReadingLog,

		retry: 3,

		refetchOnReconnect: true,
		refetchOnWindowFocus: false,
		refetchInterval: 1000 * 60 * 5, // 5분
		refetchIntervalInBackground: false,
	});
	return query;
};
