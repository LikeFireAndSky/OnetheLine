import { api } from '@/shared/api/apiUtils';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const usePutReadingLog = () => {
	const { data: session } = useSession();

	if (!session) {
		redirect('/login');
	}

	const userId = session.userId as string;

	const putReadingLog = async (data: any) => {
		const response = await api.post('/log/enrollment', {
			userId,
			...data,
		});
		return response.data;
	};

	const mutation = useMutation({
		mutationKey: ['putReadingLog'],
		mutationFn: putReadingLog,

		onSuccess: () => {
			alert('로그 등록이 완료되었습니다.');
		},

		onError: error => {
			alert('로그 등록에 실패했습니다. 다시 시도해주세요.');
		},

		retry: 1,
	});
	return mutation;
};
