'use client';

import React from 'react';
import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
	Typography,
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
	const { open, handleOpen, handleDelete } = useDeleteAlert(
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
				className=" max-w-11/12"
				handler={handleOpen}
			>
				<DialogHeader>
					<p className="text-base font-normal">
						Would you like to delete the sentence?
					</p>
				</DialogHeader>
				<DialogBody
					divider
					className="grid place-items-center gap-4"
				>
					<p className="font-thin text-xs">
						Once deleted, the sentence cannot be recovered, and if it is the
						last sentence of the book, the book will be deleted as well.
					</p>
				</DialogBody>
				<DialogFooter className="space-x-2">
					<Button
						variant="text"
						color="blue-gray"
						className="border border-blue-gray-300"
						onClick={handleOpen}
					>
						Cancle
					</Button>
					<Button
						variant="gradient"
						onClick={handleDelete}
					>
						Delete
					</Button>
				</DialogFooter>
			</Dialog>
		</>
	);
};

export default DeleteDialog;
