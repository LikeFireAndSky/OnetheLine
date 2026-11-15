import React from 'react';

/**
 * 통계 차트를 감싸는 종이 카드 (제목 + 설명 + 차트 영역)
 */
export const ChartCard = ({
	title,
	subtitle,
	height = 280,
	children,
}: {
	title: string;
	subtitle: string;
	height?: number;
	children: React.ReactNode;
}) => (
	<section className="paper w-full px-4 pt-4 pb-3">
		<h2 className="card-title">{title}</h2>
		<p className="mt-0.5 text-[13px] text-ink-muted">{subtitle}</p>
		<div
			className="mt-3"
			style={{ height }}
		>
			{children}
		</div>
	</section>
);

/**
 * 차트 대신 보여줄 안내 (로딩/에러/빈 데이터)
 */
export const ChartMessage = ({
	title,
	message,
}: {
	title: string;
	message: string;
}) => (
	<section className="paper w-full px-4 py-5">
		<h2 className="card-title">{title}</h2>
		<p className="mt-2 text-[14px] text-ink-muted">{message}</p>
	</section>
);
