'use client';

import React, { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import {
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
} from '@material-tailwind/react';
import Image from 'next/image';
import GOOGLE_IMAGE from '@/public/images/btn_google.svg';
import NEW_LOGO from '@/public/images/NEW_LOGO.png';
import Link from 'next/link';
import Seal from '@/shared/ui/Seal';

// 👉 로그인 후 돌아갈 주소: 같은 사이트 주소만 허용하고 경로로 변환
// (로그인 실패 후 next-auth가 되돌려 주는 절대 주소도 같은 사이트면 허용)
const getSafeCallbackUrl = (raw: string | null): string => {
	if (!raw) return '/';
	// '//evil.com', '/\evil.com' 같은 외부 주소 차단
	if (raw.startsWith('//') || raw.startsWith('/\\')) return '/';
	try {
		const url = new URL(raw, window.location.origin);
		if (url.origin !== window.location.origin) return '/';
		const path = `${url.pathname}${url.search}${url.hash}`;
		// 로그인 페이지로 되돌아오는 루프 방지
		return path.startsWith('/user-login') ? '/' : path;
	} catch {
		return '/';
	}
};

// 👉 next-auth 에러 코드별 안내 문구 (쿼리 값은 화면에 그대로 출력하지 않음)
const getLoginErrorMessage = (error: string): string => {
	switch (error) {
		case 'OAuthSignin':
			return '로그인을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.';
		case 'OAuthCallback':
		case 'Callback':
			return '로그인 처리 중 문제가 발생했어요. 다시 시도해 주세요.';
		case 'AccessDenied':
			return '로그인이 취소되었거나 접근이 거부되었어요.';
		case 'SessionRequired':
			return '로그인이 필요한 페이지예요. 먼저 로그인해 주세요.';
		case 'Configuration':
			return '로그인 설정에 문제가 있어요. 잠시 후 다시 시도해 주세요.';
		default:
			return '로그인 중 문제가 발생했어요. 다시 시도해 주세요.';
	}
};

// 👉 ?error= 쿼리가 있을 때만 안내 문구 표시 (useSearchParams는 Suspense 안에서 사용)
const LoginErrorMessage = () => {
	const searchParams = useSearchParams();
	const error = searchParams?.get('error');

	if (!error) return null;

	return (
		<p
			role="alert"
			className="w-full mb-3 rounded-sm border border-seal/30 bg-seal-wash px-3 py-2 text-[14px] text-center text-seal-deep"
		>
			{getLoginErrorMessage(error)}
		</p>
	);
};

export default function LoginPage() {
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// 👉 인앱 브라우저 감지 함수
	const detectInAppBrowser = (userAgent: string): string | null => {
		const ua = userAgent.toLowerCase();
		if (ua.includes('instagram')) return 'Instagram';
		if (ua.includes('fbav') || ua.includes('fban')) return 'Facebook';
		if (ua.includes('kakaotalk')) return 'KakaoTalk';
		if (ua.includes('naver')) return 'Naver';
		if (ua.includes('line')) return 'Line';
		if (ua.includes('tiktok')) return 'TikTok';
		return null;
	};

	// 👉 구글 로그인 버튼 클릭 핸들러
	const handleGoogleLogin = () => {
		const userAgent = navigator.userAgent;
		const inApp = detectInAppBrowser(userAgent);

		if (inApp) {
			alert(
				`${inApp} 앱 내 브라우저에서는 "안전한 Google 로그인"을 위하여 외부 브라우저로 열어주세요 (우측 상단 점 3개를 눌러봐주세요!! 🙃)`,
			);
			return; // 로그인 중단
		}

		// 일반 브라우저 → Cognito(Google) 로그인 후 원래 페이지로 이동
		const callbackUrl = getSafeCallbackUrl(
			new URLSearchParams(window.location.search).get('callbackUrl'),
		);
		signIn('cognito', { redirect: true, callbackUrl });
	};

	return (
		<>
			<section className="flex w-full flex-1 items-center justify-center px-4 py-8">
				<div className="paper w-full max-w-sm px-7 pt-9 pb-7">
					<div className="flex flex-col items-center">
						<div className="relative">
							<Image
								src={NEW_LOGO}
								alt="OneTheLine 로고"
								className="w-40 rounded-full border border-rule bg-hanji-light"
								priority
							/>
							<Seal
								size="md"
								className="absolute -bottom-1 -right-2"
							/>
						</div>
						<h1 className="mt-6 font-serif text-[22px] font-bold text-ink">
							OneTheLine
						</h1>
						<p className="mt-1 font-serif text-[15px] text-ink-muted">
							『하루를 바꾸는 단 한 줄』
						</p>
					</div>

					<div className="mt-8">
						{/* 로그인 실패 안내 */}
						<Suspense fallback={null}>
							<LoginErrorMessage />
						</Suspense>

						{/* 구글 로그인 버튼 */}
						<button
							type="button"
							className="btn-line h-14 gap-3 bg-hanji-light"
							onClick={handleGoogleLogin}
						>
							<Image
								src={GOOGLE_IMAGE}
								alt=""
								width={22}
							/>
							<span>Google로 로그인</span>
						</button>
					</div>

					<nav
						aria-label="서비스 안내"
						className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-ink-muted"
					>
						<button
							type="button"
							onClick={handleOpen}
							className="underline-offset-4 hover:text-ink hover:underline"
						>
							OneTheLine 소개
						</button>
						<Link
							href={'/term'}
							className="underline-offset-4 hover:text-ink hover:underline"
						>
							서비스 이용약관
						</Link>
						<Link
							href={'/privacy'}
							className="underline-offset-4 hover:text-ink hover:underline"
						>
							개인정보 처리방침
						</Link>
					</nav>
				</div>
			</section>

			{/* 앱 정보 모달 */}
			<Dialog
				open={open}
				handler={setOpen}
				size="sm"
				className="rounded-sm bg-hanji-light"
			>
				<DialogHeader className="font-serif text-[19px] font-bold text-ink">
					OneTheLine이란?
				</DialogHeader>
				<DialogBody className="pt-0 text-[15px] leading-relaxed text-ink-soft">
					OneTheLine은 사용자가 하루를 바꿀 한 줄의 문장을 기록하고 공유하는
					서비스입니다.
					<strong className="font-bold text-ink"> Google 로그인</strong>을 통해
					개인화된 경험을 제공하며, 사용자의 문장을 안전하게 저장합니다.
				</DialogBody>
				<DialogFooter>
					<button
						type="button"
						className="btn-ink h-11"
						onClick={handleClose}
					>
						닫기
					</button>
				</DialogFooter>
			</Dialog>
		</>
	);
}
