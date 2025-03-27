import type { Config } from 'tailwindcss';
const withMT = require('@material-tailwind/react/utils/withMT');

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
		extend: {
			colors: {
				main: '#FF9800',
				sub: '#FF6E2F',
				coffee: '#FFE59FFF',
				grayey: '#B8B8B8FF',
				greeney: '#C6DFD6',
				pinkey: '#FFDADAFF',
				// 'businessBlue'는 "경제/비즈니스" 카테고리용 임의 키워드
				businessBlue: '#4E5FBF',
				// 'scienceNavy'는 "과학/기술" 카테고리용 임의 키워드
				scienceNavy: '#1D3159',
				// 'selfHelpGreen'은 "자기계발/심리" 카테고리용 임의 키워드
				selfHelpGreen: '#8DA633',
				// 'societyGold'는 "사회/환경" 카테고리용 임의 키워드
				societyGold: '#F2B544',
				// 'literatureOrange'는 "문학/예술" 카테고리용 임의 키워드
				literatureOrange: '#D9763D',
			},
			backgroundImage: {
				// 흰색에서 시작해 80% 지점까지 흰색, 이후 해당 카테고리 색상으로 전환
				'gradient-business':
					'linear-gradient(137deg, #ffffff 61.8%, #4E5FBF 176.4%)',
				'gradient-science':
					'linear-gradient(137deg, #ffffff 61.8%, #1D3159 176.4%)',
				'gradient-selfhelp':
					'linear-gradient(137deg, #ffffff 61.8%, #8DA633 176.4%)',
				'gradient-society':
					'linear-gradient(137deg, #ffffff 61.8%, #F2B544 176.4%)',
				'gradient-literature':
					'linear-gradient(137deg, #ffffff 61.8%, #D9763D 176.4%)',
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

		iconButton: {
			defaultProps: {
				variant: 'filled',
				size: 'md',
				color: 'blue',
				fullWidth: true,
				ripple: true,
				className: '',
			},
		},
	},
	plugins: [],
});

export default config;
