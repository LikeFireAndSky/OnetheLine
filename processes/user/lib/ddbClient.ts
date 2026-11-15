import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// 테이블이 있는 리전. AWS_REGION은 Lambda가 실행 리전으로 자동 설정하므로 사용하지 않습니다.
const REGION = process.env.DYNAMODB_REGION ?? 'ap-northeast-2';

const accessKeyId = process.env.NEXT_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_AWS_SECRET_ACCESS_KEY;

// 레거시 정적 키는 두 값이 모두 있을 때만 사용하고, 없으면 SDK 기본 체인(IAM 역할)으로 인증합니다.
const ddbClient = new DynamoDBClient({
	region: REGION,
	...(accessKeyId && secretAccessKey
		? { credentials: { accessKeyId, secretAccessKey } }
		: {}),
});

export { ddbClient };
