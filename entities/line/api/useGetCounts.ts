import { api } from '@/shared/api/apiUtils';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const getCounts = async (userId: string) => {
	const response = await api.get('/log/counts', {
		headers: {
			'x-user-id': userId,
		},
	});
	return response.data;
};

export const useGetLine = () => {
	const { data: session } = useSession();

	if (!session) {
		redirect('/login');
	}

	const userId = session.userId as string;

	const query = useQuery({
		queryKey: ['getCounts', userId],
		queryFn: () => getCounts(userId as string),
		retry: 3,
	});
	return query;
};
