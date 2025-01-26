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

	// DynamoDB parameters for QueryCommand
	const params = {
		TableName: 'LOG_ARCHIVE_BY_USER', // DynamoDB table name
		KeyConditionExpression: 'UserId = :userId', // Partition Key condition
		ExpressionAttributeValues: {
			':userId': userId, // Bind the userId to the query
		},
	};

	try {
		// Execute QueryCommand
		const command = new QueryCommand(params);
		const response = await ddbDocClient.send(command);

		// Return successful response
		return res.status(200).json({
			message: 'Data fetched successfully',
			data: response.Items, // The data retrieved from the query
			count: response.Count, // Number of items returned
		});
	} catch (error) {
		// Error handling
		return res.status(500).json({ message: 'Failed to fetch data', error });
	}
}
