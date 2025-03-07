// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
	// Next.js의 기본 설정 파일 위치를 지정합니다.
	dir: './',
});

const customJestConfig = {
	testEnvironment: 'jest-environment-jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1', // 별칭 '@/'를 프로젝트 루트로 매핑
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	},
	collectCoverage: true,
};

module.exports = createJestConfig(customJestConfig);
