import React, { createContext, useContext, useState } from 'react';

export type BookData = {
	BookId: string;
	BookPublishedDate: string;
	BookAuthor: string;
	BookTitle: string;
	Contents: any[]; // 필요에 따라 타입을 구체화하세요.
	Category: string;
	BookPublisher?: string;
};

type BookDataContextType = {
	bookData: BookData;
	setBookData: (data: BookData) => void;
};

const BookDataContext = createContext<BookDataContextType | undefined>(
	undefined,
);

export const BookDataProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [bookData, setBookData] = useState<BookData>({
		BookId: '',
		BookPublishedDate: '',
		BookAuthor: '',
		BookTitle: '',
		Contents: [],
		Category: '',
		BookPublisher: '',
	});

	return (
		<BookDataContext.Provider value={{ bookData, setBookData }}>
			{children}
		</BookDataContext.Provider>
	);
};

export const useBookData = () => {
	const context = useContext(BookDataContext);
	if (!context) {
		throw new Error('useBookData must be used within a BookDataProvider');
	}
	return context;
};
