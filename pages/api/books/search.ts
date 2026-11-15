// pages/api/books/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/auth/authOptions';

const NAVER_BOOK_SEARCH_URL = 'https://openapi.naver.com/v1/search/book.json';
const MAX_QUERY_LENGTH = 100;
const UPSTREAM_TIMEOUT_MS = 5000;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// GET 요청만 허용
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET');
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	// 로그인한 사용자만 검색 가능 (네이버 API 키 남용 방지)
	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	// 검색어 검증: 단일 문자열, 공백 제거 후 1~100자
	const { query } = req.query;
	if (typeof query !== 'string') {
		return res.status(400).json({ message: 'Invalid query' });
	}
	const trimmedQuery = query.trim();
	if (trimmedQuery.length < 1 || trimmedQuery.length > MAX_QUERY_LENGTH) {
		return res.status(400).json({ message: 'Invalid query' });
	}

	// 네이버 검색 API 키는 서버 환경변수에서만 읽음
	const clientId = process.env.NAVER_SEARCH_CLIENT_ID;
	const clientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;
	if (!clientId || !clientSecret) {
		console.error('Naver book search is not configured');
		return res.status(500).json({ message: 'Internal Server Error' });
	}

	const params = new URLSearchParams({
		query: trimmedQuery,
		display: '10',
		sort: 'sim',
	});

	try {
		const upstream = await fetch(`${NAVER_BOOK_SEARCH_URL}?${params}`, {
			method: 'GET',
			headers: {
				'X-Naver-Client-Id': clientId,
				'X-Naver-Client-Secret': clientSecret,
			},
			signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
		});

		if (!upstream.ok) {
			// 업스트림 에러 본문은 노출/기록하지 않고 상태 코드만 기록
			console.error('Naver book search failed with status', upstream.status);
			return res.status(502).json({ message: 'Book search failed' });
		}

		const data = await upstream.json();
		return res.status(200).json(data);
	} catch (error) {
		// 타임아웃/네트워크 오류 등: 에러 종류만 기록
		console.error(
			'Naver book search request error',
			error instanceof Error ? error.name : 'UnknownError',
		);
		return res.status(502).json({ message: 'Book search failed' });
	}
}
