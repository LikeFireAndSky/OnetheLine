import React from 'react';
import { DocumentTextIcon, FireIcon } from '@heroicons/react/16/solid';

// 링크 카드 타입 정의
export type LinkCardTypes = 'totalBooks' | 'totalSentences';

// 반환 타입 정의
export type LinkCardConfig = {
	text: string;
	Icon: JSX.Element;
	number: string | number;
};

// 입력 props 타입 정의 (data를 선택적으로 수정)
export type UseLinkCardProps = {
	types: LinkCardTypes;
	data?: {
		// data를 선택적으로 만듦
		isEnrolled: boolean;
		data?: { totalBooks: number };
		SentenceCounts?: number;
	};
	isLoading: boolean;
	isError: boolean;
};

// 상태별 숫자 계산 헬퍼 함수
const getNumber = (
	isLoading: boolean,
	isError: boolean,
	condition: boolean,
	value: number | undefined,
): string | number => {
	if (isLoading) return '로딩중...';
	if (isError) return '에러가 발생했습니다.';
	return condition && value && value > 0 ? value : 0;
};

// 링크 카드 설정 반환 함수
const getLinkCardConfig = ({
	types,
	data = { isEnrolled: false }, // 기본값 제공
	isLoading,
	isError,
}: UseLinkCardProps): LinkCardConfig => {
	const iconProps = { color: 'black', className: 'w-5 h-5' };

	const configMap: Record<LinkCardTypes, LinkCardConfig> = {
		totalBooks: {
			text: '전체 책 수',
			Icon: <DocumentTextIcon {...iconProps} />,
			number: getNumber(
				isLoading,
				isError,
				data.isEnrolled && !!data.data,
				data.data?.totalBooks,
			),
		},
		totalSentences: {
			text: '전체 구절 수',
			Icon: <FireIcon {...iconProps} />,
			number: getNumber(
				isLoading,
				isError,
				data.isEnrolled,
				data.SentenceCounts,
			),
		},
	};

	return configMap[types];
};

/**
 * 링크 카드 설정을 반환하는 커스텀 훅
 * @param props - 타입, 데이터, 로딩/에러 상태
 * @returns {LinkCardConfig} - 텍스트, 아이콘, 숫자 포함 객체
 */
export const useLinkCard = (props: UseLinkCardProps): LinkCardConfig => {
	return getLinkCardConfig(props);
};
