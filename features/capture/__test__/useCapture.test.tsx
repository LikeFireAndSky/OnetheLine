// src/features/QuoteCard/model/useQuoteCard.test.ts
import { renderHook, act } from '@testing-library/react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { useQuoteCard } from '../model/useCapture';

// html2canvas와 file-saver 모킹
jest.mock('html2canvas', () => jest.fn());
jest.mock('file-saver', () => ({
	saveAs: jest.fn(),
}));

describe('useQuoteCard hook', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should initialize with open as false', () => {
		const { result } = renderHook(() =>
			useQuoteCard({ bookTitle: 'TestBook' }),
		);
		expect(result.current.open).toBe(false);
	});

	it('handleOpen should toggle the open state', () => {
		const { result } = renderHook(() =>
			useQuoteCard({ bookTitle: 'TestBook' }),
		);

		act(() => {
			result.current.handleOpen();
		});
		expect(result.current.open).toBe(true);

		act(() => {
			result.current.handleOpen();
		});
		expect(result.current.open).toBe(false);
	});

	it('captureScreen should call html2canvas and saveAs with proper filename when quoteRef is set', async () => {
		const { result } = renderHook(() =>
			useQuoteCard({ bookTitle: 'TestBook' }),
		);

		// dummy DOM 요소 생성 및 할당
		const dummyElement = document.createElement('div');
		dummyElement.innerHTML = 'dummy content';
		act(() => {
			result.current.quoteRef.current = dummyElement;
		});

		// 가짜 Blob 생성
		const fakeBlob = new Blob(['test'], { type: 'image/png' });

		// 가짜 캔버스 객체 생성 (toBlob 구현 포함)
		const fakeCanvas = {
			toBlob: (callback: (blob: Blob | null) => void) => {
				callback(fakeBlob);
			},
		};

		// html2canvas가 fakeCanvas를 반환하도록 모킹
		(html2canvas as jest.Mock).mockResolvedValue(fakeCanvas);

		await act(async () => {
			await result.current.captureScreen();
		});

		expect(html2canvas).toHaveBeenCalledWith(dummyElement, { useCORS: true });
		expect(saveAs).toHaveBeenCalledWith(fakeBlob, 'TestBook-screenshot.png');
	});

	it('captureScreen should not call html2canvas if quoteRef is null', async () => {
		const { result } = renderHook(() =>
			useQuoteCard({ bookTitle: 'TestBook' }),
		);

		await act(async () => {
			await result.current.captureScreen();
		});

		expect(html2canvas).not.toHaveBeenCalled();
	});
});
