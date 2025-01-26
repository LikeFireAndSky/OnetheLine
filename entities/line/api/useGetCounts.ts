import { api } from '@/shared/api/apiUtils';
import { useQuery } from '@tanstack/react-query';

const getCounts = async () => {
	const response = await api.get('/log/counts', {});
	return response.data;
};

export const useGetLine = () => {
	const query = useQuery({
		queryKey: ['getCounts'],
		queryFn: getCounts,
		retry: 3,
	});
	return query;
};
