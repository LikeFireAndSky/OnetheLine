import React from 'react';

type SealSize = 'sm' | 'md' | 'lg';

const sizeClass: Record<SealSize, string> = {
	sm: 'w-7 h-7 text-[10px]',
	md: 'w-9 h-9 text-[12px]',
	lg: 'w-12 h-12 text-[15px]',
};

/**
 * 낙관(도장) 장식
 * - 붉은 인주 도장처럼 글자를 세로로 쌓은 정사각형 (장식용이므로 스크린리더에서는 숨김)
 * - 이미지 저장(html2canvas)에서도 같게 보이도록 writing-mode 대신 글자를 한 줄씩 쌓음
 */
const Seal = ({
	text = '한줄',
	size = 'md',
	className = '',
}: {
	text?: string;
	size?: SealSize;
	className?: string;
}) => (
	<span
		aria-hidden
		className={`inline-flex shrink-0 select-none flex-col items-center justify-center rounded-[3px] bg-seal font-serif font-bold leading-[1.05] text-hanji-light opacity-90 shadow-[inset_0_0_0_2px_rgba(250,247,240,0.35)] -rotate-3 ${sizeClass[size]} ${className}`}
	>
		{Array.from(text).map((char, index) => (
			<span key={`${char}-${index}`}>{char}</span>
		))}
	</span>
);

export default Seal;
