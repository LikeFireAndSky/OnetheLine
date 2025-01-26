import { changeTime } from '../../../shared/lib/utils';

export const useMainLog = ({
	data,
	isLoading,
	isError,
}: {
	data: any;
	isLoading: boolean;
	isError: boolean;
}) => {
	const returnData = {
		contentText: isLoading
			? '로딩중...'
			: isError
			? '에러가 발생했습니다.'
			: data.isEnrolled && data.data
			? data.data.Content
			: '앞으로의 하루를 바꿀 책의 구절을 지금 바로 기록하세요.',
		timeText: isLoading
			? '로딩중...'
			: isError
			? '에러가 발생했습니다.'
			: data.isEnrolled && data.data
			? data.data.Timestamp && changeTime(data.data.Timestamp)
			: new Date().toLocaleDateString(),
		authorText: isLoading
			? '로딩중...'
			: isError
			? '에러가 발생했습니다.'
			: data.isEnrolled && data.data
			? data.data.BookAuthor
			: '',

		publisherText: isLoading
			? '로딩중...'
			: isError
			? '에러가 발생했습니다.'
			: data.isEnrolled && data.data
			? data.data.BookPublisher
			: '',

		titleText: isLoading
			? '로딩중...'
			: isError
			? '에러가 발생했습니다.'
			: data.isEnrolled && data.data
			? data.data.BookTitle
			: '제목',
	};

	return returnData;
};
