// pages/api/stat/top-books.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	const session = await getServerSession(req, res, authOptions);

	const MOCK_DATA = [
		{ bookTitle: '데미안', count: 7 },
		{ bookTitle: '어린 왕자', count: 5 },
		{ bookTitle: '미움받을 용기', count: 4 },
		{ bookTitle: '죽음에 관하여', count: 3 },
		{ bookTitle: '총 균 쇠', count: 2 },
	];

	if (!session || !session.user || !session.userId) {
		// 로그인하지 않은 경우 샘플 데이터 반환
		return res.status(200).json({ data: MOCK_DATA });
	}

	const userId = session.userId;

	try {
		const command = new QueryCommand({
			TableName: 'ONETHELINE_USER_STAT_SUMMARY',
			KeyConditionExpression:
				'UserId = :uid AND begins_with(Statistic, :bookPrefix)',
			ExpressionAttributeValues: {
				':uid': userId,
				':bookPrefix': 'BOOK#',
			},
		});

		const { Items } = await ddbDocClient.send(command);

		if (!Items) return res.status(200).json({ data: [] });

		// Top 5 정렬 (Count 기준 내림차순)
		const sorted = Items.sort((a, b) => (b.Count ?? 0) - (a.Count ?? 0)).slice(
			0,
			5,
		);

		// 전처리해서 클라이언트로 보낼 형식 맞추기
		const books = sorted.map(item => ({
			bookTitle: item.BookTitle || '제목 없음',
			count: item.Count ?? 0,
		}));

		// Count가 0일 경우 mock data로 대체
		if (books.every(book => book.count === 0)) {
			return res.status(200).json({ data: MOCK_DATA });
		}

		return res.status(200).json({ data: books });
	} catch (error) {
		console.error('Failed to fetch top books:', error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
}
