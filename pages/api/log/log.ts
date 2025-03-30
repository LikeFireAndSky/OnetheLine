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
	// ✅ 허용된 메서드 검사
	if (req.method !== 'DELETE') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// ✅ 인증된 사용자 정보 가져오기
	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user || !session.userId) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	const userId = session.userId;

	// ✅ 쿼리 파라미터 확인
	const { bookIsbn, sentenceId } = req.query;
	if (!userId || !bookIsbn || !sentenceId) {
		return res
			.status(400)
			.json({ message: 'Missing required query parameters' });
	}

	try {
		// 📦 해당 책에서 문장 데이터를 가져옴
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

		// 🎯 삭제 대상 문장을 찾기
		const target = contents.find((c: any) => c.M?.SentenceID?.S === sentenceId);
		if (!target || !target.M?.Timestamp?.N) {
			return res
				.status(404)
				.json({ message: 'Sentence not found or invalid format' });
		}

		// 🕒 타임스탬프 기반 시간 정보 계산
		const timestamp = Number(target.M.Timestamp.N);
		const date = new Date(timestamp);
		const yyyyMMdd = date.toISOString().slice(0, 10); // 예: 2025-03-30
		const hour = String(date.getHours()).padStart(2, '0'); // 예: 02
		const weekday = String(date.getDay()); // 일(0) ~ 토(6)

		// 📊 영향을 받는 통계 항목 구성
		const stats = [
			{ SK: `CATEGORY#${category}` },
			{ SK: `DATE#${yyyyMMdd}` },
			{
				SK: `BOOK#${bookIsbn}`,
				extra: bookTitle ? { BookTitle: { S: bookTitle } } : undefined,
			},
			{ SK: `HOUR#${hour}` },
			{ SK: `WEEKDAY#${weekday}` },
		];

		// 📉 통계 감소 처리 (Count -1) + 필요 시 항목 삭제
		for (const stat of stats) {
			try {
				// 🧾 기본 감소 파라미터 구성
				const attributeValues: Record<string, any> = {
					':decr': { N: '-1' },
				};

				// 책 제목이 있는 경우, BookTitle도 같이 갱신 (필수는 아님)
				if (stat.extra?.BookTitle?.S) {
					attributeValues[':title'] = { S: stat.extra.BookTitle.S };
				}

				// 1️⃣ Count -1 실행
				await ddbDocClient.send(
					new UpdateItemCommand({
						TableName: 'ONETHELINE_USER_STAT_SUMMARY',
						Key: {
							UserId: { S: userId },
							Statistic: { S: stat.SK },
						},
						UpdateExpression: stat.extra
							? 'ADD #count :decr SET BookTitle = :title'
							: 'ADD #count :decr',
						ExpressionAttributeNames: { '#count': 'Count' },
						ExpressionAttributeValues: attributeValues,
					}),
				);

				// 2️⃣ 감소 후 Count 값 확인
				const getStat = await ddbDocClient.send(
					new GetItemCommand({
						TableName: 'ONETHELINE_USER_STAT_SUMMARY',
						Key: {
							UserId: { S: userId },
							Statistic: { S: stat.SK },
						},
					}),
				);
				const currentCount = Number(getStat.Item?.Count?.N ?? '1');

				// 3️⃣ Count가 0이면 해당 항목 삭제
				if (currentCount <= 0) {
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

		// 🧼 Contents 배열에서 문장 삭제
		const updatedContents = contents.filter(
			(c: any) => c.M?.SentenceID?.S !== sentenceId,
		);

		if (updatedContents.length === 0) {
			// 문장이 다 사라졌으면 책 자체 삭제
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
			// 아니면 Contents 배열만 갱신
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
