/**
 * @jest-environment node
 */
const mockEnsureUser = jest.fn();
jest.mock('@/processes/user/api/saveUser', () => ({
	ensureUser: (...args: unknown[]) => mockEnsureUser(...args),
}));

process.env.COGNITO_ISSUER =
	'https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_TEST/';
process.env.COGNITO_CLIENT_ID = 'test-client-id';
process.env.COGNITO_CLIENT_SECRET = 'test-client-secret';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { authOptions } = require('@/shared/auth/authOptions');

const callbacks = authOptions.callbacks as any;
const account = {
	provider: 'cognito',
	type: 'oauth',
	providerAccountId: 'cognito-uuid',
	access_token: 'PROVIDER_ACCESS_TOKEN',
};
const googleIdentity = (userId: string) => [
	{ userId, providerName: 'Google', providerType: 'Google', primary: 'true' },
];

describe('authOptions', () => {
	beforeEach(() => {
		mockEnsureUser.mockReset().mockResolvedValue(undefined);
	});

	it('Cognito discovery 주소와 Google 바로가기 파라미터를 사용한다', () => {
		const [provider] = authOptions.providers;
		expect(provider.id).toBe('cognito');
		expect(provider.wellKnown).toBe(
			'https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_TEST/.well-known/openid-configuration',
		);
		expect(provider.options.authorization).toEqual({
			params: { scope: 'openid email profile', identity_provider: 'Google' },
		});
		expect(provider.options.checks).toEqual(['pkce', 'state']);
	});

	describe('signIn', () => {
		it('Google 연동 계정은 허용한다', async () => {
			const profile = { sub: 'cognito-uuid', identities: googleIdentity('1') };
			await expect(callbacks.signIn({ account, profile })).resolves.toBe(true);
		});

		it('Google identity가 없으면 거부한다', async () => {
			for (const identities of [
				undefined,
				'not json',
				[{ providerName: 'Facebook', userId: '9' }],
				[{ providerName: 'Google', userId: '' }],
			]) {
				await expect(
					callbacks.signIn({
						account,
						profile: { sub: 'cognito-uuid', identities },
					}),
				).resolves.toBe(false);
			}
		});

		it('cognito 이외의 프로바이더는 거부한다', async () => {
			await expect(
				callbacks.signIn({
					account: { ...account, provider: 'google' },
					profile: { identities: googleIdentity('1') },
				}),
			).resolves.toBe(false);
		});
	});

	describe('jwt', () => {
		it('기존 DynamoDB 키와 같도록 Google sub를 userId로 사용한다', async () => {
			const profile = {
				sub: 'cognito-uuid',
				name: '홍길동',
				email: 'user@example.com',
				identities: googleIdentity('109876543210987654321'),
			};
			const token = await callbacks.jwt({ token: {}, account, profile });

			expect(token.userId).toBe('109876543210987654321');
			expect(token.provider).toBe('Google');
			expect(token.name).toBe('홍길동');
			expect(token.email).toBe('user@example.com');
			expect(JSON.stringify(token)).not.toContain('PROVIDER_ACCESS_TOKEN');
			expect(mockEnsureUser).toHaveBeenCalledWith({
				userId: '109876543210987654321',
				name: '홍길동',
				email: 'user@example.com',
				provider: 'Google',
			});
		});

		it('identities가 JSON 문자열이어도 처리한다', async () => {
			const profile = {
				sub: 'cognito-uuid',
				identities: JSON.stringify(googleIdentity('42')),
			};
			const token = await callbacks.jwt({ token: {}, account, profile });
			expect(token.userId).toBe('42');
		});

		it('DynamoDB 저장이 실패해도 로그인은 계속된다', async () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const error = new Error('user@example.com');
			error.name = 'ResourceNotFoundException';
			mockEnsureUser.mockRejectedValue(error);

			const token = await callbacks.jwt({
				token: {},
				account,
				profile: { email: 'user@example.com', identities: googleIdentity('1') },
			});

			expect(token.userId).toBe('1');
			expect(JSON.stringify(spy.mock.calls)).not.toContain('user@example.com');
			spy.mockRestore();
		});

		it('로그인 이후 호출에서는 token을 그대로 둔다', async () => {
			const token = { userId: 'u', provider: 'Google' };
			await expect(callbacks.jwt({ token })).resolves.toBe(token);
			expect(mockEnsureUser).not.toHaveBeenCalled();
		});
	});

	it('session에는 userId만 추가한다', async () => {
		const session = { user: { name: 'a', email: 'b' }, expires: 'x' };
		const result = await callbacks.session({
			session,
			token: { userId: 'u', provider: 'Google', accessToken: 'SECRET' },
		});
		expect(result).toEqual({
			user: { name: 'a', email: 'b' },
			expires: 'x',
			userId: 'u',
		});
	});

	it('redirect는 같은 사이트 주소만 허용한다', async () => {
		const baseUrl = 'https://onetheline.xyz';
		await expect(callbacks.redirect({ url: '/log', baseUrl })).resolves.toBe(
			'https://onetheline.xyz/log',
		);
		await expect(
			callbacks.redirect({ url: 'https://evil.com', baseUrl }),
		).resolves.toBe(baseUrl);
		await expect(
			callbacks.redirect({ url: 'not a url', baseUrl }),
		).resolves.toBe(baseUrl);
	});
});
