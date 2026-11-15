'use client';

import { useSession } from 'next-auth/react';
import { useReducedMotion } from '@react-spring/web';
import { useCategorySummary } from '../api/useCategorySummary';
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Label,
} from 'recharts';
import { getCategoryHex } from '@/features/create/config/bookEnrollmentConfig';
import { CHART_COLORS } from '../config/chartTheme';
import { ChartCard, ChartMessage } from './ChartCard';

const TITLE = '카테고리별 문장 분포';

// 한글 라벨 매핑
const CATEGORY_LABELS: Record<string, string> = {
	'business-economics': '경제 · 경영',
	'science-technology': '과학 · 기술',
	'selfHelp-psychology': '자기계발 · 심리',
	'society-environment': '사회 · 환경',
	'literature-arts': '문학 · 예술',
};

const getCategoryLabel = (category: string) =>
	CATEGORY_LABELS[category] || '기타';

// ✨ 샘플 데이터 (로그아웃용)
const MOCK_DATA = [
	{ category: 'literature-arts', count: 5 },
	{ category: 'science-technology', count: 3 },
	{ category: 'society-environment', count: 2 },
];

type Props = {
	mockMode?: boolean;
};

export default function CategoryPieChart({ mockMode = false }: Props) {
	const { status } = useSession();
	const reduceMotion = !!useReducedMotion();
	const isLoggedIn = status === 'authenticated';
	const { data, isLoading, isError } = useCategorySummary();
	const pieData = (mockMode ? MOCK_DATA : data || []).filter(
		item => item.count > 0,
	);

	if (!mockMode && (isLoading || status === 'loading')) {
		return (
			<ChartMessage
				title={TITLE}
				message="데이터를 불러오는 중입니다..."
			/>
		);
	}

	if (!mockMode && (isError || !data)) {
		return (
			<ChartMessage
				title={TITLE}
				message="데이터를 불러오지 못했습니다."
			/>
		);
	}

	if (pieData.length === 0) {
		return (
			<ChartMessage
				title={TITLE}
				message="아직 기록한 문장이 없어요. 첫 문장을 남겨보세요."
			/>
		);
	}

	const total = pieData.reduce((acc, cur) => acc + cur.count, 0);

	// 가장 많이 읽은 카테고리 안내 문구
	const topCategory = pieData.reduce((prev, current) =>
		prev.count > current.count ? prev : current,
	);

	const subtitle =
		mockMode || !isLoggedIn
			? '샘플 데이터 (로그인 필요)'
			: `${getCategoryLabel(topCategory.category)} 책을 가장 많이 읽었습니다.`;

	return (
		<ChartCard
			title={TITLE}
			subtitle={subtitle}
			height={300}
		>
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<PieChart>
					<Pie
						data={pieData}
						dataKey="count"
						nameKey="category"
						cx="50%"
						cy="45%"
						innerRadius={58}
						outerRadius={100}
						stroke={CHART_COLORS.paper}
						strokeWidth={2}
						isAnimationActive={!reduceMotion}
						labelLine={false}
						label={({
							cx,
							cy,
							midAngle,
							innerRadius,
							outerRadius,
							percent,
						}) => {
							// 너무 작은 조각에는 비율을 쓰지 않음 (글자가 겹쳐 읽기 어려움)
							if (percent < 0.07) return null;
							const RADIAN = Math.PI / 180;
							const radius = innerRadius + (outerRadius - innerRadius) / 2;
							const x = cx + radius * Math.cos(-midAngle * RADIAN);
							const y = cy + radius * Math.sin(-midAngle * RADIAN);

							return (
								<text
									x={x}
									y={y}
									fill={CHART_COLORS.paper}
									textAnchor="middle"
									dominantBaseline="central"
									fontSize={12}
									fontWeight={700}
								>
									{`${(percent * 100).toFixed(0)}%`}
								</text>
							);
						}}
					>
						{pieData.map(entry => (
							<Cell
								key={entry.category}
								fill={getCategoryHex(entry.category)}
							/>
						))}

						{/* 도넛 중심에 총합 표시 */}
						<Label
							position="center"
							content={({ viewBox }) => {
								const { cx, cy } = viewBox as { cx: number; cy: number };
								return (
									<text
										x={cx}
										y={cy}
										textAnchor="middle"
										dominantBaseline="central"
									>
										<tspan
											x={cx}
											dy="-0.35em"
											fontSize={24}
											fontWeight={700}
											fill={CHART_COLORS.ink}
											fontFamily="var(--font-serif)"
										>
											{total}
										</tspan>
										<tspan
											x={cx}
											dy="1.6em"
											fontSize={12}
											fill={CHART_COLORS.inkMuted}
										>
											줄
										</tspan>
									</text>
								);
							}}
						/>
					</Pie>
					{/* 하단 범례 - 한글 라벨로 */}
					<Legend
						verticalAlign="bottom"
						iconSize={10}
						iconType="circle"
						formatter={(value: string) => (
							<span className="text-[13px] text-ink-soft">
								{getCategoryLabel(value)}
							</span>
						)}
					/>
				</PieChart>
			</ResponsiveContainer>
		</ChartCard>
	);
}
