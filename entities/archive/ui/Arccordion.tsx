import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	Card,
	CardBody,
} from '@material-tailwind/react';
import React from 'react';
import useAccordion from '../model/useAccordion';
import {
	CalendarIcon,
	ChevronDoubleDownIcon,
	ChevronDoubleUpIcon,
	XMarkIcon,
} from '@heroicons/react/16/solid';
import DeleteDialog from './DeleteAlert';
import {
	getCategoryColor,
	getCategoryKor,
} from '@/features/create/config/bookEnrollmentConfig';

const AccordionComponent = ({
	index,
	bookIsbn,
	title,
	category,
	contents,
}: {
	index: number;
	bookIsbn: string;
	title: string;
	category: string;
	contents: { SentenceID: string; Timestamp: string; Content: string }[];
}) => {
	const { open, onClick, krTime, previewData, contentsLength } = useAccordion({
		index,
		contents,
	});

	return (
		<Card className="rounded-sm">
			<CardBody>
				<Accordion open={open === index}>
					<AccordionHeader className="flex flex-col w-full py-0 justify-start items-center gap-3 border-b-0">
						<div className="flex w-full flex-col space-y-1">
							<div className="w-full flex items-center justify-between">
								<div className="flex items-center">
									<p
										className={` w-3 h-3 rounded-full font-normal ${getCategoryColor(
											category,
										)}`}
									/>
									<p className="text-sm font-light flex-shrink-0 ml-2">
										{getCategoryKor(category)}
									</p>
								</div>
								<p className="text-sm font-light flex-shrink-0 ml-2">
									lines : {contentsLength}
								</p>
							</div>
							<p
								className={`flex-shrink text-base font-normal ${
									open === index ? 'line-clamp-3' : 'line-clamp-1'
								}`}
							>
								{title}
							</p>
						</div>
						{open !== index && (
							<div className="w-full flex flex-col gap-3">
								{previewData &&
									previewData.map(contents => (
										<div
											key={contents.SentenceID}
											className="text-sm flex line-clamp-1 w-full"
										>
											<p>{`"`}</p>
											<p className="font-thin flex-shrink line-clamp-1">
												{contents.Content}
											</p>
											<p>{`"`}</p>
										</div>
									))}
							</div>
						)}
					</AccordionHeader>
					<AccordionBody className="flex flex-col gap-3">
						{contents.map(content => (
							<div
								key={content.SentenceID}
								className="flex flex-col gap-2 py-3"
							>
								<div className="text-sm text-black">{content.Content}</div>
								<div className="w-full flex items-center">
									<div className="w-full flex items-center">
										<CalendarIcon className="w-4 h-4 mr-1" />
										<p className="text-sm text-gray-500">
											{krTime(content.Timestamp)}
										</p>
									</div>
									<DeleteDialog
										bookIsbn={bookIsbn}
										sentenceId={content.SentenceID}
									>
										<XMarkIcon className="w-4 h-4" />
									</DeleteDialog>
								</div>
							</div>
						))}
					</AccordionBody>
					<div className="flex w-full justify-center items-center">
						{open === index ? (
							<ChevronDoubleUpIcon
								onClick={onClick}
								className="w-6 mx-auto cursor-pointer"
							/>
						) : (
							<ChevronDoubleDownIcon
								onClick={onClick}
								className="w-6 mx-auto cursor-pointer"
							/>
						)}
					</div>
				</Accordion>
			</CardBody>
		</Card>
	);
};

export default AccordionComponent;
