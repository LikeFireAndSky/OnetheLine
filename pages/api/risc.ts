import { NextApiRequest, NextApiResponse } from 'next';
import { importJWK, jwtVerify } from 'jose';

// Google의 RISC Discovery 정보
const RISC_ISSUER = 'https://accounts.google.com';
const JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

// 내 앱에서 사용하는 구글 OAuth Client ID (NextAuth와 동일)
const MY_GOOGLE_CLIENT_IDS = [
	process.env.GOOGLE_CLIENT_ID!,
	// 여러 플랫폼용 클라이언트 ID가 있다면 이 배열에 추가
];

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		// 1. POST 바디에서 JWT(보안 이벤트 토큰) 추출
		const token = req.body;
		// body가 JSON이 아니라 raw text일 수도 있으니,
		// 상황에 따라 req.body 설정 방법 확인이 필요할 수도 있음.
		// (Next.js에서 bodyParser가 json으로 세팅된 경우, token이 string인지 꼭 확인)

		// 2. Google의 JWKS(공개키) 가져오기
		const jwksResponse = await fetch(JWKS_URL);
		if (!jwksResponse.ok) {
			throw new Error('Failed to fetch Google JWKS');
		}
		const jwks = await jwksResponse.json();

		// 3. 토큰 헤더 파싱 (kid, alg)
		const [headerB64] = token.split('.');
		const headerJson = JSON.parse(
			Buffer.from(headerB64, 'base64').toString('utf-8'),
		);
		const { kid, alg } = headerJson;

		// 4. JWKS 중 일치하는 키 찾기
		const jwkCandidate = jwks.keys.find(
			(k: any) => k.kid === kid && k.alg === alg,
		);
		if (!jwkCandidate) {
			throw new Error(`No matching JWK found for kid=${kid}, alg=${alg}`);
		}

		// 5. 공개키 import
		const publicKey = await importJWK(jwkCandidate, alg);

		// 6. JWT 검증
		const { payload } = await jwtVerify(token, publicKey, {
			issuer: RISC_ISSUER,
			audience: MY_GOOGLE_CLIENT_IDS,
			// RISC는 exp(만료) 처리가 특별하므로 필요 시 ignoreExpiration 옵션 고려
		});

		console.log('RISC Payload:', payload);
		// 여기서 payload.sub, payload.events, iat 등 확인 가능

		// 7. 보안 이벤트 처리 로직
		// - payload.sub는 해당 사용자의 Google ID
		// - 해당 사용자가 우리 DB에 매핑되어 있으면, 세션 무효화/잠금 등
		//   ex) await myUserSecurityActions(payload.sub, payload.events);

		return res.status(200).json({ status: 'ok' });
	} catch (err) {
		console.error('RISC verification error:', err);
		return res.status(400).json({ error: 'Invalid token' });
	}
}
