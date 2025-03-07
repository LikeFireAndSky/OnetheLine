// jest.config.js
module.exports = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1', // 별칭 '@/'를 프로젝트 루트로 매핑
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	},
	transform: {
		'^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
	},
	collectCoverage: true,
};
