import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';
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

	const commands = [
		// 카테고리별
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

		// 날짜별
		new UpdateItemCommand({
			TableName: 'ONETHELINE_USER_STAT_SUMMARY',
			Key: {
				UserId: { S: userId },
				Statistic: { S: `DATE#${yyyyMMdd}` },
			},
			UpdateExpression: 'ADD #count :incr',
			ExpressionAttributeNames: { '#count': 'Count' },
			ExpressionAttributeValues: { ':incr': { N: '1' } },
		}),

		// 책별
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

		// 시간대별
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

		// 요일별
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

	await Promise.all(commands.map(cmd => ddbDocClient.send(cmd)));
}
