import {
	BookOpenIcon,
	Cog6ToothIcon,
	HomeIcon,
	PencilSquareIcon,
} from '@heroicons/react/24/outline';

export const navItems = [
	{
		title: '홈',
		icon: <HomeIcon className="w-6 h-6" />,
		href: '/',
	},
	{
		title: '기록',
		icon: <PencilSquareIcon className="w-6 h-6" />,
		href: '/log',
	},
	{
		title: '서재',
		icon: <BookOpenIcon className="w-6 h-6" />,
		href: '/line',
	},
	{
		title: '설정',
		icon: <Cog6ToothIcon className="w-6 h-6" />,
		href: '/setting',
	},
];
