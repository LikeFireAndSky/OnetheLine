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
		res.status(405).json({ message: 'Method not allowed', isEnrolled: false });
		return;
	}

	// Get user session using NextAuth
	const session = await getServerSession(req, res, authOptions);

	if (!session || !session.user) {
		return res.status(200).json({
			message: 'This user is not authenticated',
			data: null,
			isEnrolled: false,
			isAuthenticated: false,
		});
	}

	// Extract user ID from session
	const userId = session.userId; // `id`는 세션 사용자 객체에 저장된 ID 키 (필요에 따라 확인)

	// Validate required fields
	if (!userId) {
		return res.status(200).json({
			message: 'This user is not authenticated',
			data: null,
			isEnrolled: false,
			isAuthenticated: false,
		});
	}

	// DynamoDB parameters for QueryCommand
	const params = {
		TableName: 'LOG_ARCHIVE_BY_USER',
		KeyConditionExpression: 'UserId = :userId',
		ExpressionAttributeValues: {
			':userId': userId,
		},
	};

	try {
		// Execute QueryCommand
		const command = new QueryCommand(params);
		const response = await ddbDocClient.send(command);

		// Check if Items exist
		if (response.Count! < 1 || !response.Items) {
			return res.status(200).json({
				message: 'No data found for the given userId',
				isEnrolled: false,
				isAuthenticated: true,
				SentenceCounts: 0,
			});
		}

		// Calculate total SentenceCounts
		const sentenceCounts = response.Items.reduce((total, item) => {
			const contents = item.Contents || [];
			return total + contents.length;
		}, 0);

		// Randomly select an item and its content
		const randomItemIndex = Math.floor(Math.random() * response.Items.length);
		const item = response.Items[randomItemIndex];

		// Check if Contents exist in the selected item
		if (!item.Contents || !item) {
			return res.status(200).json({
				message: 'No contents found for the given userId',
				data: null,
				isEnrolled: false,
				isAuthenticated: true,
				SentenceCounts: sentenceCounts,
			});
		}

		const randomIndex = Math.floor(Math.random() * item.Contents.length);
		const randomContent = item.Contents[randomIndex];

		const result = {
			UserId: item.UserId,
			BookId: item.BookId,
			BookTitle: item.BookTitle,
			Category: item.Category,
			Content: randomContent.Content,
			SentenceID: randomContent.SentenceID,
			Timestamp: randomContent.Timestamp,
			totalBooks: response.Count,
			BookAuthor: item.BookAuthor,
			BookPublisher: item.BookPublisher,
		};

		// Return successful response with SentenceCounts
		return res.status(200).json({
			message: 'Data fetched successfully',
			data: result,
			isEnrolled: true,
			SentenceCounts: sentenceCounts,
			isAuthenticated: true,
		});
	} catch (error) {
		// Error handling
		return res.status(500).json({
			message: 'Failed to fetch data',
			error,
			isEnrolled: false,
			SentenceCounts: 0,
			isAuthenticated: true,
		});
	}
}
