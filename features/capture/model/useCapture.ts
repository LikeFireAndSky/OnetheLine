'use client';

// src/features/QuoteCard/model/useQuoteCard.ts
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export const useQuoteCard = ({ bookTitle }: { bookTitle: string }) => {
	const quoteRef = useRef<HTMLDivElement | null>(null);
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(prev => !prev);

	// 현재 보이는 quoteRef 영역을 캡쳐해서 이미지로 저장하는 함수
	const captureScreen = async () => {
		if (!quoteRef.current) return;
		const canvas = await html2canvas(quoteRef.current, { useCORS: true });
		canvas.toBlob(blob => {
			if (blob) {
				saveAs(blob, `${bookTitle}-screenshot.png`);
			}
		});
	};

	return { quoteRef, open, handleOpen, captureScreen };
};
