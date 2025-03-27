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
import QuoteCardModal from '@/features/capture/ui/Capture';
import { ReadingLog } from '@/app/line/page';
import { removeParentheses } from '@/shared/lib/utils';

export type Contents = {
	SentenceID: string;
	Timestamp: string;
	Content: string;
};

type AccordionComponentProps = {
	bookIndex: number;
} & ReadingLog;

const AccordionComponent = ({
	bookIndex,
	BookId,
	BookPublishedDate,
	BookAuthor,
	BookTitle,
	Contents,
	Category,
	BookPublisher,
}: AccordionComponentProps) => {
	const { open, onClick, krTime, previewData, contentsLength } = useAccordion({
		bookIndex,
		Contents,
	});

	const bgUi = (category: string) => {
		switch (category) {
			case 'business-economics':
				return 'bg-gradient-business';
			case 'science-technology':
				return 'bg-gradient-science';
			case 'selfHelp-psychology':
				return 'bg-gradient-selfhelp';
			case 'society-environment':
				return 'bg-gradient-society';
			case 'literature-arts':
				return 'bg-gradient-literature';
			default:
				return 'bg-gradient';
		}
	};

	return (
		<Card className={`rounded-md py-6 ${bgUi(Category)}`}>
			<CardBody>
				<Accordion open={open === bookIndex}>
					<AccordionHeader className="flex flex-col w-full py-0 justify-start items-center gap-3 border-b-0">
						<div className="flex w-full flex-col space-y-1">
							<div className="w-full flex items-center justify-between">
								<div className="flex items-center">
									<p
										className={` w-3 h-3 rounded-full font-normal ${getCategoryColor(
											Category,
										)}`}
									/>
									<p className="text-sm font-light flex-shrink-0 ml-2">
										{getCategoryKor(Category)}
									</p>
								</div>
								<span className="text-xs text-gray-500">
									Lines: {contentsLength}
								</span>
							</div>
							<p
								className={`flex-shrink text-base font-normal ${
									open === bookIndex ? 'line-clamp-3' : 'line-clamp-1'
								}`}
							>
								{removeParentheses(BookTitle)}
							</p>
						</div>
						{open !== bookIndex && (
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
						{Contents &&
							Contents.map(content => (
								<div
									key={content.SentenceID}
									className="flex flex-col gap-2 py-3"
								>
									{open === bookIndex && (
										<div
											className={`w-full flex flex-col gap-1 ${
												open === bookIndex ? 'opacity-100' : 'opacity-0'
											} transition-opacity delay-300 duration-300 ease-in-out`}
										>
											<div className="text-sm text-black">
												{content.Content}
											</div>
											<div className="w-full flex items-center">
												<div className="w-full flex items-center">
													<CalendarIcon className="w-4 h-4 mr-1" />
													<p className="text-sm text-gray-500">
														{krTime(content.Timestamp)}
													</p>
												</div>
												<div className="flex items-center gap-3">
													<QuoteCardModal
														bookSentence={content.Content}
														BookTitle={BookTitle}
														BookAuthor={BookAuthor}
														BookPublishedDate={BookPublishedDate}
														BookPublisher={BookPublisher}
													/>
													<DeleteDialog
														BookId={BookId}
														sentenceId={content.SentenceID}
													>
														<XMarkIcon className="w-4 h-4" />
													</DeleteDialog>
												</div>
											</div>
										</div>
									)}
								</div>
							))}
					</AccordionBody>
					<div className="flex w-full justify-center items-center">
						{open === bookIndex ? (
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
