import { api } from '@/shared/api/apiUtils';
import { useMutation } from '@tanstack/react-query';
import { useGetReadingLog } from './useGetReadingLog';

const useDeleteLog = () => {
	const { refetch } = useGetReadingLog();

	const deleteLog = async (bookIsbn?: string, sentenceId?: string) => {
		const response = await api.delete('/log/log', {
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
		},

		onError: error => {},

		retry: 1,
	});

	return mutation;
};

export default useDeleteLog;
