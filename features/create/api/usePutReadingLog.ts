import { api } from '@/shared/api/apiUtils';
import { useMutation } from '@tanstack/react-query';

export const usePutReadingLog = () => {
	// userId는 서버가 세션에서 추출하므로 요청 본문에 포함하지 않습니다.
	const putReadingLog = async (data: any) => {
		const response = await api.post('/log/enrollment', data);
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
