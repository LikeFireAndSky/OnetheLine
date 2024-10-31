// lib/user.js
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { ddbDocClient } from './ddbDocClient'; // DynamoDB 클라이언트

/**
 * userId로 유저 정보 조회
 * @param {string} userId - 조회할 유저의 고유 ID
 * @returns {Object|null} 유저 정보 객체 또는 null
 */
export async function getUserById(userId: string) {
	const params = {
		TableName: 'ONE_THE_LINE-Users', // DynamoDB 테이블 이름
		Key: {
			userId: { S: userId }, // 조회할 유저의 고유 ID
		},
	};

	try {
		const command = new GetItemCommand(params);
		const data = await ddbDocClient.send(command);

		// 유저가 있을 경우 JSON 형식으로 변환하여 반환, 없으면 null 반환
		if (data.Item) {
			return {
				userId: data.Item.userId.S,
				accessToken: data.Item.accessToken.S,
				name: data.Item.name.S,
				email: data.Item.email.S,
				createdAt: data.Item.createdAt.S,
			};
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error fetching user from DynamoDB:', error);
		throw new Error('Error fetching user');
	}
}

/**
 * 유저 정보를 저장하는 함수
 * @param {Object} user - 유저 정보 객체
 * @param {string} user.userId - 유저 고유 ID
 * @param {string} user.accessToken - 유저의 access token
 * @param {string} user.name - 유저 이름
 * @param {string} user.email - 유저 이메일
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
}) {
	const params = {
		TableName: 'ONE_THE_LINE-Users', // DynamoDB 테이블 이름
		Item: {
			userId: { S: userId },
			accessToken: { S: accessToken },
			name: { S: name },
			email: { S: email },
			createdAt: { S: new Date().toISOString() }, // 생성 시간 추가
		},
	};

	try {
		const command = new PutItemCommand(params);
		await ddbDocClient.send(command);
		console.log('User saved successfully:', userId);
	} catch (error) {
		console.error('Error saving user to DynamoDB:', error);
		throw new Error('Error saving user');
	}
}
