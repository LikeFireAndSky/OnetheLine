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
import {
	Card,
	CardHeader,
	CardBody,
	Typography,
} from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import { useRecentCumulative } from '../api/useCategorySummary';

// ✅ 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white font-light border border-gray-300 px-2 py-1 rounded shadow-sm text-sm text-gray-700">
				<p className="font-light">{label}</p>
				<p className="font-semibold">{`누적: ${payload[0].value} 문장`}</p>
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
	const { data: session, status } = useSession();
	const isLoggedIn = status === 'authenticated';

	const { data, isLoading, isError } = useRecentCumulative();

	const chartData = isLoggedIn ? data || [] : MOCK_DATA;

	// 누적 최소/최대 계산
	const values = chartData.map(d => d.cumulative);
	const min = Math.max(Math.min(...values) - 1, 0);
	const max = Math.max(...values) + 1;

	if (!isLoggedIn && isLoading) {
		return <p className="text-center text-gray-500">로딩 중...</p>;
	}

	return (
		<Card className="w-full mx-auto">
			<CardHeader
				floated={false}
				shadow={false}
				className="pb-2"
			>
				<Typography
					variant="h6"
					color="blue-gray"
				>
					📈 누적 문장 수 추이
				</Typography>
				<Typography
					variant="small"
					color="gray"
					className="font-light"
				>
					{isLoggedIn ? '최근 7일 누적 문장 수' : '샘플 데이터 (로그인 필요)'}
				</Typography>
			</CardHeader>
			<CardBody className="pt-0 h-[300px]">
				<ResponsiveContainer
					width="100%"
					height="100%"
				>
					<LineChart
						data={chartData}
						margin={{ left: -25, top: 10, bottom: 10, right: 5 }}
					>
						<XAxis
							dataKey="date"
							fontSize={8}
						/>
						<YAxis
							domain={[min, max]}
							allowDecimals={false}
							fontSize={10}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Line
							type="monotone"
							dataKey="cumulative"
							stroke="#4f46e5"
							strokeWidth={2}
							dot={{ r: 4 }}
							activeDot={{ r: 6 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardBody>
		</Card>
	);
}
