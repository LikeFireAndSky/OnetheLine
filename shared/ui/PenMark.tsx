import React from 'react';

/**
 * 펜 표시: 만년필 펜촉이 '한 줄'을 긋는 모양 (로고의 만년필과 맞춘 장식)
 * - 기본은 글자색(currentColor)을 따름
 * - 이미지 저장(html2canvas)처럼 currentColor를 읽지 못하는 곳에서는 color로 직접 지정
 */
const PenMark = ({
	className = 'h-6 w-6',
	color = 'currentColor',
}: {
	className?: string;
	color?: string;
}) => (
	<svg
		aria-hidden
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth={1.5}
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		{/* 펜촉 (왼쪽 아래를 향해 비스듬히, 펜촉 끝이 (8, 17.5)에 오도록 배치) */}
		<g transform="translate(0.7 1.8) rotate(45 13 10)">
			<path d="M13 18 L8.5 10.5 L10 4 H16 L17.5 10.5 Z" />
			<path d="M13 18 V12" />
			<circle
				cx="13"
				cy="10.6"
				r="1.1"
			/>
			<path d="M10 4 L10.5 2 H15.5 L16 4" />
		</g>
		{/* 펜이 방금 그은 한 줄 (펜촉 끝에서 끝남) */}
		<path d="M2 17.5 H8" />
	</svg>
);

export default PenMark;
