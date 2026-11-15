'use client';

import React from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useMainLog } from '../model/useMainLog';
import QuoteCardModal from '@/features/capture/ui/Capture';
import Seal from '@/shared/ui/Seal';

// 불러오는 동안 보여줄 자리 표시
const MainLogSkeleton = () => (
	<div
		aria-hidden
		className="mt-5 space-y-3 animate-pulse"
	>
		<div className="h-4 w-11/12 rounded-sm bg-hanji-deep" />
		<div className="h-4 w-4/5 rounded-sm bg-hanji-deep" />
		<div className="h-4 w-2/3 rounded-sm bg-hanji-deep" />
		<div className="mt-6 h-3 w-1/3 rounded-sm bg-hanji-deep" />
	</div>
);

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
		<article
			aria-busy={isLoading}
			className="paper relative w-full px-5 pt-4 pb-5"
		>
			<header className="flex items-center justify-between border-b border-rule pb-3">
				<p className="eyebrow">오늘의 구절</p>
				{!isLoading && !isError && (
					<QuoteCardModal
						BookTitle={titleText}
						bookSentence={contentText}
						BookAuthor={authorText}
						BookPublishedDate={publishedDateText}
						BookPublisher={publisherText}
					/>
				)}
			</header>

			{isLoading ? (
				<MainLogSkeleton />
			) : isError ? (
				// 에러일 때는 모든 칸에 같은 문구를 반복하지 않고 안내 한 줄만 표시
				<p
					role="alert"
					className="mt-5 text-[15px] leading-relaxed text-ink-muted"
				>
					오늘의 구절을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
				</p>
			) : (
				<>
					<blockquote className="relative mt-6">
						<span
							aria-hidden
							className="pointer-events-none absolute -left-1 -top-6 font-serif text-[56px] leading-none text-seal/25"
						>
							“
						</span>
						<p className="relative whitespace-pre-line font-serif text-[19px] leading-[1.85] text-ink">
							{contentText}
						</p>
					</blockquote>

					<footer className="mt-6 flex items-end justify-between gap-4">
						<div className="min-w-0">
							<p className="font-serif text-[15px] font-bold text-ink line-clamp-1">
								{titleText}
							</p>
							<p className="mt-0.5 text-[13px] text-ink-muted line-clamp-1">
								{authorText} · {publisherText}
							</p>
							<p className="mt-2 flex items-center gap-1 text-[12px] text-ink-muted">
								<CalendarDaysIcon
									aria-hidden
									className="w-4 h-4"
								/>
								{timeText}
							</p>
						</div>
						<Seal />
					</footer>
				</>
			)}
		</article>
	);
};

export default MainLog;
