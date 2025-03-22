// src/features/QuoteCard/ui/QuoteCardModal.tsx
import React, { useState } from 'react';
import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
	Checkbox,
	Radio,
	Card,
	List,
	ListItem,
	ListItemPrefix,
	CardHeader,
} from '@material-tailwind/react';
import { useQuoteCard } from '../model/useCapture';
import { InboxArrowDownIcon } from '@heroicons/react/16/solid';
import { ReadingLog } from '@/app/line/page';

/**
 * QuoteCardModal 컴포넌트
 *
 * 이 모달은 책의 구절과 관련 정보를 표시하며,
 * 사용자가 구절을 이미지로 다운로드할 수 있는 기능을 제공합니다.
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.bookSentence - 표시할 책의 구절(문장)
 * @param {string} props.BookPublishedDate - 책이 출판된 날짜 (문자열 형식)
 * @param {string} props.BookAuthor - 책의 저자 이름
 * @param {string} props.BookTitle - 책의 제목
 * @param {string} [props.BookPublisher] - 책의 출판사 (선택 사항)
 *
 * @returns {JSX.Element} 구절 모달 다이얼로그 컴포넌트
 */

type QuoteCardModalProps = Pick<
	ReadingLog,
	'BookTitle' | 'BookPublisher' | 'BookAuthor' | 'BookPublishedDate'
> & {
	bookSentence: string;
};

const QuoteCardModal = ({
	bookSentence,
	BookAuthor,
	BookTitle,
	BookPublishedDate,
	BookPublisher,
}: QuoteCardModalProps) => {
	const {
		quoteRef,
		open,
		handleOpen,
		captureScreen,
		extractYear,
		removeParentheses,
		removeSpecialCharacters,
	} = useQuoteCard({
		BookTitle,
	});
	// SNS 공유용 체크박스 상태: true이면 출판사 정보 표시
	const [showPublisher, setShowPublisher] = useState(false);
	// 배경 색상 상태 (기본값: 크림톤)
	const [bgColor, setBgColor] = useState('#fdf6e3');

	// 미리 정의한 배경 색상 옵션
	const backgroundColors = [
		{ label: 'yellow', value: '#fdf6e3' },
		{ label: 'gray', value: '#E9E9E9' },
		{ label: 'green', value: '#C6DFD6' },
		{ label: 'pink', value: '#FFECECFF' },
		{ label: 'white', value: '#FFFFFF' },
	];

	return (
		<>
			{/* 모달 열기 버튼 */}
			<button
				onClick={handleOpen}
				className="w-fit"
			>
				<InboxArrowDownIcon className="w-5 h-5" />
			</button>

			{/* 모달 */}
			<Dialog
				open={open}
				handler={handleOpen}
				size="sm"
			>
				<DialogHeader className="text-lg px-5 flex flex-col items-start">
					<h1>오늘의 구절</h1>
					<p className="font-light text-sm">오늘의 구절을 확인해보세요.</p>
					{/* 배경 색상 라디오 버튼 그룹 */}
					<div className="mt-2">
						<Card className="w-full shadow-md p-0">
							<p className="text-xs text-gray-600 mt-3 pl-3">배경 색상 선택</p>
							<List className="flex-row min-w-0 p-2 gap-3">
								{backgroundColors.map(color => (
									<ListItem
										key={color.label}
										className="p-0 w-fit min-w-0"
									>
										<label
											htmlFor="horizontal-list-react"
											className="flex cursor-pointer items-center"
										>
											<ListItemPrefix className="w-fit mr-0">
												<Radio
													crossOrigin="anonymous"
													type="radio"
													name="bgColor"
													color={color.label as any}
													containerProps={{ className: 'p-1' }}
													value={color.value}
													checked={bgColor === color.value}
													onChange={e => setBgColor(e.target.value)}
												/>
											</ListItemPrefix>
										</label>
									</ListItem>
								))}
							</List>
						</Card>
					</div>
				</DialogHeader>
				<DialogBody className="flex flex-col items-center my-[-1rem]">
					<div
						className="shadow-xl"
						ref={quoteRef}
						style={{
							width: '100%',
							maxWidth: '500px',
							aspectRatio: '4/5', // 화면에서는 4:5 비율 유지
							backgroundColor: bgColor,
							padding: '7%',
							position: 'relative',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							fontFamily: "'Gothic A1', 'Noto Sans KR', sans-serif",
							borderRadius: '0.75rem',
							fontWeight: 400,
						}}
					>
						{/* 구절 */}
						<p
							style={{
								fontSize: '1.8vh', // 화면 기준, 필요 시 clamp()나 다른 단위로 조정 가능
								lineHeight: 1.4,
								whiteSpace: 'pre-wrap',
								margin: 0,
								color: '#000',
								padding: '1%',
								wordBreak: 'keep-all',
							}}
						>
							{bookSentence}
						</p>
						{/* 책 정보 */}
						<p
							style={{
								marginTop: '5%',
								fontSize: '1.27vh',
								color: '#000',
								fontWeight: 600,
							}}
						>
							{removeParentheses(BookTitle)}
							<br />({removeSpecialCharacters(BookAuthor) || '작가 미상'} |{' '}
							{extractYear(BookPublishedDate) || '출판일 미상'}
							{showPublisher && BookPublisher ? `, ${BookPublisher}` : ''})
						</p>
						{/* 로고 – 원래 크기를 유지하며 왼쪽 5%, 아래쪽 5% 위치 */}
						<div
							style={{
								position: 'absolute',
								bottom: '5%',
								left: '50%',
								transform: 'translateX(-50%)',
							}}
						>
							<p style={{ fontSize: '1.5vh', margin: 0, color: '#333' }}>
								OneTheLine
							</p>
						</div>
					</div>
				</DialogBody>
				<DialogFooter className="flex justify-end gap-3 px-[7%]">
					{/* SNS 공유용 체크박스 */}
					<div className="flex items-center gap-2">
						<Checkbox
							crossOrigin="anonymous"
							type="checkbox"
							id="showPublisher"
							size={16}
							className="text-primary-500 checked:bg-gray-500 border-gray-500 checked:border-gray-500"
							containerProps={{ className: 'p-1' }}
							checked={showPublisher}
							onChange={e => setShowPublisher(e.target.checked)}
						/>
						<label
							htmlFor="showPublisher"
							className="text-xs text-gray-600"
						>
							출판사 표시(SNS 공유용)
						</label>
					</div>
					<div className="w-full flex justify-end gap-2 ">
						<Button
							variant="text"
							onClick={handleOpen}
							className="w-fit flex items-center justify-center gap-1 rounded-sm border border-black"
						>
							닫기
						</Button>
						<Button
							onClick={() => captureScreen(bgColor)}
							className="w-fit flex items-center justify-center gap-1 rounded-sm"
						>
							이미지 다운로드
						</Button>
					</div>
				</DialogFooter>
			</Dialog>
		</>
	);
};

export default QuoteCardModal;
