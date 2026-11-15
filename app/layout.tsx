import type { Metadata } from 'next';
import {
	Edu_VIC_WA_NT_Beginner,
	Noto_Sans_KR,
	Gothic_A1,
} from 'next/font/google';
import './globals.css';
import ClientProvider from '@/components/common/ClientProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/auth/authOptions';
import Header from '@/widgets/header/ui/Header';
import Footer from '@/widgets/footer/ui/Footer';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Gothic_A1({ weight: '300', subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'OneTheLine',
	description:
		'오늘 하루를 바꿀 최고의 문장을 기록하세요. OneTheLine은 사용자가 하루를 바꿀 한 줄의 문장을 기록하고 공유하는 서비스입니다. Google 로그인을 통해 나만의 문장을 저장하고 관리할 수 있습니다.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// 서버에서 세션을 미리 조회해 SessionProvider 초기값으로 전달
	// (인증 설정 오류가 있어도 로그인/에러 페이지는 렌더링되도록 비로그인으로 처리)
	const session = await getServerSession(authOptions).catch(() => null);

	return (
		<html lang="en">
			<meta
				name="google-site-verification"
				content="rKyVP7qe71HP3--SKVXkk6vGzw80qgZ-Z27rHWNwYlM"
			/>
			<body className={inter.className}>
				<ClientProvider session={session}>
					<div className="flex flex-col items-center w-full max-w-[640px] bg-[#F9FAFB] mx-auto h-[100dvh] overflow-hidden">
						<Header />
						<main className="w-full flex flex-1 flex-col overflow-scroll mb-3">
							{children}
						</main>
						<Footer />
					</div>
				</ClientProvider>
			</body>
			<GoogleAnalytics gaId="G-TC19MPLBYW" />
		</html>
	);
}
