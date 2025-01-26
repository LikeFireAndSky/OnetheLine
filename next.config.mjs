/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: '/api/naver/:path*',
				destination: 'https://openapi.naver.com/:path*',
			},
		];
	},
};

export default nextConfig;
