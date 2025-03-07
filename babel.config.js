module.exports = {
	presets: [
		['@babel/preset-env', { targets: { node: 'current' } }],
		['@babel/preset-react', { runtime: 'automatic' }], // JSX 자동 변환
		'@babel/preset-typescript', // TypeScript 지원
	],
};
