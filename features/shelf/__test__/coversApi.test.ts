/**
 * @jest-environment node
 */
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/shared/auth/authOptions', () => ({ authOptions: {} }));

import { getServerSession } from 'next-auth';
import handler from '@/pages/api/books/covers';

const createRes = () => {
	const res: any = { statusCode: 200, headers: {}, body: undefined };
	res.status = (code: number) => {
		res.statusCode = code;
		return res;
	};
	res.json = (body: unknown) => {
		res.body = body;
		return res;
	};
	res.setHeader = (key: string, value: string) => {
		res.headers[key] = value;
	};
	return res;
};

const naverResponse = (items: unknown[], ok = true, status = 200) =>
	({ ok, status, json: async () => ({ items }) }) as Response;

describe('GET /api/books/covers', () => {
	const fetchMock = jest.fn();

	beforeEach(() => {
		process.env.NAVER_SEARCH_CLIENT_ID = 'id';
		process.env.NAVER_SEARCH_CLIENT_SECRET = 'secret';
		global.fetch = fetchMock as unknown as typeof fetch;
		fetchMock.mockReset();
		(getServerSession as jest.Mock).mockResolvedValue({ user: { name: 'a' } });
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => jest.restoreAllMocks());

	it('GET 이외의 요청은 405', async () => {
		const res = createRes();
		await handler({ method: 'POST', query: {} } as any, res);
		expect(res.statusCode).toBe(405);
	});

	it('로그인하지 않으면 네이버를 호출하지 않고 401', async () => {
		(getServerSession as jest.Mock).mockResolvedValue(null);
		const res = createRes();
		await handler(
			{ method: 'GET', query: { isbns: '9788937460449' } } as any,
			res,
		);
		expect(res.statusCode).toBe(401);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('isbns가 없거나 배열이면 400', async () => {
		for (const isbns of [undefined, '', ['a', 'b']]) {
			const res = createRes();
			await handler({ method: 'GET', query: { isbns } } as any, res);
			expect(res.statusCode).toBe(400);
		}
	});

	it('ISBN이 일치하는 표지만 돌려주고, 다른 책이 검색되면 null', async () => {
		fetchMock.mockImplementation(async (url: string) => {
			const query = new URL(url).searchParams.get('query');
			if (query === '9788937460449') {
				return naverResponse([
					{
						isbn: '8937460440 9788937460449',
						image: 'https://shopping-phinf.pstatic.net/a.jpg',
					},
				]);
			}
			// 다른 책이 검색된 경우
			return naverResponse([
				{
					isbn: '9791111111111',
					image: 'https://shopping-phinf.pstatic.net/b.jpg',
				},
			]);
		});

		const res = createRes();
		await handler(
			{
				method: 'GET',
				// 같은 책 중복과 '10자리 13자리' 형식을 정리해서 조회
				query: {
					isbns: '8937460440 9788937460449,9788937460449,9788900000000',
				},
			} as any,
			res,
		);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			covers: {
				'9788937460449': 'https://shopping-phinf.pstatic.net/a.jpg',
				'9788900000000': null,
			},
		});
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(fetchMock.mock.calls[0][1].headers).toEqual({
			'X-Naver-Client-Id': 'id',
			'X-Naver-Client-Secret': 'secret',
		});
		expect(res.headers['Cache-Control']).toBe('private, max-age=86400');
	});

	it('네이버 오류나 http 표지 주소는 null로 처리', async () => {
		fetchMock
			.mockResolvedValueOnce(naverResponse([], false, 429))
			.mockResolvedValueOnce(
				naverResponse([
					{ isbn: '9788900000000', image: 'http://insecure/a.jpg' },
				]),
			);
		const res = createRes();
		await handler(
			{ method: 'GET', query: { isbns: '9788937460449,9788900000000' } } as any,
			res,
		);
		expect(res.body).toEqual({
			covers: { '9788937460449': null, '9788900000000': null },
		});
	});

	it('네이버 키가 없으면 500', async () => {
		delete process.env.NAVER_SEARCH_CLIENT_SECRET;
		const res = createRes();
		await handler(
			{ method: 'GET', query: { isbns: '9788937460449' } } as any,
			res,
		);
		expect(res.statusCode).toBe(500);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
