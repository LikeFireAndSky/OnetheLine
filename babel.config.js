// babel.config.js
if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
	// 테스트 환경에서 Babel 설정 사용
	module.exports = {
		presets: [
			['@babel/preset-env', { targets: { node: 'current' } }],
			['@babel/preset-react', { runtime: 'automatic' }],
			'@babel/preset-typescript',
		],
	};
} else {
	// 프로덕션 빌드 시 Babel 설정 없이 SWC 사용
	module.exports = {};
}
