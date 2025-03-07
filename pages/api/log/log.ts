import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';
import {
	UpdateItemCommand,
	DeleteItemCommand,
	GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// GET이 아닌 DELETE 요청만 허용 (조기 반환)
	if (req.method !== 'DELETE') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// 세션 및 인증 검증: 세션이나 필수 세션 필드가 없으면 바로 반환
	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user || !session.userId) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	const userId = session.userId;

	// 요청 쿼리에서 bookIsbn과 sentenceId 추출 및 검증
	const { bookIsbn, sentenceId } = req.query;
	if (!userId || !bookIsbn || !sentenceId) {
		return res.status(400).json({
			message:
				'Missing required query parameters: userId, bookIsbn, sentenceId',
		});
	}

	try {
		// 현재 아이템을 조회하여 Contents 배열을 확인 (인라인으로 GetItemCommand 생성)
		const { Item } = await ddbDocClient.send(
			new GetItemCommand({
				TableName: 'LOG_ARCHIVE_BY_USER',
				Key: {
					UserId: { S: userId },
					BookId: { S: bookIsbn as string },
				},
			}),
		);

		// 아이템이 없으면 404 반환
		if (!Item) {
			return res.status(404).json({ message: 'Item not found' });
		}

		// Contents 배열 추출 (존재하지 않으면 빈 배열로 처리)
		const contents = Item.Contents?.L || [];
		// 삭제할 문장을 제외한 새로운 Contents 배열 생성 (filter 사용)
		const updatedContents = contents.filter(
			(content: any) => content.M.SentenceID.S !== sentenceId,
		);

		// 만약 Contents가 비어있다면 아이템 전체 삭제
		if (updatedContents.length === 0) {
			await ddbDocClient.send(
				new DeleteItemCommand({
					TableName: 'LOG_ARCHIVE_BY_USER',
					Key: {
						UserId: { S: userId },
						BookId: { S: bookIsbn as string },
					},
				}),
			);
			return res.status(200).json({ message: 'Item deleted successfully' });
		} else {
			// 그렇지 않으면 Contents 배열만 업데이트
			const updateResponse = await ddbDocClient.send(
				new UpdateItemCommand({
					TableName: 'LOG_ARCHIVE_BY_USER',
					Key: {
						UserId: { S: userId },
						BookId: { S: bookIsbn as string },
					},
					UpdateExpression: 'SET Contents = :updatedContents',
					ExpressionAttributeValues: {
						':updatedContents': { L: updatedContents },
					},
					ReturnValues: 'ALL_NEW',
				}),
			);
			return res.status(200).json({
				message: 'Sentence deleted successfully',
				data: updateResponse.Attributes,
			});
		}
	} catch (error) {
		console.error('Failed to delete sentence:', error);
		return res
			.status(500)
			.json({ message: 'Failed to delete sentence', error });
	}
}
