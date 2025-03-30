import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	Button,
	Card,
	CardBody,
} from '@material-tailwind/react';
import React from 'react';
import useAccordion from '../model/useAccordion';
import {
	CalendarIcon,
	ChevronDoubleDownIcon,
	ChevronDoubleUpIcon,
	PlusCircleIcon,
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

export type AccordionComponentProps = {
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
	const {
		open,
		onClick,
		krTime,
		previewData,
		contentsLength,
		ifOpenClose,
		handleClick,
	} = useAccordion({
		bookIndex,
		BookId,
		BookPublishedDate,
		BookAuthor,
		BookTitle,
		Contents,
		Category,
		BookPublisher,
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

	// businessBlue: '#4E5FBF',
	// scienceNavy: '#1D3159',
	// selfHelpGreen: '#8DA633',
	// societyGold: '#F2B544',
	// literatureOrange: '#D9763D',

	const buttonBorder = (category: string) => {
		switch (category) {
			case 'business-economics':
				return 'businessBlue';
			case 'science-technology':
				return 'scienceNavy';
			case 'selfHelp-psychology':
				return 'selfHelpGreen';
			case 'society-environment':
				return 'societyGold';
			case 'literature-arts':
				return 'literatureOrange';
			default:
				return 'gray-300';
		}
	};

	const iconColor = (category: string) => {
		switch (category) {
			case 'business-economics':
				return '#4E5FBF';
			case 'science-technology':
				return '#1D3159';
			case 'selfHelp-psychology':
				return '#8DA633';
			case 'society-environment':
				return '#F2B544';
			case 'literature-arts':
				return '#D9763D';
			default:
				return '#B8B8B8';
		}
	};

	return (
		<Card className={`rounded-md ${bgUi(Category)} py-6`}>
			<CardBody>
				<Accordion open={open === bookIndex}>
					<AccordionHeader className="flex flex-col w-full py-0 justify-start items-center gap-3 border-b-0">
						<div
							onClick={ifOpenClose}
							className={`flex w-full flex-col space-y-1 ${
								open === bookIndex &&
								'hover:text-gray-500 cursor-pointer transition-colors duration-200 ease-in-out'
							}`}
						>
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
											<p className=" font-light flex-shrink line-clamp-2 break-normal whitespace-normal">
												{contents.Content}
											</p>
										</div>
									))}
							</div>
						)}
					</AccordionHeader>
					<AccordionBody
						className={`flex flex-col divide-y divide-gray-300 py-0`}
					>
						{Contents &&
							Contents.map(content => (
								<div
									key={content.SentenceID}
									className="flex flex-col gap-2 py-7"
								>
									{open === bookIndex && (
										<div
											className={`w-full flex flex-col gap-1 transition-opacity delay-300 duration-300 ease-in-out ${
												open === bookIndex ? 'opacity-100' : 'opacity-0'
											}`}
										>
											<div className="text-sm text-black">
												{content.Content}
											</div>
											<div className="w-full flex items-center mt-2">
												<div className="w-full flex items-center">
													<CalendarIcon
														color="#808080FF"
														className="w-4 h-4 mr-1"
													/>
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

					<div className="flex w-full relative justify-center items-center pt-3">
						<Button
							onClick={handleClick}
							className={`w-fit absolute left-0 rounded-full text-center py-1 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 ease-in-out border border-${buttonBorder(
								Category,
							)}
						`}
						>
							<PlusCircleIcon
								color={iconColor(Category)}
								className={`w-4 h-4 text-${buttonBorder(Category)}`}
							/>
						</Button>
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
