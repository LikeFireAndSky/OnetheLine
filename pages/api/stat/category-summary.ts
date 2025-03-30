// pages/api/stat/category-summary.ts

import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// ✨ 샘플 데이터
	const MOCK_DATA = [
		{ category: 'literature-arts', count: 9 },
		{ category: 'science-technology', count: 2 },
		{ category: 'society-environment', count: 7 },
		{ category: 'business-economics', count: 5 },
		{ category: 'selfHelp-psychology', count: 6 },
	];

	// ✨ 0으로 초기화된 MOCK_DATA
	const ZERO_INIT_MOCK_DATA = [
		{ category: 'literature-arts', count: 1 },
		{ category: 'science-technology', count: 1 },
		{ category: 'society-environment', count: 1 },
		{ category: 'business-economics', count: 1 },
		{ category: 'selfHelp-psychology', count: 1 },
	];

	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user || !session.userId) {
		// if user is not logged in, return mock data
		return res.status(200).json({ data: MOCK_DATA });
	}
	const userId = session.userId;

	try {
		// CATEGORY# 로 시작하는 항목만 필터링
		const data = await ddbDocClient.send(
			new QueryCommand({
				TableName: 'ONETHELINE_USER_STAT_SUMMARY',
				KeyConditionExpression: 'UserId = :userId',
				ExpressionAttributeValues: {
					':userId': userId,
				},
			}),
		);

		const categoryStats = (data.Items || []).filter(item =>
			item.Statistic.startsWith('CATEGORY#'),
		);

		const result = categoryStats.map(item => ({
			category: item.Statistic.replace('CATEGORY#', ''),
			count: Number(item.Count ?? 0),
		}));

		// Count가 0일 경우 MOCK_DATA로 대체
		if (result.every(item => item.count === 0)) {
			return res.status(200).json({ data: ZERO_INIT_MOCK_DATA });
		}

		return res.status(200).json({ data: result });
	} catch (err) {
		console.error('❌ Failed to fetch category summary:', err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
}
