import { api } from '@/shared/api/apiUtils';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useGetReadingLog } from './useGetReadingLog';

const useDeleteLog = () => {
	const { refetch } = useGetReadingLog();
	const { data: session } = useSession();

	if (!session) {
		redirect('/login');
	}

	const userId = session.userId as string;

	const deleteLog = async (bookIsbn?: string, sentenceId?: string) => {
		const response = await api.delete('/log/log', {
			headers: {
				'x-user-id': userId,
			},
			params: {
				bookIsbn,
				sentenceId,
			},
		});
		return response.data;
	};

	const mutation = useMutation({
		mutationKey: ['putReadingLog'],
		mutationFn: ({
			bookIsbn,
			sentenceId,
		}: {
			bookIsbn: string;
			sentenceId: string;
		}) => deleteLog(bookIsbn, sentenceId),

		onSuccess: () => {
			// 삭제 후 새로고침
			refetch();
			console.log('Reading log is successfully deleted', '성공');
		},

		onError: error => {
			console.log('Failed to delete reading log', error);
		},

		retry: 1,
	});

	return mutation;
};

export default useDeleteLog;
