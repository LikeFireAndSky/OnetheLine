import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { memo } from 'react';

const BookDialog = ({
	open,
	handleOpen,
	handleSelectBook,
	isLoading,
	isError,
	searchResults,
}: {
	open: boolean;
	isLoading: boolean;
	isError: boolean;
	handleOpen: () => void;
	handleSelectBook: (book: any) => void;
	searchResults: any;
}) => {
	return (
		<Dialog
			size="md"
			open={open}
			handler={handleOpen}
			className="rounded-sm bg-hanji-light"
		>
			<DialogHeader className="relative flex w-full flex-col items-start gap-1 pr-14">
				<h2 className="font-serif text-[19px] font-bold text-ink">
					책 선택하기
				</h2>
				<p className="font-sans text-[14px] font-normal leading-relaxed text-ink-muted">
					검색 결과에 나오지 않는 경우 책의 이름을 더욱 자세하게 입력해주세요.
					(최대 10개까지 보여집니다.)
				</p>
				<button
					type="button"
					aria-label="닫기"
					className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-hanji-deep hover:text-ink"
					onClick={handleOpen}
				>
					<XMarkIcon
						aria-hidden
						className="h-5 w-5"
					/>
				</button>
			</DialogHeader>
			<DialogBody className="mb-4 flex max-h-96 w-full flex-col gap-2 overflow-y-auto px-4 pt-0">
				{isLoading && (
					<p
						role="status"
						className="py-4 text-[15px] text-ink-muted"
					>
						검색 중...
					</p>
				)}
				{isError && (
					<p
						role="alert"
						className="py-4 text-[15px] text-seal"
					>
						검색 중 에러가 발생했습니다.
					</p>
				)}
				{!!searchResults && searchResults.items?.length > 0
					? searchResults.items.map((book: any) => (
							<button
								type="button"
								key={book.isbn}
								onClick={() => handleSelectBook(book)}
								className="w-full rounded-sm border border-rule bg-hanji-light px-4 py-3 text-left transition-colors hover:border-ink hover:bg-hanji"
							>
								<p className="font-serif text-[16px] font-bold leading-snug text-ink line-clamp-2">
									{book.title}
								</p>
								<p className="mt-0.5 text-[13px] text-ink-muted line-clamp-1">
									{book.author?.length > 0 ? book.author : '작가 미상'}
									{book.publisher ? ` · ${book.publisher}` : ''}
								</p>
							</button>
						))
					: !isLoading &&
						!isError && (
							<p className="py-4 text-[15px] text-ink-muted">
								검색 결과가 없습니다.
							</p>
						)}
			</DialogBody>
		</Dialog>
	);
};

export const BookDialogs = memo(BookDialog);
