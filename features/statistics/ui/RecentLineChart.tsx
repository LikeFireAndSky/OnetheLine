'use client';

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from 'recharts';
import { useSession } from 'next-auth/react';
import { useReducedMotion } from '@react-spring/web';
import { useRecentCumulative } from '../api/useCategorySummary';
import { CHART_COLORS, CHART_TICK } from '../config/chartTheme';
import { ChartCard, ChartMessage } from './ChartCard';

const TITLE = '누적 문장 수 추이';

// ✅ 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="paper px-3 py-2 text-[13px]">
				<p className="text-ink-muted">{label}</p>
				<p className="font-bold text-ink">{`누적 ${payload[0].value}줄`}</p>
			</div>
		);
	}
	return null;
};

// ✨ 샘플 데이터
const MOCK_DATA = [
	{ date: '03-24', cumulative: 10 },
	{ date: '03-25', cumulative: 15 },
	{ date: '03-26', cumulative: 18 },
	{ date: '03-27', cumulative: 21 },
	{ date: '03-28', cumulative: 24 },
	{ date: '03-29', cumulative: 27 },
	{ date: '03-30', cumulative: 30 },
];

export default function RecentCumulativeChart() {
	const { status } = useSession();
	const reduceMotion = !!useReducedMotion();
	const isLoggedIn = status === 'authenticated';

	const { data, isLoading, isError } = useRecentCumulative();

	// 세션 확인 중이거나 로그인 사용자의 데이터를 불러오는 중이면 로딩 표시
	if (status === 'loading' || (isLoggedIn && isLoading)) {
		return (
			<ChartMessage
				title={TITLE}
				message="데이터를 불러오는 중입니다..."
			/>
		);
	}

	if (isLoggedIn && isError) {
		return (
			<ChartMessage
				title={TITLE}
				message="데이터를 불러오지 못했습니다."
			/>
		);
	}

	const chartData = isLoggedIn ? data || [] : MOCK_DATA;

	if (chartData.length === 0) {
		return (
			<ChartMessage
				title={TITLE}
				message="최근 7일 동안 기록한 문장이 없어요."
			/>
		);
	}

	// 누적 최소/최대 계산
	const values = chartData.map(d => d.cumulative);
	const min = Math.max(Math.min(...values) - 1, 0);
	const max = Math.max(...values) + 1;

	return (
		<ChartCard
			title={TITLE}
			subtitle={
				isLoggedIn ? '최근 7일 누적 문장 수' : '샘플 데이터 (로그인 필요)'
			}
		>
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<LineChart
					data={chartData}
					margin={{ left: -16, top: 10, bottom: 4, right: 12 }}
				>
					<CartesianGrid
						vertical={false}
						stroke={CHART_COLORS.rule}
						strokeDasharray="3 4"
					/>
					<XAxis
						dataKey="date"
						tick={CHART_TICK}
						tickLine={false}
						axisLine={{ stroke: CHART_COLORS.rule }}
					/>
					<YAxis
						domain={[min, max]}
						allowDecimals={false}
						tick={CHART_TICK}
						tickLine={false}
						axisLine={false}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Line
						type="monotone"
						dataKey="cumulative"
						stroke={CHART_COLORS.seal}
						strokeWidth={2}
						isAnimationActive={!reduceMotion}
						dot={{ r: 3.5, fill: CHART_COLORS.paper, strokeWidth: 2 }}
						activeDot={{ r: 5.5 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</ChartCard>
	);
}
