import {
	BanknotesIcon,
	BeakerIcon,
	BellAlertIcon,
	BookOpenIcon,
	CloudIcon,
} from '@heroicons/react/16/solid';

export const IconSelection = (category: string) => {
	switch (category) {
		case 'business-economics':
			return (
				<BanknotesIcon
					className="w-3 h-3 bg-yellow-700"
					color="black"
				/>
			);
		case 'science-technology':
			return (
				<BeakerIcon
					className="w-3 h-3 bg-indigo-400"
					color="white"
				/>
			);
		case 'selfHelp-psychology':
			return (
				<BellAlertIcon
					className="w-3 h-3 bg-black"
					color="white"
				/>
			);
		case 'society-environment':
			return (
				<CloudIcon
					className="w-3 h-3 bg-blue-300"
					color="white"
				/>
			);
		default:
			return (
				<BookOpenIcon
					className="w-3 h-3 bg-green-400"
					color="white"
				/>
			);
	}
};
