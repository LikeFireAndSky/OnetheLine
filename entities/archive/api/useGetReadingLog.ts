import { api } from '@/shared/api/apiUtils';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const getReadingLog = async (userId: string) => {
	const response = await api.get('/log/books', {
		headers: {
			'x-user-id': userId,
		},
	});
	return response.data;
};

export const useGetReadingLog = () => {
	const { data: session } = useSession();

	if (!session) {
		redirect('/login');
	}

	const userId = session?.userId as string;

	const query = useQuery({
		queryKey: ['getReadingLog', userId],
		queryFn: () => getReadingLog(userId),

		retry: 3,
	});
	return query;
};
