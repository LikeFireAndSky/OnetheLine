import {
	ConditionalCheckFailedException,
	PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { ddbDocClient } from '../lib/ddbDocClient';

const USERS_TABLE = 'ONE_THE_LINE-Users';

/**
 * 저장할 유저 정보 타입 정의 (프로바이더 토큰은 저장하지 않음)
 */
type EnsureUserParams = {
	userId: string;
	name: string;
	email: string;
	provider: string;
};

const isConditionalCheckFailed = (error: unknown): boolean =>
	error instanceof ConditionalCheckFailedException ||
	(error instanceof Error && error.name === 'ConditionalCheckFailedException');

/**
 * 유저가 없을 때만 저장 (이미 있으면 패스)
 * - 조회 후 저장 대신 조건부 PutItem 한 번으로 처리해 경쟁 상태를 방지
 * - DynamoDB 오류는 호출한 쪽에서 처리하도록 그대로 던짐
 */
export async function ensureUser({
	userId,
	name,
	email,
	provider,
}: EnsureUserParams): Promise<void> {
	const command = new PutItemCommand({
		TableName: USERS_TABLE,
		Item: {
			userId: { S: userId },
			name: { S: name },
			email: { S: email },
			provider: { S: provider },
			createdAt: { S: new Date().toISOString() },
		},
		ConditionExpression: 'attribute_not_exists(userId)',
	});

	try {
		await ddbDocClient.send(command);
	} catch (error) {
		// 이미 가입된 유저 → 정상 흐름
		if (isConditionalCheckFailed(error)) return;
		throw error;
	}
}
