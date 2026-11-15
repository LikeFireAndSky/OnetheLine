'use client';

import React from 'react';
import {
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
} from '@material-tailwind/react';
import { useDeleteAlert } from '../model/useDeleteAlert';

const DeleteDialog = ({
	sentenceId,
	BookId,
	children,
}: {
	sentenceId: string;
	BookId: string;
	children: React.ReactNode;
}) => {
	const { open, handleOpen, handleDelete, deleting } = useDeleteAlert(
		sentenceId,
		BookId,
	);

	return (
		<>
			<button
				type="button"
				onClick={handleOpen}
				aria-label="문장 삭제"
				className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-seal-wash hover:text-seal"
			>
				{children}
			</button>
			<Dialog
				open={open}
				size="sm"
				className="max-w-11/12 rounded-sm bg-hanji-light"
				handler={handleOpen}
			>
				<DialogHeader className="font-serif text-[18px] font-bold text-ink">
					정말로 삭제하시겠습니까?
				</DialogHeader>
				<DialogBody className="pt-0 text-[15px] text-ink-soft">
					한번 삭제한 문장은 다시 복구할 수 없습니다.
				</DialogBody>
				<DialogFooter className="grid grid-cols-2 gap-2">
					<button
						type="button"
						className="btn-line h-11"
						onClick={handleOpen}
					>
						취소
					</button>
					<button
						type="button"
						className="btn-ink h-11 bg-seal hover:bg-seal-deep"
						onClick={handleDelete}
						disabled={deleting}
					>
						{deleting ? '삭제 중...' : '삭제하기'}
					</button>
				</DialogFooter>
			</Dialog>
		</>
	);
};

export default DeleteDialog;
