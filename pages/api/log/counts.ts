import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';
import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'GET') {
		res.status(405).json({ message: 'Method not allowed' });
		return;
	}

	// Get user session using NextAuth
	const session = await getServerSession(req, res, authOptions);

	if (!session || !session.user) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	}

	// Extract user ID from session
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
		const queryCommand = new QueryCommand(queryParams);
		const queryResponse = await ddbDocClient.send(queryCommand);

		// Contents의 개수를 계산
		const items = queryResponse.Items || [];
		const contentCount = items.reduce((count, item) => {
			const contents = item.Contents?.L || [];
			return count + contents.length;
		}, 0);

		res.status(200).json({
			message: 'Content count fetched successfully',
			data: { contentCount },
		});
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch content count', error });
	}
}
