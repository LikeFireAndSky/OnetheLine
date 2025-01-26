import {
	Cog6ToothIcon,
	HomeIcon,
	InboxStackIcon,
	PlusIcon,
	QueueListIcon,
} from '@heroicons/react/16/solid';

export const navItems = [
	{
		title: 'HOME',
		icon: <HomeIcon className="w-6 h-6" />,
		href: '/',
	},
	{
		title: 'CREATE',
		icon: <PlusIcon className="w-6 h-6" />,
		href: '/log',
	},
	{
		title: 'ARCHIVE',
		icon: <QueueListIcon className="w-6 h-6" />,
		href: '/line',
	},
	{
		title: 'SETTING',
		icon: <Cog6ToothIcon className="w-6 h-6" />,
		href: '/setting',
	},
];
