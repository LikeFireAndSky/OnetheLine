import React from 'react';
import {
	ListBulletIcon,
	PlusIcon,
	IdentificationIcon,
} from '@heroicons/react/16/solid';

// 버튼 타입 정의
export type LinkButtonTypes = 'record' | 'view' | 'term' | 'privacy';

// 버튼 설정 타입 정의
type ButtonConfig = {
	color: string;
	text: string;
	className: string;
	icon: JSX.Element;
	href: string;
};

// 버튼 설정을 반환하는 순수 함수
const getButtonConfig = (type: LinkButtonTypes): ButtonConfig => {
	// 공통 스타일 상수
	const iconClass = 'w-5 h-5';
	const baseClassName =
		'w-full flex items-center justify-center gap-1 rounded-sm';

	// 버튼 타입별 설정
	const configMap: Record<LinkButtonTypes, ButtonConfig> = {
		record: {
			color: 'black',
			text: '기록하기',
			className: baseClassName,
			icon: <PlusIcon className={iconClass} />,
			href: '/log',
		},
		view: {
			color: 'white',
			text: '기록보기',
			className: `${baseClassName} border border-black`,
			icon: <ListBulletIcon className={iconClass} />,
			href: '/line',
		},
		term: {
			color: 'black',
			text: '서비스 이용 약관',
			className: baseClassName,
			icon: <ListBulletIcon className={iconClass} />,
			href: '/term',
		},
		privacy: {
			color: 'black',
			text: '개인정보 처리방침',
			className: baseClassName,
			icon: <IdentificationIcon className={iconClass} />,
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
