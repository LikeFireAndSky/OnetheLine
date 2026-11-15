import {
	Accordion,
	AccordionBody,
	AccordionHeader,
} from '@material-tailwind/react';
import React from 'react';
import useAccordion from '../model/useAccordion';
import {
	CalendarDaysIcon,
	ChevronDownIcon,
	PlusIcon,
	TrashIcon,
} from '@heroicons/react/24/outline';
import DeleteDialog from './DeleteAlert';
import {
	getCategoryColor,
	getCategoryHex,
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
	const { open, onClick, krTime, previewData, contentsLength, handleClick } =
		useAccordion({
			bookIndex,
			BookId,
			BookPublishedDate,
			BookAuthor,
			BookTitle,
			Contents,
			Category,
			BookPublisher,
		});

	const isOpen = open === bookIndex;

	// overflow-hidden 요소는 세로 flex 안에서 줄어들 수 있으므로 shrink-0으로 고정
	return (
		<article className="paper relative w-full shrink-0 overflow-hidden">
			{/* 카테고리 색 책등 */}
			<span
				aria-hidden
				className="absolute inset-y-0 left-0 w-1"
				style={{ backgroundColor: getCategoryHex(Category) }}
			/>
			<Accordion
				open={isOpen}
				className="pl-6 pr-5 pt-5 pb-3"
				// 기본 아이콘(크기 없는 SVG) 대신 펼침 표시를 지정
				icon={
					<ChevronDownIcon
						aria-hidden
						className={`h-5 w-5 text-ink-muted transition-transform duration-300 ${
							isOpen ? 'rotate-180' : ''
						}`}
					/>
				}
			>
				<AccordionHeader
					onClick={onClick}
					aria-expanded={isOpen}
					className="w-full border-b-0 p-0 text-left font-sans text-base font-normal text-ink hover:text-ink"
				>
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<div className="flex w-full items-center justify-between">
							<span className="flex items-center gap-2 text-[13px] font-medium text-ink-muted">
								<span
									aria-hidden
									className={`h-2.5 w-2.5 rounded-full ${getCategoryColor(Category)}`}
								/>
								{getCategoryKor(Category)}
							</span>
							<span className="text-[13px] text-ink-muted">
								{contentsLength}줄
							</span>
						</div>
						<p
							className={`font-serif text-[17px] font-bold leading-snug text-ink ${
								isOpen ? '' : 'line-clamp-2'
							}`}
						>
							{removeParentheses(BookTitle)}
						</p>
						{!isOpen &&
							previewData.map(contents => (
								<p
									key={contents.SentenceID}
									className="border-l-2 border-rule pl-3 font-serif text-[15px] leading-[1.75] text-ink-soft line-clamp-2"
								>
									{contents.Content}
								</p>
							))}
					</div>
				</AccordionHeader>
				<AccordionBody className="py-0 font-sans text-base text-ink">
					<ul className="mt-3 divide-y divide-rule border-t border-rule">
						{Contents &&
							Contents.map(content => (
								<li
									key={content.SentenceID}
									className="py-5"
								>
									<p className="whitespace-pre-line font-serif text-[16px] leading-[1.8] text-ink">
										{content.Content}
									</p>
									<div className="mt-3 flex items-center justify-between">
										<p className="flex items-center gap-1 text-[13px] text-ink-muted">
											<CalendarDaysIcon
												aria-hidden
												className="w-4 h-4"
											/>
											{krTime(content.Timestamp)}
										</p>
										<div className="flex items-center gap-1">
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
												<TrashIcon
													aria-hidden
													className="w-5 h-5"
												/>
											</DeleteDialog>
										</div>
									</div>
								</li>
							))}
					</ul>
				</AccordionBody>

				<div className="mt-3 flex items-center">
					<button
						type="button"
						onClick={handleClick}
						className="inline-flex h-9 items-center gap-1 rounded-sm border border-rule px-3 text-[13px] font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
					>
						<PlusIcon
							aria-hidden
							className="w-4 h-4"
						/>
						문장 추가
					</button>
				</div>
			</Accordion>
		</article>
	);
};

export default AccordionComponent;
