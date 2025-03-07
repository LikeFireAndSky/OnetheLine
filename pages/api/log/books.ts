import { NextApiRequest, NextApiResponse } from 'next';
import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Only allow GET requests; 잘못된 메서드인 경우 즉시 반환
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// NextAuth를 통해 세션을 가져오고, 세션이 없으면 Unauthorized 응답
	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	// 세션에서 사용자 ID 추출
	const userId = session.userId;

	// GSI 쿼리 파라미터 (LastUpdated가 있는 아이템을 내림차순으로 조회)
	const indexParams = {
		TableName: 'LOG_ARCHIVE_BY_USER',
		IndexName: 'GSI-LastUpdated',
		KeyConditionExpression: 'UserId = :userId',
		ExpressionAttributeValues: { ':userId': userId },
		ScanIndexForward: false, // 내림차순
	};

	// 기본 테이블 쿼리 파라미터 (모든 아이템 조회)
	const tableParams = {
		TableName: 'LOG_ARCHIVE_BY_USER',
		KeyConditionExpression: 'UserId = :userId',
		ExpressionAttributeValues: { ':userId': userId },
	};

	try {
		// 두 개의 쿼리를 병렬 실행하여 전체 대기 시간을 단축합니다.
		const [indexResponse, tableResponse] = await Promise.all([
			ddbDocClient.send(new QueryCommand(indexParams)),
			ddbDocClient.send(new QueryCommand(tableParams)),
		]);

		// GSI 쿼리 결과 (LastUpdated가 있는 아이템들)
		const itemsWithLU = indexResponse.Items || [];
		// 기본 테이블 쿼리 결과 (모든 아이템)
		const allItems = tableResponse.Items || [];
		// 기본 테이블 결과 중 LastUpdated가 없는 아이템 필터링
		const itemsWithoutLU = allItems.filter(item => !item.LastUpdated);

		// 최종 결과: GSI 결과(이미 최신순) 뒤에 LastUpdated 없는 아이템 추가
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
