'use client';

import React from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { CalendarDateRangeIcon } from '@heroicons/react/16/solid';
import { useMainLog } from '../model/useMainLog';
import QuoteCardModal from '@/features/capture/ui/Capture';

const MainLog = ({
	data,
	isLoading,
	isError,
}: {
	data: any;
	isLoading: boolean;
	isError: boolean;
}) => {
	const {
		contentText,
		timeText,
		authorText,
		publisherText,
		titleText,
		publishedDateText,
	} = useMainLog({
		data,
		isLoading,
		isError,
	});

	return (
		<Card className="w-full rounded-md">
			<CardBody className="w-full flex flex-col space-y-3">
				<div className="w-full flex justify-between items-center">
					<Typography color="gray">오늘의 구절</Typography>
					<QuoteCardModal
						bookTitle={titleText}
						bookSentence={contentText}
						bookAuthor={authorText}
						bookPublishedDate={publishedDateText}
					/>
				</div>
				<div className="w-full text-sm flex flex-col gap-3">
					<div className="w-full flex flex-col">
						<p className="w-full font-medium text-black line-clamp-1">
							{titleText}
						</p>
						<div className="w-full flex justify-between">
							<div className="flex gap-1 text-xs">
								<p className="flex flex-shrink line-clamp-1">
									작가: {authorText} /
								</p>
								<p className="flex grow line-clamp-1">
									출판사: {publisherText}
								</p>
							</div>
						</div>
					</div>
					<Typography
						color="black"
						className="text-base font-medium"
					>
						&quot;{contentText}&quot;
					</Typography>
					<div className="w-full flex justify-end text-xs items-center space-x-1">
						<CalendarDateRangeIcon className="w-4 h-4" />
						<p>{timeText}</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default MainLog;
