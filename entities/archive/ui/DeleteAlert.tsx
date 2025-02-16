'use client';

import React from 'react';
import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
} from '@material-tailwind/react';
import { useDeleteAlert } from '../model/useDeleteAlert';

const DeleteDialog = ({
	sentenceId,
	bookIsbn,
	children,
}: {
	sentenceId: string;
	bookIsbn: string;
	children: React.ReactNode;
}) => {
	const { open, handleOpen, handleDelete, deleting } = useDeleteAlert(
		sentenceId,
		bookIsbn,
	);

	return (
		<>
			<button
				onClick={handleOpen}
				className='className="text-sm text-gray-500"'
			>
				{children}
			</button>
			<Dialog
				open={open}
				size="sm"
				className="max-w-11/12"
				handler={handleOpen}
			>
				<DialogHeader>
					<p className="text-base font-normal">정말로 삭제하시겠습니까?</p>
				</DialogHeader>
				<DialogBody
					divider
					className="grid place-items-center gap-4"
				>
					<p className="font-thin text-xs">
						한번 삭제한 문장은 다시 복구할 수 없습니다.
					</p>
				</DialogBody>
				<DialogFooter className="space-x-2">
					<Button
						variant="text"
						color="blue-gray"
						className="border border-blue-gray-300"
						onClick={handleOpen}
					>
						취소
					</Button>
					<Button
						variant="gradient"
						onClick={handleDelete}
						disabled={deleting}
					>
						삭제하기
					</Button>
				</DialogFooter>
			</Dialog>
		</>
	);
};

export default DeleteDialog;
