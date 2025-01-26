import useDeleteLog from '@/entities/archive/api/useDeleteLog';
import React from 'react';

export const useDeleteAlert = (sentenceId: string, bookIsbn: string) => {
	const [open, setOpen] = React.useState(false);
	const mutation = useDeleteLog();

	const handleOpen = () => setOpen(!open);

	const handleDelete = () => {
		mutation.mutate({ bookIsbn, sentenceId });
		handleOpen();
	};

	return { open, handleOpen, handleDelete };
};
