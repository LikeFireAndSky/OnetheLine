// lib/user.js
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { ddbDocClient } from '../lib/ddbDocClient';

/**
 * 유저 정보 타입 정의
 */
type User = {
	userId: string;
	accessToken: string;
	name: string;
	email: string;
	createdAt: string;
};

/**
 * userId로 유저 정보 조회
 */
export async function getUserById(userId: string): Promise<User | null> {
	const params = {
		TableName: 'ONE_THE_LINE-Users',
		Key: {
			userId: { S: userId },
		},
	};

	try {
		const command = new GetItemCommand(params);
		const data = await ddbDocClient.send(command);

		if (!data.Item) return null;

		return {
			userId: data.Item.userId?.S || '',
			accessToken: data.Item.accessToken?.S || '',
			name: data.Item.name?.S || '',
			email: data.Item.email?.S || '',
			createdAt: data.Item.createdAt?.S || '',
		};
	} catch (error) {
		console.error('❌ getUserById failed:', error);
		throw new Error('Error fetching user');
	}
}

/**
 * 유저 정보를 저장
 */
export async function saveUser({
	userId,
	accessToken,
	name,
	email,
}: {
	userId: string;
	accessToken: string;
	name: string;
	email: string;
}): Promise<void> {
	const params = {
		TableName: 'ONE_THE_LINE-Users',
		Item: {
			userId: { S: userId },
			accessToken: { S: accessToken },
			name: { S: name },
			email: { S: email },
			createdAt: { S: new Date().toISOString() },
		},
	};

	try {
		const command = new PutItemCommand(params);
		await ddbDocClient.send(command);
	} catch (error) {
		console.error('❌ saveUser failed:', { userId, error });
		throw new Error('Error saving user');
	}
}
