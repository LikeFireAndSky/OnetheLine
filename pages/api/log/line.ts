import { NextApiRequest, NextApiResponse } from 'next';
import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// GET 요청이 아니면 즉시 반환
	if (req.method !== 'GET') {
		return res
			.status(405)
			.json({ message: 'Method not allowed', isEnrolled: false });
	}

	// NextAuth를 통해 세션을 가져오고, 세션 또는 필수 값이 없으면 반환
	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user || !session.userId) {
		return res.status(200).json({
			message: 'This user is not authenticated',
			data: null,
			isEnrolled: false,
			isAuthenticated: false,
		});
	}
	const userId = session.userId;

	// DynamoDB Query 파라미터 설정
	const params = {
		TableName: 'LOG_ARCHIVE_BY_USER',
		KeyConditionExpression: 'UserId = :userId',
		ExpressionAttributeValues: {
			':userId': userId,
		},
	};

	try {
		// QueryCommand를 인라인으로 생성하여 실행
		const response = await ddbDocClient.send(new QueryCommand(params));

		// 데이터가 없으면 조기 반환
		if (!response.Items || response.Count! < 1) {
			return res.status(200).json({
				message: 'No data found for the given userId',
				isEnrolled: false,
				isAuthenticated: true,
				SentenceCounts: 0,
			});
		}

		const items = response.Items;
		// for-of 루프를 사용하여 모든 항목의 Contents 개수를 누적
		let sentenceCounts = 0;
		for (const item of items) {
			const contents = item.Contents || [];
			sentenceCounts += contents.length;
		}

		// Contents가 있는 항목 중 첫 번째를 선택 (무작위 선택)
		const itemsWithContents = items.filter(
			item => item.Contents && item.Contents.length > 0,
		);
		if (itemsWithContents.length === 0) {
			return res.status(200).json({
				message: 'No contents found for the given userId',
				data: null,
				isEnrolled: false,
				isAuthenticated: true,
				SentenceCounts: sentenceCounts,
			});
		}
		const randomItem =
			itemsWithContents[Math.floor(Math.random() * itemsWithContents.length)];
		const randomContent =
			randomItem.Contents[
				Math.floor(Math.random() * randomItem.Contents.length)
			];

		const result = {
			UserId: randomItem.UserId,
			BookId: randomItem.BookId,
			BookTitle: randomItem.BookTitle,
			Category: randomItem.Category,
			Content: randomContent.Content,
			SentenceID: randomContent.SentenceID,
			Timestamp: randomContent.Timestamp,
			totalBooks: response.Count,
			BookAuthor: randomItem.BookAuthor,
			BookPublisher: randomItem.BookPublisher,
		};

		return res.status(200).json({
			message: 'Data fetched successfully',
			data: result,
			isEnrolled: true,
			SentenceCounts: sentenceCounts,
			isAuthenticated: true,
		});
	} catch (error) {
		console.error('Failed to fetch data:', error);
		return res.status(500).json({
			message: 'Failed to fetch data',
			error,
			isEnrolled: false,
			SentenceCounts: 0,
			isAuthenticated: true,
		});
	}
}
