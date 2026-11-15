'use client';

import axios from 'axios';

// 같은 출처의 Next.js API 라우트를 호출하므로 상대 경로를 사용합니다.
export const api = axios.create({
	baseURL: '/api',
});
