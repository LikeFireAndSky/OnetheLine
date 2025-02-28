import { NextApiRequest, NextApiResponse } from 'next';
import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Only allow GET requests
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

	// 1) GSI로 조회 (LastUpdated가 있는 아이템만 내림차순으로)
	const indexParams = {
		TableName: 'LOG_ARCHIVE_BY_USER',
		IndexName: 'GSI-LastUpdated',
		KeyConditionExpression: 'UserId = :userId',
		ExpressionAttributeValues: {
			':userId': userId,
		},
		ScanIndexForward: false, // 내림차순
	};

	// 2) 기본 테이블로 같은 PartitionKey 조회 (모든 아이템: LastUpdated 유무 상관없이)
	//    - 테이블의 PK가 UserId, SortKey가 BookId라고 가정
	const tableParams = {
		TableName: 'LOG_ARCHIVE_BY_USER',
		KeyConditionExpression: 'UserId = :userId',
		ExpressionAttributeValues: {
			':userId': userId,
		},
	};

	try {
		// 1) GSI 쿼리
		const indexCommand = new QueryCommand(indexParams);
		const indexResponse = await ddbDocClient.send(indexCommand);
		const itemsWithLU = indexResponse.Items || [];

		// 2) 기본 테이블 쿼리
		const tableCommand = new QueryCommand(tableParams);
		const tableResponse = await ddbDocClient.send(tableCommand);
		const allItems = tableResponse.Items || [];

		// 3) allItems 중 LastUpdated가 "없는" 아이템만 필터링
		const itemsWithoutLU = allItems.filter(item => !item.LastUpdated);

		// 4) 최종 결과:
		//    - GSI 쿼리 결과(LastUpdated가 있는 아이템들, 이미 최신순)
		//    - 뒤에 LastUpdated 없는 아이템들
		const finalItems = [...itemsWithLU, ...itemsWithoutLU];

		return res.status(200).json({
			message: 'Data fetched successfully',
			data: finalItems,
			count: finalItems.length,
		});
	} catch (error) {
		console.error('Failed to fetch data:', error);
		return res.status(500).json({ message: 'Failed to fetch data', error });
	}
}
