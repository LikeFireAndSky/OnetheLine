import React from 'react';
import {
	ListBulletIcon,
	PlusIcon,
	IdentificationIcon,
} from '@heroicons/react/16/solid';

export type LinkButtonTypes = 'record' | 'view' | 'term' | 'privacy';

const useLinkButton = (types: LinkButtonTypes) => {
	const buttonConfig = {
		record: {
			color: 'black',
			text: '기록하기',
			className: 'w-full flex items-center justify-center gap-1 rounded-sm',
			icon: <PlusIcon className="w-5 h-5" />,
			href: '/log',
		},
		view: {
			color: 'white',
			text: '기록보기',
			className:
				'w-full flex items-center justify-center gap-1 rounded-sm border border-black',
			icon: <ListBulletIcon className="w-5 h-5" />,
			href: '/line',
		},
		term: {
			color: 'black',
			text: '서비스 이용 약관',
			className: 'w-full flex items-center justify-center gap-1 rounded-sm',
			icon: <ListBulletIcon className="w-5 h-5" />,
			href: '/term',
		},
		privacy: {
			color: 'black',
			text: '개인정보 처리방침',
			className: 'w-full flex items-center justify-center gap-1 rounded-sm',
			icon: <IdentificationIcon className="w-5 h-5" />,
			href: '/privacy',
		},
	};

	const buttonType = buttonConfig[types];

	return buttonType;
};

export default useLinkButton;
