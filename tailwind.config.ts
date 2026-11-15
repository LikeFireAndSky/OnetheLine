import type { Config } from 'tailwindcss';
const withMT = require('@material-tailwind/react/utils/withMT');

// 한지와 먹 테마: 서체는 app/layout.tsx의 next/font CSS 변수로 주입
const SANS = [
	'var(--font-sans)',
	'Noto Sans KR',
	'Apple SD Gothic Neo',
	'sans-serif',
];
const SERIF = ['var(--font-serif)', 'Gowun Batang', 'Nanum Myeongjo', 'serif'];

const config: Config = withMT({
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./processes/**/*.{js,ts,jsx,tsx,mdx}',
		'./entities/**/*.{js,ts,jsx,tsx,mdx}',
		'./features/**/*.{js,ts,jsx,tsx,mdx}',
		'./widgets/**/*.{js,ts,jsx,tsx,mdx}',
		'./shared/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		// withMT가 Material Tailwind 기본 서체(Roboto)를 이 값으로 교체함
		fontFamily: {
			sans: SANS,
			body: SANS,
			serif: SERIF,
		},
		extend: {
			colors: {
				// 한지(종이) 배경
				hanji: {
					DEFAULT: '#F3EEE4',
					light: '#FAF7F0',
					deep: '#E8E0D0',
				},
				// 먹(글자)
				ink: {
					DEFAULT: '#1F1D1A',
					soft: '#3A3631',
					muted: '#5E574E',
					faint: '#8A8277',
				},
				// 낙관(도장) 주홍
				seal: {
					DEFAULT: '#B5352B',
					deep: '#8E2820',
					wash: '#F3DEDA',
				},
				// 종이 위의 가는 선
				rule: '#D9CEBA',
				// 이용약관/개인정보 페이지의 표 테두리
				border: {
					sub: '#D9CEBA',
				},
			},
			fontSize: {
				// 이용약관/개인정보 페이지 제목
				h2: ['1.375rem', { lineHeight: '1.4', fontWeight: '700' }],
				h3: ['1.125rem', { lineHeight: '1.5', fontWeight: '700' }],
			},

			spacing: {
				g1: '23.6%',
				g2: '38.2%',
				g3: '61.8%',
				g4: '76.4%',
			},

			screens: {
				xs: '375px',
				sm: '443px',
				md: '640px',
			},
		},
	},
	plugins: [],
});

export default config;
