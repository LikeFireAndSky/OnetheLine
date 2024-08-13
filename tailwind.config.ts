import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				main: '#FF9800',
				sub: '#FF6E2F',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
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
};
export default config;
