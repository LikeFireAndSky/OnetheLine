'use client';

import { useCategorySummary } from '../api/useCategorySummary';
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
	Label,
} from 'recharts';
import {
	Card,
	CardHeader,
	CardBody,
	Typography,
} from '@material-tailwind/react';

// 고정 색상 배열 (fallback)
const COLORS = [
	'#4f46e5',
	'#16a34a',
	'#f59e0b',
	'#ef4444',
	'#0ea5e9',
	'#9333ea',
];

// 카테고리별 색상 지정
const CATEGORY_COLOR = [
	{ category: 'business-economics', color: '#4E5FBF' },
	{ category: 'science-technology', color: '#1D3159' },
	{ category: 'selfHelp-psychology', color: '#8DA633' },
	{ category: 'society-environment', color: '#F2B544' },
	{ category: 'literature-arts', color: '#D9763D' },
];

const CATEOGRY_COLORS = ['#4E5FBF', '#1D3159', '#8DA633', '#F2B544', '#D9763D'];

// 한글 라벨 매핑
const CATEGORY_LABELS: Record<string, string> = {
	'business-economics': '경제 · 경영',
	'science-technology': '과학 · 기술',
	'selfHelp-psychology': '자기계발 · 심리',
	'society-environment': '사회 · 환경',
	'literature-arts': '문학 · 예술',
};

const getCategoryColor = (category: string) => {
	const match = CATEGORY_COLOR.find(item => item.category === category);
	return match ? match.color : '#B8B8B8';
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
	const { data, isLoading, isError } = useCategorySummary();
	const pieData = mockMode ? MOCK_DATA : data || [];

	if (!mockMode && (isLoading || isError || !data)) {
		return (
			<p className="text-center text-gray-500">데이터를 불러오는 중입니다...</p>
		);
	}

	const total = pieData.reduce((acc, cur) => acc + cur.count, 0);

	// 가장 많이 읽은 카테고리 안내 문구
	const topCategory = pieData.reduce((prev, current) => {
		return prev.count > current.count ? prev : current;
	}, pieData[0]);

	const topCategoryText = `${getCategoryLabel(
		topCategory.category,
	)}책을 가장 많이 읽었습니다.`;

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
					📊 카테고리별 문장 분포
				</Typography>
				<Typography
					variant="small"
					color="gray"
					className="font-light"
				>
					{mockMode ? '샘플 데이터 (로그인 필요)' : topCategoryText}
				</Typography>
			</CardHeader>

			<CardBody className="pt-0 h-[300px]">
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
							cy="50%"
							innerRadius={50}
							outerRadius={100}
							labelLine={false}
							label={({
								cx,
								cy,
								midAngle,
								innerRadius,
								outerRadius,
								percent,
							}) => {
								const RADIAN = Math.PI / 180;
								const radius = innerRadius + (outerRadius - innerRadius) / 2;
								const x = cx + radius * Math.cos(-midAngle * RADIAN);
								const y = cy + radius * Math.sin(-midAngle * RADIAN);

								return (
									<text
										x={x}
										y={y}
										fill="white"
										textAnchor="middle"
										dominantBaseline="central"
										className="text-xs font-semibold"
									>
										{`${(percent * 100).toFixed(0)}%`}
									</text>
								);
							}}
						>
							{/* 색상 적용 */}
							{pieData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										getCategoryColor(entry.category) ||
										COLORS[index % COLORS.length]
									}
								/>
							))}

							{/* 도넛 중심에 총합 표시 */}
							<Label
								value={`${total} Lines`}
								position="center"
								className="text-base font-semibold"
							/>
						</Pie>
						{/* 하단 범례 - 한글 라벨로 */}
						<Legend
							verticalAlign="bottom"
							className=" text-[5px]"
							iconSize={10}
							iconType="circle"
							formatter={(value: string) => (
								<span className="text-xs font-light text-gray-700">
									{getCategoryLabel(value)}
								</span>
							)}
						/>
					</PieChart>
				</ResponsiveContainer>
			</CardBody>
		</Card>
	);
}
