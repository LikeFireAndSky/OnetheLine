import { changeTime } from '../../../shared/lib/utils';

// 타입 정의 (실제 데이터 구조에 맞게 조정 필요)
type LogData = {
	isAuthenticated: boolean;
	isEnrolled: boolean;
	data?: {
		Content: string;
		Timestamp: string;
		BookAuthor: string;
		BookPublisher: string;
		BookTitle: string;
	};
};

type MainLogProps = {
	data: LogData;
	isLoading: boolean;
	isError: boolean;
};

type LogTexts = {
	contentText: string;
	timeText: string;
	authorText: string;
	publisherText: string;
	titleText: string;
};

// 상태별 텍스트를 반환하는 순수 함수들
const getLoadingText = (): string => '로딩중...';
const getErrorText = (): string => '에러가 발생했습니다.';
const getCurrentDate = (): string => new Date().toLocaleDateString();

// 텍스트 생성 헬퍼 함수
const createText = (
	condition: boolean,
	trueValue: string,
	falseValue: string,
): string => (condition ? trueValue : falseValue);

// 메인 훅
export const useMainLog = ({
	data,
	isLoading,
	isError,
}: MainLogProps): LogTexts => {
	const getContentText = (): string => {
		if (isLoading) return getLoadingText();
		if (isError) return getErrorText();
		if (!data.isAuthenticated) {
			return '로그인 후 앞으로의 하루들을 바꿀 문장들을 기록하세요.';
		}
		return createText(
			data.isEnrolled && !!data.data,
			data.data?.Content ?? '',
			'오늘 당신에게 필요한 문장은 무엇인가요? 지금 바로 기록해보세요🙂',
		);
	};

	const getTimeText = (): string => {
		if (isLoading) return getLoadingText();
		if (isError) return getErrorText();
		if (!data.isAuthenticated) return getCurrentDate();
		return createText(
			data.isEnrolled && !!data.data,
			data.data?.Timestamp ? changeTime(data.data.Timestamp) : '',
			getCurrentDate(),
		);
	};

	const getAuthorText = (): string => {
		if (isLoading) return getLoadingText();
		if (isError) return getErrorText();
		if (!data.isAuthenticated) return '로';
		return createText(
			data.isEnrolled && !!data.data,
			data.data?.BookAuthor ?? '',
			'',
		);
	};

	const getPublisherText = (): string => {
		if (isLoading) return getLoadingText();
		if (isError) return getErrorText();
		if (!data.isAuthenticated) return '그인';
		return createText(
			data.isEnrolled && !!data.data,
			data.data?.BookPublisher ?? '',
			'',
		);
	};

	const getTitleText = (): string => {
		if (isLoading) return getLoadingText();
		if (isError) return getErrorText();
		if (!data.isAuthenticated) return '로그인이 필요합니다.';
		return createText(
			data.isEnrolled && !!data.data,
			data.data?.BookTitle ?? '',
			'제목',
		);
	};

	return {
		contentText: getContentText(),
		timeText: getTimeText(),
		authorText: getAuthorText(),
		publisherText: getPublisherText(),
		titleText: getTitleText(),
	};
};
