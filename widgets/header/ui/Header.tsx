import Image from 'next/image';
import React from 'react';
import LOGO_IMAGE from '@/public/images/MAIN_LOGO.png';
import Link from 'next/link';
import PenMark from '@/shared/ui/PenMark';

const Header = () => {
	return (
		<header className="w-full flex justify-between items-center px-4 h-16 border-b border-rule">
			<Link
				href="/"
				aria-label="OneTheLine 홈으로"
			>
				<Image
					src={LOGO_IMAGE}
					alt="OneTheLine"
					className="w-32"
					priority
				/>
			</Link>
			{/* 펜: 한 줄 기록 화면으로 이동 */}
			<Link
				href="/log"
				aria-label="한 줄 기록하기"
				className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-hanji-deep"
			>
				<PenMark className="h-6 w-6" />
			</Link>
		</header>
	);
};

export default Header;
