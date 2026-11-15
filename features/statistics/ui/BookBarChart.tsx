'use client';

import { useSession } from 'next-auth/react';
import { useReducedMotion } from '@react-spring/web';
import {
	Bar,
	BarChart,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Cell,
	LabelList,
} from 'recharts';
import { useTopBooks } from '../api/useCategorySummary';
import { CHART_COLORS, CHART_TICK, RANK_COLORS } from '../config/chartTheme';
import { ChartCard, ChartMessage } from './ChartCard';

const TITLE = '책별 문장 수 Top 5';

const MOCK_DATA = [
	{ bookTitle: '데미안', count: 7 },
	{ bookTitle: '어린 왕자', count: 5 },
	{ bookTitle: '미움받을 용기', count: 4 },
	{ bookTitle: '죽음에 관하여', count: 3 },
	{ bookTitle: '총 균 쇠', count: 2 },
];

// 세로축 책 제목은 9자까지만 표시 (긴 제목이 막대를 가리지 않도록)
const MAX_TITLE_LENGTH = 9;

export default function BookBarChart() {
	const { status } = useSession();
	const reduceMotion = !!useReducedMotion();
	const isLoggedIn = status === 'authenticated';

	const { data, isLoading } = useTopBooks();

	// 세션 확인 중이거나 로그인 사용자의 데이터를 불러오는 중이면 샘플 데이터 대신 로딩 표시
	if (status === 'loading' || (isLoggedIn && isLoading)) {
		return (
			<ChartMessage
				title={TITLE}
				message="데이터를 불러오는 중입니다..."
			/>
		);
	}

	// 괄호 제거 처리
	const processedData = data?.map(item => {
		const bookTitle = item.bookTitle.replace(/\(.*?\)/g, '').trim();
		return { ...item, bookTitle };
	});

	const barData = isLoggedIn ? processedData || [] : MOCK_DATA;

	if (barData.length === 0) {
		return (
			<ChartMessage
				title={TITLE}
				message="아직 기록한 책이 없어요."
			/>
		);
	}

	return (
		<ChartCard
			title={TITLE}
			subtitle={
				isLoggedIn ? '가장 많은 문장을 남긴 책들' : '샘플 데이터 (로그인 필요)'
			}
			height={250}
		>
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<BarChart
					data={barData}
					layout="vertical"
					margin={{ left: 0, right: 28, top: 4, bottom: 4 }}
				>
					<XAxis
						type="number"
						allowDecimals={false}
						hide
					/>
					<YAxis
						type="category"
						dataKey="bookTitle"
						width={112}
						tickLine={false}
						axisLine={{ stroke: CHART_COLORS.rule }}
						tick={{ ...CHART_TICK, fill: CHART_COLORS.inkSoft }}
						tickFormatter={(value: string) =>
							value.length > MAX_TITLE_LENGTH
								? `${value.slice(0, MAX_TITLE_LENGTH)}…`
								: value
						}
					/>
					<Bar
						dataKey="count"
						barSize={22}
						isAnimationActive={!reduceMotion}
						radius={[0, 2, 2, 0]}
					>
						{barData.map((entry, index) => (
							<Cell
								key={`${entry.bookTitle}-${index}`}
								fill={RANK_COLORS[index % RANK_COLORS.length]}
							/>
						))}
						{/* 막대 끝에 문장 수 표시 */}
						<LabelList
							dataKey="count"
							position="right"
							fill={CHART_COLORS.inkSoft}
							fontSize={12}
							fontWeight={700}
						/>
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
}
