'use client';

import React, { useState } from 'react';
import {
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
} from '@material-tailwind/react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { ReadingLog } from '@/app/line/page';
import { useQuoteCard } from '../model/useCapture';
import PenMark from '@/shared/ui/PenMark';

type QuoteCardModalProps = Pick<
	ReadingLog,
	'BookTitle' | 'BookPublisher' | 'BookAuthor' | 'BookPublishedDate'
> & {
	bookSentence: string;
};

// 카드 배경 색 (한지와 먹 테마)
const backgroundColors = [
	{ label: '한지', value: '#F3EEE4' },
	{ label: '미색', value: '#FAF7F0' },
	{ label: '연먹', value: '#E4E0D8' },
	{ label: '옥빛', value: '#DCE5E3' },
	{ label: '연분홍', value: '#F3DEDA' },
];

const QuoteCardModal = ({
	bookSentence,
	BookAuthor,
	BookTitle,
	BookPublishedDate,
	BookPublisher,
}: QuoteCardModalProps) => {
	// 비즈니스 로직은 모델 훅에서 처리
	const {
		quoteRef,
		open,
		handleOpen,
		captureScreen,
		extractYear,
		removeParentheses,
		removeSpecialCharacters,
	} = useQuoteCard({ BookTitle });

	// UI 상태 (출판사 표시, 배경색)
	const [showPublisher, setShowPublisher] = useState(false);
	const [bgColor, setBgColor] = useState(backgroundColors[0].value);

	return (
		<>
			{/* 모달 열기 버튼 */}
			<button
				type="button"
				onClick={handleOpen}
				aria-label="구절 카드 이미지로 저장"
				className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-hanji-deep hover:text-ink"
			>
				<ArrowDownTrayIcon
					aria-hidden
					className="w-5 h-5"
				/>
			</button>

			{/* 모달 */}
			<Dialog
				open={open}
				handler={handleOpen}
				size="sm"
				className="rounded-sm bg-hanji-light"
			>
				<DialogHeader className="flex flex-col items-start gap-0.5 px-5 pb-2">
					<h2 className="font-serif text-[19px] font-bold text-ink">
						구절 카드 만들기
					</h2>
					<p className="font-sans text-[14px] font-normal text-ink-muted">
						배경을 고르고 이미지로 저장해 보세요.
					</p>
				</DialogHeader>
				<DialogBody className="flex flex-col items-center px-5 py-2">
					{/* 이미지로 저장되는 카드 (html2canvas가 읽는 영역) */}
					<div
						ref={quoteRef}
						className="relative flex w-full max-w-[420px] flex-col items-center justify-center text-center text-ink shadow-lg transition-colors duration-500"
						style={{
							aspectRatio: '4/5',
							backgroundColor: bgColor,
							padding: '10% 9%',
							borderRadius: '2px',
						}}
					>
						{/* 구절 텍스트 */}
						<p
							className="m-0 whitespace-pre-wrap font-serif"
							style={{
								fontSize: 'clamp(15px, 4.4vw, 20px)',
								lineHeight: 1.8,
								wordBreak: 'keep-all',
							}}
						>
							{bookSentence}
						</p>
						{/* 책 정보 */}
						<p
							className="text-ink-soft"
							style={{
								marginTop: '7%',
								fontSize: 'clamp(11px, 3vw, 13px)',
								lineHeight: 1.6,
							}}
						>
							<span className="font-serif font-bold">
								{removeParentheses(BookTitle)}
							</span>
							<br />
							{removeSpecialCharacters(BookAuthor) || '작가 미상'} ·{' '}
							{extractYear(BookPublishedDate) || '출판일 미상'}
							{showPublisher && BookPublisher ? ` · ${BookPublisher}` : ''}
						</p>
						{/* 서명: 로고 글자 + 펜 */}
						<div className="absolute bottom-[5%] left-0 right-0 flex items-center justify-center gap-2">
							<p className="m-0 font-serif text-[12px] text-ink-muted">
								OneTheLine
							</p>
							{/* 이미지 저장 시 currentColor를 읽지 못하므로 색을 직접 지정 */}
							<PenMark
								className="h-4 w-4"
								color="#5E574E"
							/>
						</div>
					</div>

					{/* 배경 색 선택 */}
					<fieldset className="mt-4 w-full max-w-[420px]">
						<legend className="eyebrow">배경 색</legend>
						<div className="mt-2 flex gap-3">
							{backgroundColors.map(color => {
								const selected = bgColor === color.value;
								return (
									<button
										key={color.value}
										type="button"
										aria-label={color.label}
										aria-pressed={selected}
										onClick={() => setBgColor(color.value)}
										className={`h-8 w-8 rounded-full border transition-shadow ${
											selected
												? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-hanji-light'
												: 'border-rule'
										}`}
										style={{ backgroundColor: color.value }}
									/>
								);
							})}
						</div>
					</fieldset>

					{/* SNS 공유용: 출판사 표시 */}
					<label className="mt-3 flex w-full max-w-[420px] cursor-pointer items-center gap-2 text-[14px] text-ink-soft">
						<input
							type="checkbox"
							className="h-4 w-4 accent-[#1F1D1A]"
							checked={showPublisher}
							onChange={e => setShowPublisher(e.target.checked)}
						/>
						출판사 표시 (SNS 공유용)
					</label>
				</DialogBody>
				<DialogFooter className="grid grid-cols-2 gap-2 px-5">
					<button
						type="button"
						onClick={handleOpen}
						className="btn-line h-11"
					>
						닫기
					</button>
					<button
						type="button"
						onClick={() => captureScreen(bgColor)}
						className="btn-ink h-11"
					>
						<ArrowDownTrayIcon
							aria-hidden
							className="w-5 h-5"
						/>
						이미지 저장
					</button>
				</DialogFooter>
			</Dialog>
		</>
	);
};

export default QuoteCardModal;
