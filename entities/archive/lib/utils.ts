export const IconColor = (category: string) => {
	switch (category) {
		case 'business-economics':
			return 'yellow-700';
		case 'science-technology':
			return 'indigo-400';
		case 'selfHelp-psychology':
			return 'black';
		case 'society-environment':
			return 'blue-300';
		default:
			return 'green-400';
	}
};
