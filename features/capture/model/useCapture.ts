'use client';

// src/features/QuoteCard/model/useQuoteCard.ts
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export const useQuoteCard = ({ BookTitle }: { BookTitle: string }) => {
	const quoteRef = useRef<HTMLDivElement | null>(null);
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(prev => !prev);

	// 현재 보이는 quoteRef 영역을 캡쳐해서 이미지로 저장하는 함수
	const captureScreen = async () => {
		if (!quoteRef.current) return;
		const canvas = await html2canvas(quoteRef.current, { useCORS: true });
		canvas.toBlob(blob => {
			if (blob) {
				saveAs(blob, `${BookTitle}-screenshot.png`);
			}
		});
	};

	// 날짜데이터에서 년도만 추출하는 함수(앞 4자리)
	const extractYear = (date: string) => date.slice(0, 4);

	// 책 이름 ()제거 함수
	const removeParentheses = (str: string) => {
		let result = '';
		let depth = 0;

		for (let char of str) {
			if (char === '(') {
				depth++; // 괄호 열리면 depth 증가
			} else if (char === ')') {
				if (depth > 0) depth--; // 괄호 닫히면 depth 감소
			} else if (depth === 0) {
				result += char; // 괄호 밖일 때만 추가
			}
		}

		return result;
	};

	// 작가 이름에서 특수문자 제거 함수
	const removeSpecialCharacters = (str: string) =>
		str.replace(/[^a-zA-Z0-9가-힣]/g, ' ');

	return {
		quoteRef,
		open,
		handleOpen,
		captureScreen,
		extractYear,
		removeParentheses,
		removeSpecialCharacters,
	};
};
