module.exports = {
	useRouter: () => ({
		push: jest.fn(), // 모킹된 push 함수
		pathname: '', // 기본 경로
		query: {}, // 쿼리 파라미터
		asPath: '', // 실제 경로
	}),
	usePathname: () => '/', // 현재 경로
	useSearchParams: () => new URLSearchParams(), // 검색 파라미터
};
