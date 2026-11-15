import { api } from '@/shared/api/apiUtils';
import { useQuery } from '@tanstack/react-query';

export const getReadingLog = async () => {
	const response = await api.get('/log/books', {});
	return response.data;
};

/**
 * 서재(책별 문장 목록) 조회
 * @param enabled - false면 요청하지 않음 (예: 로그인 전에는 401만 반복되므로 꺼둠)
 */
export const useGetReadingLog = ({
	enabled = true,
}: { enabled?: boolean } = {}) => {
	const query = useQuery({
		queryKey: ['getReadingLog'],
		queryFn: getReadingLog,
		enabled,

		retry: 3,

		refetchOnReconnect: true,
		refetchOnWindowFocus: false,
		refetchInterval: 1000 * 60 * 5, // 5분
		refetchIntervalInBackground: false,
	});
	return query;
};
