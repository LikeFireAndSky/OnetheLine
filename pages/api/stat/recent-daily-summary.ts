import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// 목업데이터 날짜 생성기 그냥, 오늘 날짜 기준으로 7일 전부터 오늘까지의 날짜를 생성
	const generateMockDate = (daysAgo: number) => {
		const today = new Date();
		today.setDate(today.getDate() - daysAgo);
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	// 목업 데이터
	const MOCK_DATA = [
		{ date: generateMockDate(0), count: 5, cumulative: 5 },
		{ date: generateMockDate(1), count: 3, cumulative: 8 },
		{ date: generateMockDate(2), count: 4, cumulative: 12 },
		{ date: generateMockDate(3), count: 2, cumulative: 14 },
		{ date: generateMockDate(4), count: 6, cumulative: 20 },
		{ date: generateMockDate(5), count: 1, cumulative: 21 },
		{ date: generateMockDate(6), count: 7, cumulative: 28 },
	];

	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.userId) {
		// 로그인하지 않은 경우 목업 데이터 반환
		return res.status(200).json({ data: MOCK_DATA });
	}

	const userId = session.userId;
	const today = new Date();
	const dateKeys: string[] = [];

	for (let i = 6; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(today.getDate() - i);
		const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
		dateKeys.push(dateStr);
	}

	try {
		const results: { date: string; count: number; cumulative: number }[] = [];
		let lastCumulative = 0;

		for (const dateStr of dateKeys) {
			const key = `DATE#${dateStr}`;
			const data = await ddbDocClient.send(
				new QueryCommand({
					TableName: 'ONETHELINE_USER_STAT_SUMMARY',
					KeyConditionExpression: 'UserId = :uid AND Statistic = :stat',
					ExpressionAttributeValues: {
						':uid': userId,
						':stat': key,
					},
				}),
			);

			const count = data.Items?.[0]?.Count ?? 0;

			const cumulative = data.Items?.[0]?.Cumulative ?? lastCumulative;
			lastCumulative = cumulative;

			// ✅ MM-DD 형식으로 포맷
			const [year, month, day] = dateStr.split('-');
			const formatted = `${month}-${day}`;

			results.push({
				date: formatted,
				count,
				cumulative,
			});
		}

		return res.status(200).json({ data: results });
	} catch (err) {
		console.error('❌ Failed to load recent daily stats:', err);
		return res.status(500).json({ message: 'Internal server error' });
	}
}
