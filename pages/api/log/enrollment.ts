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
	if (req.method !== 'POST') {
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
		res.status(400).json({
			message:
				'Missing required fields: userId, bookTitle, category, or sentence',
		});
		return;
	}

	const sentenceId = randomUUID();
	const timestamp = Date.now();

	// DynamoDB UpdateItem 파라미터
	const updateParams: UpdateItemCommandInput = {
		TableName: 'LOG_ARCHIVE_BY_USER',
		Key: {
			UserId: { S: userId },
			BookId: { S: `${bookIsbn}` },
		},
		UpdateExpression:
			'SET Contents = list_append(if_not_exists(Contents, :emptyList), :newContent), Category = :category, BookTitle = :bookTitle, BookAuthor = :bookAuthor, BookPublisher = :bookPublisher',
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
		},
		ReturnValues: 'ALL_NEW', // 올바른 문자열 리터럴 사용
	};

	try {
		const updateCommand = new UpdateItemCommand(updateParams);
		const updateResponse = await ddbDocClient.send(updateCommand);

		res.status(200).json({
			message: 'Sentence added successfully',
			data: {
				updatedData: updateResponse.Attributes,
			},
		});
	} catch (error) {
		res.status(500).json({ message: 'Failed to save sentence', error });
	}
}
