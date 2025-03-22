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
