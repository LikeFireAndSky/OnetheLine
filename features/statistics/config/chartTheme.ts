import { bookCategoriesKor } from '@/features/create/config/bookEnrollmentConfig';

// 차트 공통 색/글자 (한지와 먹 테마, tailwind.config.ts 토큰과 같은 값)
export const CHART_COLORS = {
	ink: '#1F1D1A',
	inkSoft: '#3A3631',
	inkMuted: '#5E574E',
	rule: '#D9CEBA',
	paper: '#FAF7F0',
	seal: '#B5352B',
};

// 축 눈금 글자: 12px 이상으로 읽기 쉽게
export const CHART_TICK = {
	fill: CHART_COLORS.inkMuted,
	fontSize: 12,
};

// 순위별 막대 색 (카테고리 전통 색을 순서대로 사용)
export const RANK_COLORS = bookCategoriesKor.map(category => category.hex);
