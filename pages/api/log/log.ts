import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';
import {
	UpdateItemCommand,
	DeleteItemCommand,
	UpdateItemCommandInput,
	DeleteItemCommandInput,
	GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'DELETE') {
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

	const { bookIsbn, sentenceId } = req.query;

	if (!userId || !bookIsbn || !sentenceId) {
		res.status(400).json({
			message:
				'Missing required query parameters: userId, bookIsbn, sentenceId',
		});
		return;
	}

	try {
		// Fetch the current item to verify the Contents array
		const getParams = {
			TableName: 'LOG_ARCHIVE_BY_USER',
			Key: {
				UserId: { S: `${userId}` },
				BookId: { S: `${bookIsbn}` },
			},
		};
		const { Item } = await ddbDocClient.send(new GetItemCommand(getParams));

		if (!Item) {
			res.status(404).json({ message: 'Item not found' });
			return;
		}

		const contents = Item.Contents.L || [];
		const updatedContents = contents.filter(
			(content: any) => content.M.SentenceID.S !== sentenceId,
		);

		if (updatedContents.length === 0) {
			// Delete the entire item if Contents becomes empty
			const deleteParams: DeleteItemCommandInput = {
				TableName: 'LOG_ARCHIVE_BY_USER',
				Key: {
					UserId: { S: `${userId}` },
					BookId: { S: `${bookIsbn}` },
				},
			};
			await ddbDocClient.send(new DeleteItemCommand(deleteParams));
			res.status(200).json({ message: 'Item deleted successfully' });
		} else {
			// Update the Contents array
			const updateParams: UpdateItemCommandInput = {
				TableName: 'LOG_ARCHIVE_BY_USER',
				Key: {
					UserId: { S: `${userId}` },
					BookId: { S: `${bookIsbn}` },
				},
				UpdateExpression: 'SET Contents = :updatedContents',
				ExpressionAttributeValues: {
					':updatedContents': { L: updatedContents },
				},
				ReturnValues: 'ALL_NEW',
			};
			const updateResponse = await ddbDocClient.send(
				new UpdateItemCommand(updateParams),
			);
			res.status(200).json({
				message: 'Sentence deleted successfully',
				data: updateResponse.Attributes,
			});
		}
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete sentence', error });
	}
}
