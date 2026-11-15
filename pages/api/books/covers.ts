import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/auth/authOptions';
import { normalizeIsbn } from '@/shared/lib/isbn';

const NAVER_BOOK_SEARCH_URL = 'https://openapi.naver.com/v1/search/book.json';
// 한 번에 조회할 수 있는 최대 권수 (네이버 검색 API 할당량 보호)
const MAX_ISBNS = 10;

/**
 * ISBN으로 네이버 책 검색을 해서 표지 이미지 주소를 찾음
 * - 검색 결과가 다른 책이면(ISBN 불일치) 버림
 */
const fetchCover = async (
	isbn: string,
	clientId: string,
	clientSecret: string,
): Promise<string | null> => {
	try {
		const params = new URLSearchParams({ query: isbn, display: '1' });
		const response = await fetch(`${NAVER_BOOK_SEARCH_URL}?${params}`, {
			headers: {
				'X-Naver-Client-Id': clientId,
				'X-Naver-Client-Secret': clientSecret,
			},
			signal: AbortSignal.timeout(5000),
		});
		if (!response.ok) {
			console.error('Book cover lookup failed', response.status);
			return null;
		}
		const body = await response.json();
		const item = body?.items?.[0];
		if (!item || !String(item.isbn ?? '').includes(isbn)) return null;
		return typeof item.image === 'string' && item.image.startsWith('https://')
			? item.image
			: null;
	} catch (error) {
		console.error(
			'Book cover lookup failed',
			error instanceof Error ? error.name : 'UnknownError',
		);
		return null;
	}
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET');
		return res.status(405).json({ message: 'Method not allowed' });
	}

	// 로그인한 사용자만 사용 (네이버 검색 할당량 보호)
	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const raw = req.query.isbns;
	if (typeof raw !== 'string' || raw.length === 0 || raw.length > 400) {
		return res.status(400).json({ message: 'Invalid isbns' });
	}

	const isbns = Array.from(
		new Set(
			raw
				.split(',')
				.map(normalizeIsbn)
				.filter((isbn): isbn is string => isbn !== null),
		),
	).slice(0, MAX_ISBNS);

	const clientId = process.env.NAVER_SEARCH_CLIENT_ID;
	const clientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;
	if (!clientId || !clientSecret) {
		console.error('Naver search credentials are not configured');
		return res.status(500).json({ message: 'Cover lookup unavailable' });
	}

	const entries = await Promise.all(
		isbns.map(
			async isbn =>
				[isbn, await fetchCover(isbn, clientId, clientSecret)] as const,
		),
	);

	// 표지는 사용자별로 달라지지 않지만 로그인 응답이므로 브라우저에만 하루 캐시
	res.setHeader('Cache-Control', 'private, max-age=86400');
	return res.status(200).json({ covers: Object.fromEntries(entries) });
}
