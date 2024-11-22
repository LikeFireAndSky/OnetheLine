import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	IconButton,
} from '@material-tailwind/react';
import React from 'react';
import { MUI_PROPERTIES } from '../ReadingLog/Log';
import {
	BanknotesIcon,
	BeakerIcon,
	BellAlertIcon,
	BookOpenIcon,
	CloudIcon,
} from '@heroicons/react/16/solid';

const IconSelection = (category: string) => {
	switch (category) {
		case 'business-economics':
			return <BanknotesIcon className="w-6 h-6" />;
		case 'science-technology':
			return <BeakerIcon className="w-6 h-6" />;
		case 'selfHelp-psychology':
			return <BellAlertIcon className="w-6 h-6" />;
		case 'society-environment':
			return <CloudIcon className="w-6 h-6" />;
		default:
			return <BookOpenIcon className="w-6 h-6" />;
	}
};

const IconColor = (category: string) => {
	switch (category) {
		case 'business-economics':
			return 'yellow';
		case 'science-technology':
			return 'blue';
		case 'selfHelp-psychology':
			return 'black';
		case 'society-environment':
			return 'green';
		default:
			return 'indigo';
	}
};

const AccordionComponent = ({
	index,
	title,
	category,
	contents,
}: {
	index: number;
	title: string;
	category: string;
	contents: string;
}) => {
	const [open, setOpen] = React.useState(-1);

	const handleOpen = (value: number) => setOpen(open === value ? -1 : value);
	return (
		<Accordion
			{...MUI_PROPERTIES}
			key={index}
			open={open === index}
		>
			<AccordionHeader
				{...MUI_PROPERTIES}
				onClick={() => handleOpen(index)}
				className="flex w-full items-center justify-start gap-3"
			>
				<div className="flex">
					<IconButton
						{...MUI_PROPERTIES}
						className="rounded-full"
						color={IconColor(category)}
					>
						{IconSelection(category)}
					</IconButton>
				</div>
				<div className=" w-full line-clamp-1">{title}</div>
			</AccordionHeader>
			<AccordionBody>{contents}</AccordionBody>
		</Accordion>
	);
};

export default AccordionComponent;
