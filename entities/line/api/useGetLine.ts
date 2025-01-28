import { api } from '@/shared/api/apiUtils';
import { useQuery } from '@tanstack/react-query';

const getLine = async () => {
	const response = await api.get('/log/line');
	return response.data;
};

export const useGetLine = () => {
	const query = useQuery({
		queryKey: ['getLine'],
		queryFn: getLine,
		retry: 1,

		staleTime: 1000 * 60 * 60 * 12,
	});
	return query;
};
