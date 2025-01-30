import {
	Dialog,
	DialogBody,
	DialogHeader,
	IconButton,
	Typography,
} from '@material-tailwind/react';
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
		>
			<DialogHeader className="w-full flex flex-col">
				<div className="w-full flex  justify-between items-center">
					<strong className="text-lg font-medium">책 선택하기</strong>
					<IconButton
						size="sm"
						variant="text"
						className="!absolute right-3.5 top-3.5"
						onClick={handleOpen}
					>
						<XMarkIcon className="h-4 w-4 stroke-2" />
					</IconButton>
				</div>
				<p className="mt-1 text-sm font-thin text-gray-600">
					검색 결과에 나오지 않는 경우 책의 이름을 더욱 자세하게 입력해주세요.
					(최대 10개까지 보여집니다.)
				</p>
			</DialogHeader>
			<DialogBody className="p-4 mb-6 w-full max-h-96 flex flex-col space-y-3 line-clamp-1 overflow-scroll">
				{isLoading && <Typography>검색중...</Typography>}
				{isError && <Typography>검색 중 에러가 발생했습니다.</Typography>}
				{!!searchResults && searchResults.items ? (
					searchResults.items.map((book: any) => (
						<div
							key={book.isbn}
							onClick={() => handleSelectBook(book)}
							className="block w-full cursor-pointer rounded-lg border border-gray-300 p-4 text-gray-900"
						>
							<div className="w-full block">
								<p className="font-semibold line-clamp-1 w-full">
									{book.title}
								</p>
								<p className="font-normal text-gray-600">
									{book.author?.length > 0 ? book.author : 'Unknown Author'}
								</p>
							</div>
						</div>
					))
				) : (
					<Typography className="text-gray-500">
						검색 결과가 없습니다.
					</Typography>
				)}
			</DialogBody>
		</Dialog>
	);
};

export const BookDialogs = memo(BookDialog);
