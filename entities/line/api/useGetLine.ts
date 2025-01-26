import { api } from '@/shared/api/apiUtils';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const getLine = async (userId: string) => {
	const response = await api.get('/log/line', {
		headers: {
			'x-user-id': userId,
		},
	});
	return response.data;
};

export const useGetLine = () => {
	const { data: session } = useSession();

	if (!session) {
		redirect('/');
	}

	const userId = session.userId as string;

	const query = useQuery({
		queryKey: ['getLine', userId],
		queryFn: () => getLine(userId as string),
		retry: 3,

		enabled: !!userId,
	});
	return query;
};
