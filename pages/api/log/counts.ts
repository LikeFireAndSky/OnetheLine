import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';
import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// GET 요청이 아니면 즉시 반환
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// NextAuth로 세션 가져오기; 세션이 없으면 Unauthorized 반환
	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	// 세션에서 사용자 ID 추출
	const userId = session.userId;

	// DynamoDB Query 파라미터 설정
	const queryParams: QueryCommandInput = {
		TableName: 'LOG_ARCHIVE_BY_USER',
		KeyConditionExpression: 'UserId = :userId',
		ExpressionAttributeValues: {
			':userId': { S: String(userId) },
		},
	};

	try {
		// QueryCommand를 바로 생성하여 실행 (중간 변수 생략)
		const queryResponse = await ddbDocClient.send(
			new QueryCommand(queryParams),
		);

		// for-of 루프를 사용하여 Contents의 개수를 계산
		let contentCount = 0;
		if (queryResponse.Items) {
			for (const item of queryResponse.Items) {
				// item.Contents가 존재하고, 리스트라면 해당 길이를 누적
				if (item.Contents?.L) {
					contentCount += item.Contents.L.length;
				}
			}
		}

		return res.status(200).json({
			message: 'Content count fetched successfully',
			data: { contentCount },
		});
	} catch (error) {
		console.error('Failed to fetch content count:', error);
		return res
			.status(500)
			.json({ message: 'Failed to fetch content count', error });
	}
}
