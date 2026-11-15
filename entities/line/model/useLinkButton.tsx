import React from 'react';
import {
	BookOpenIcon,
	DocumentTextIcon,
	PencilSquareIcon,
	ShieldCheckIcon,
} from '@heroicons/react/24/outline';

// 버튼 타입 정의
export type LinkButtonTypes = 'record' | 'view' | 'term' | 'privacy';

// 버튼 설정 타입 정의
type ButtonConfig = {
	text: string;
	className: string;
	icon: JSX.Element;
	href: string;
};

// 버튼 설정을 반환하는 순수 함수
const getButtonConfig = (type: LinkButtonTypes): ButtonConfig => {
	// 공통 스타일 상수 (btn-ink: 먹색 버튼, btn-line: 테두리 버튼 → app/globals.css)
	const iconClass = 'w-5 h-5';

	// 버튼 타입별 설정
	const configMap: Record<LinkButtonTypes, ButtonConfig> = {
		record: {
			text: '기록하기',
			className: 'btn-ink',
			icon: <PencilSquareIcon className={iconClass} />,
			href: '/log',
		},
		view: {
			text: '기록보기',
			className: 'btn-line',
			icon: <BookOpenIcon className={iconClass} />,
			href: '/line',
		},
		term: {
			text: '서비스 이용 약관',
			className: 'btn-line',
			icon: <DocumentTextIcon className={iconClass} />,
			href: '/term',
		},
		privacy: {
			text: '개인정보 처리방침',
			className: 'btn-line',
			icon: <ShieldCheckIcon className={iconClass} />,
			href: '/privacy',
		},
	};

	return configMap[type];
};

/**
 * 링크 버튼 설정을 반환하는 커스텀 훅
 * @param types - 버튼 타입 ('record', 'view', 'term', 'privacy')
 * @returns {ButtonConfig} - 버튼의 스타일, 텍스트, 아이콘, 링크를 포함한 설정 객체
 */
const useLinkButton = (types: LinkButtonTypes): ButtonConfig => {
	return getButtonConfig(types);
};

export default useLinkButton;
