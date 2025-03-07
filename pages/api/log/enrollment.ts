import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';
import {
	UpdateItemCommand,
	UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// GET이 아닌 요청은 즉시 거부
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// NextAuth를 통해 세션을 가져오고, 세션이 없으면 Unauthorized 반환
	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	// 세션에서 사용자 ID 추출
	const { userId } = session;

	// 요청 본문에서 필요한 필드 추출 및 유효성 검사
	const { bookTitle, bookIsbn, category, sentence, bookAuthor, bookPublisher } =
		req.body;
	if (
		!userId ||
		!bookTitle ||
		!category ||
		!sentence ||
		!bookIsbn ||
		!bookAuthor ||
		!bookPublisher
	) {
		return res.status(400).json({
			message:
				'Missing required fields: userId, bookTitle, category, or sentence',
		});
	}

	// 고유 문장 ID 생성 및 타임스탬프 설정
	const sentenceId = randomUUID();
	const timestamp = Date.now();
	const lastUpdatedTime = timestamp.toString();

	// DynamoDB UpdateItem 파라미터 설정 (UpdateExpression과 AttributeValues 정의)
	const updateParams: UpdateItemCommandInput = {
		TableName: 'LOG_ARCHIVE_BY_USER',
		Key: {
			UserId: { S: userId },
			BookId: { S: bookIsbn },
		},
		UpdateExpression:
			'SET Contents = list_append(if_not_exists(Contents, :emptyList), :newContent), Category = :category, BookTitle = :bookTitle, BookAuthor = :bookAuthor, BookPublisher = :bookPublisher, LastUpdated = :lastUpdatedTime',
		ExpressionAttributeValues: {
			':newContent': {
				L: [
					{
						M: {
							SentenceID: { S: sentenceId },
							Content: { S: sentence },
							Timestamp: { N: timestamp.toString() },
						},
					},
				],
			},
			':emptyList': { L: [] },
			':category': { S: category },
			':bookTitle': { S: bookTitle },
			':bookAuthor': { S: bookAuthor },
			':bookPublisher': { S: bookPublisher },
			':lastUpdatedTime': { N: lastUpdatedTime },
		},
		ReturnValues: 'ALL_NEW',
	};

	try {
		// UpdateItemCommand를 인라인으로 생성하여 DynamoDB에 업데이트 요청을 보냅니다.
		const updateResponse = await ddbDocClient.send(
			new UpdateItemCommand(updateParams),
		);

		return res.status(200).json({
			message: 'Sentence added successfully',
			data: { updatedData: updateResponse.Attributes },
		});
	} catch (error) {
		console.error('Failed to save sentence:', error);
		return res.status(500).json({ message: 'Failed to save sentence', error });
	}
}
