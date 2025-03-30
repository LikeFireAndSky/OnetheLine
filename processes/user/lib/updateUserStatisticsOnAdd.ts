import { UpdateItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';

export async function updateUserStatisticsOnAdd({
	userId,
	category,
	bookIsbn,
	bookTitle,
	timestamp,
}: {
	userId: string;
	category: string;
	bookIsbn: string;
	bookTitle: string;
	timestamp: number;
}) {
	const dateObj = new Date(timestamp);
	const yyyyMMdd = dateObj.toISOString().slice(0, 10);
	const hour = dateObj.getHours().toString().padStart(2, '0');
	const weekday = dateObj.getDay().toString(); // 0(Sun) ~ 6(Sat)

	const dateKey = {
		UserId: { S: userId },
		Statistic: { S: `DATE#${yyyyMMdd}` },
	};

	// ✅ 1. 기존 누적 값 조회
	let previousCumulative = 0;
	try {
		const { Item } = await ddbDocClient.send(
			new GetItemCommand({
				TableName: 'ONETHELINE_USER_STAT_SUMMARY',
				Key: dateKey,
				ProjectionExpression: 'Cumulative',
			}),
		);
		if (Item && Item.Cumulative?.N) {
			previousCumulative = parseInt(Item.Cumulative.N);
		}
	} catch (err) {
		console.error('⚠️ Failed to fetch existing cumulative:', err);
	}

	const updatedCumulative = previousCumulative + 1;

	// ✅ 2. 통계 업데이트 명령 리스트
	const commands = [
		// 📌 카테고리별
		new UpdateItemCommand({
			TableName: 'ONETHELINE_USER_STAT_SUMMARY',
			Key: {
				UserId: { S: userId },
				Statistic: { S: `CATEGORY#${category}` },
			},
			UpdateExpression: 'ADD #count :incr',
			ExpressionAttributeNames: { '#count': 'Count' },
			ExpressionAttributeValues: { ':incr': { N: '1' } },
		}),

		// 📌 날짜별 + 누적 합계
		new UpdateItemCommand({
			TableName: 'ONETHELINE_USER_STAT_SUMMARY',
			Key: dateKey,
			UpdateExpression: 'ADD #count :incr SET Cumulative = :cum',
			ExpressionAttributeNames: { '#count': 'Count' },
			ExpressionAttributeValues: {
				':incr': { N: '1' },
				':cum': { N: updatedCumulative.toString() },
			},
		}),

		// 📌 책별
		new UpdateItemCommand({
			TableName: 'ONETHELINE_USER_STAT_SUMMARY',
			Key: {
				UserId: { S: userId },
				Statistic: { S: `BOOK#${bookIsbn}` },
			},
			UpdateExpression: 'ADD #count :incr SET BookTitle = :bookTitle',
			ExpressionAttributeNames: { '#count': 'Count' },
			ExpressionAttributeValues: {
				':incr': { N: '1' },
				':bookTitle': { S: bookTitle },
			},
		}),

		// 📌 시간대별
		new UpdateItemCommand({
			TableName: 'ONETHELINE_USER_STAT_SUMMARY',
			Key: {
				UserId: { S: userId },
				Statistic: { S: `HOUR#${hour}` },
			},
			UpdateExpression: 'ADD #count :incr',
			ExpressionAttributeNames: { '#count': 'Count' },
			ExpressionAttributeValues: { ':incr': { N: '1' } },
		}),

		// 📌 요일별
		new UpdateItemCommand({
			TableName: 'ONETHELINE_USER_STAT_SUMMARY',
			Key: {
				UserId: { S: userId },
				Statistic: { S: `WEEKDAY#${weekday}` },
			},
			UpdateExpression: 'ADD #count :incr',
			ExpressionAttributeNames: { '#count': 'Count' },
			ExpressionAttributeValues: { ':incr': { N: '1' } },
		}),
	];

	// ✅ 병렬로 실행
	await Promise.all(commands.map(cmd => ddbDocClient.send(cmd)));
}
