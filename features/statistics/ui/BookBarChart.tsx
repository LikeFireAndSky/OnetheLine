'use client';

import { useSession } from 'next-auth/react';
import {
	Bar,
	BarChart,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import {
	Card,
	CardHeader,
	CardBody,
	Typography,
} from '@material-tailwind/react';
import { useTopBooks } from '../api/useCategorySummary';

const COLORS = ['#4E5FBF', '#1D3159', '#8DA633', '#F2B544', '#D9763D'];

const MOCK_DATA = [
	{ bookTitle: '데미안', count: 7 },
	{ bookTitle: '어린 왕자', count: 5 },
	{ bookTitle: '미움받을 용기', count: 4 },
	{ bookTitle: '죽음에 관하여', count: 3 },
	{ bookTitle: '총 균 쇠', count: 2 },
];

export default function BookBarChart() {
	const { data: session, status } = useSession();
	const isLoggedIn = status === 'authenticated';

	const { data } = useTopBooks();

	// 괄호 제거 처리
	const processedData = data?.map(item => {
		const bookTitle = item.bookTitle.replace(/\(.*?\)/g, '').trim();
		return { ...item, bookTitle };
	});

	const barData = isLoggedIn ? processedData || [] : MOCK_DATA;

	return (
		<Card className="w-full">
			<CardHeader
				floated={false}
				shadow={false}
				className="pb-2"
			>
				<Typography
					variant="h6"
					color="blue-gray"
				>
					📚 책별 문장 수 Top 5
				</Typography>
				<Typography
					variant="small"
					color="gray"
					className="font-light"
				>
					{isLoggedIn
						? '가장 많은 line을 남긴 책들'
						: '샘플 데이터 (로그인 필요)'}
				</Typography>
			</CardHeader>

			<CardBody className="pt-0 h-[300px]">
				<ResponsiveContainer
					width="100%"
					height="100%"
				>
					<BarChart
						data={barData}
						layout="vertical"
						margin={{ left: -25, top: 10, bottom: 10 }}
					>
						<XAxis
							type="number"
							allowDecimals={false}
							className="text-xs font-light"
						/>
						<YAxis
							type="category"
							dataKey="bookTitle"
							width={100} // 간격 조절
							tickLine={false}
							tickMargin={5}
							tickFormatter={value =>
								value.length > 20 ? value.slice(0, 20) + '...' : value
							}
							//글자 왼쪽 정렬
							tick={{ textAnchor: 'middle', dx: -30, dy: 0 }}
							axisLine={true}
							className="text-[9px] font-light flex"
						/>
						<Bar
							dataKey="count"
							fill="currentColor"
							barSize={27}
							radius={[0, 4, 4, 0]}
						>
							{barData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardBody>
		</Card>
	);
}
