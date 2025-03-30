// 기존 import 유지
import { ddbDocClient } from '@/processes/user/lib/ddbDocClient';
import {
	UpdateItemCommand,
	DeleteItemCommand,
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
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user || !session.userId) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	const userId = session.userId;
	const { bookIsbn, sentenceId } = req.query;
	if (!userId || !bookIsbn || !sentenceId) {
		return res
			.status(400)
			.json({ message: 'Missing required query parameters' });
	}

	try {
		const { Item } = await ddbDocClient.send(
			new GetItemCommand({
				TableName: 'LOG_ARCHIVE_BY_USER',
				Key: {
					UserId: { S: userId },
					BookId: { S: bookIsbn as string },
				},
			}),
		);

		if (!Item) return res.status(404).json({ message: 'Item not found' });

		const bookTitle = Item.BookTitle?.S;
		const category = Item.Category?.S;
		const contents = Item.Contents?.L || [];

		const target = contents.find((c: any) => c.M?.SentenceID?.S === sentenceId);
		if (!target || !target.M?.Timestamp?.N) {
			return res
				.status(404)
				.json({ message: 'Sentence not found or invalid format' });
		}

		const timestamp = Number(target.M.Timestamp.N);
		const date = new Date(timestamp);
		const yyyyMMdd = date.toISOString().slice(0, 10);
		const hour = String(date.getHours()).padStart(2, '0');
		const weekday = String(date.getDay());

		// 📊 누적 감소할 통계 항목
		const stats = [
			{ SK: `CATEGORY#${category}` },
			{
				SK: `BOOK#${bookIsbn}`,
				extra: bookTitle ? { BookTitle: { S: bookTitle } } : undefined,
			},
			{ SK: `HOUR#${hour}` },
			{ SK: `WEEKDAY#${weekday}` },
			// ✅ 날짜별은 Count와 Cumulative 둘 다 관리
			{ SK: `DATE#${yyyyMMdd}`, cumulative: true },
		];

		// 📉 통계 감소 및 삭제 처리
		for (const stat of stats) {
			try {
				const updateExpr = ['ADD #count :decr'];
				const exprNames = { '#count': 'Count' };
				const exprValues: Record<string, any> = { ':decr': { N: '-1' } };

				if (stat.extra?.BookTitle?.S) {
					updateExpr.push('SET BookTitle = :title');
					exprValues[':title'] = { S: stat.extra.BookTitle.S };
				}

				if (stat.cumulative) {
					updateExpr.push('ADD Cumulative :decr'); // 누적도 감소
				}

				// 📤 Update 실행
				await ddbDocClient.send(
					new UpdateItemCommand({
						TableName: 'ONETHELINE_USER_STAT_SUMMARY',
						Key: {
							UserId: { S: userId },
							Statistic: { S: stat.SK },
						},
						UpdateExpression: updateExpr.join(' '),
						ExpressionAttributeNames: exprNames,
						ExpressionAttributeValues: exprValues,
					}),
				);

				// 📦 현재 값 확인
				const { Item: updatedStat } = await ddbDocClient.send(
					new GetItemCommand({
						TableName: 'ONETHELINE_USER_STAT_SUMMARY',
						Key: {
							UserId: { S: userId },
							Statistic: { S: stat.SK },
						},
					}),
				);

				const currentCount = Number(updatedStat?.Count?.N ?? '1');
				const currentCumulative = Number(updatedStat?.Cumulative?.N ?? '1');

				const shouldDelete =
					currentCount <= 0 && (!stat.cumulative || currentCumulative <= 0);

				if (shouldDelete) {
					await ddbDocClient.send(
						new DeleteItemCommand({
							TableName: 'ONETHELINE_USER_STAT_SUMMARY',
							Key: {
								UserId: { S: userId },
								Statistic: { S: stat.SK },
							},
						}),
					);
				}
			} catch (err) {
				console.error(`❌ Failed to update/delete stat ${stat.SK}`, err);
			}
		}

		// 📚 문장 삭제
		const updatedContents = contents.filter(
			(c: any) => c.M?.SentenceID?.S !== sentenceId,
		);

		if (updatedContents.length === 0) {
			await ddbDocClient.send(
				new DeleteItemCommand({
					TableName: 'LOG_ARCHIVE_BY_USER',
					Key: {
						UserId: { S: userId },
						BookId: { S: bookIsbn as string },
					},
				}),
			);
			return res.status(200).json({ message: 'Item deleted successfully' });
		} else {
			const updateResponse = await ddbDocClient.send(
				new UpdateItemCommand({
					TableName: 'LOG_ARCHIVE_BY_USER',
					Key: {
						UserId: { S: userId },
						BookId: { S: bookIsbn as string },
					},
					UpdateExpression: 'SET Contents = :updatedContents',
					ExpressionAttributeValues: {
						':updatedContents': { L: updatedContents },
					},
					ReturnValues: 'ALL_NEW',
				}),
			);
			return res.status(200).json({
				message: 'Sentence deleted successfully',
				data: updateResponse.Attributes,
			});
		}
	} catch (error) {
		console.error('❌ Failed to delete sentence:', error);
		return res
			.status(500)
			.json({ message: 'Failed to delete sentence', error });
	}
}
