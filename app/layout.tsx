import type { Metadata } from 'next';
import {
	Edu_VIC_WA_NT_Beginner,
	Noto_Sans_KR,
	Gothic_A1,
} from 'next/font/google';
import './globals.css';
import ClientProvider from '@/components/common/ClientProvider';
import { getSession } from '@/pages/api/auth/[...nextauth]';
import Header from '@/widgets/header/ui/Header';
import Footer from '@/widgets/footer/ui/Footer';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Gothic_A1({ weight: '300', subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'OneTheLine',
	description: '오늘 하루를 바꿀 최고의 문장을 기록하세요.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const server_session = getSession();

	return (
		<html lang="en">
			<meta
				name="google-site-verification"
				content="rKyVP7qe71HP3--SKVXkk6vGzw80qgZ-Z27rHWNwYlM"
			/>
			<body className={inter.className}>
				<ClientProvider session={server_session}>
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
