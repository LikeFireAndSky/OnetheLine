'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import {
	Button,
	Card,
	CardBody,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
} from '@material-tailwind/react';
import Image from 'next/image';
import GOOGLE_IMAGE from '@/public/images/btn_google.svg';
import NAVER_IMAGE from '@/public/images/btn_naver.svg';
import NEW_LOGO from '@/public/images/NEW_LOGO.png';
import Link from 'next/link';

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

		// 일반 브라우저 → 정상 로그인
		signIn('google', { redirect: true, callbackUrl: '/' });
	};

	return (
		<>
			<Card className="flex w-4/5 mx-auto my-auto px-12 items-center justify-center">
				<CardBody className="w-full">
					<div className="w-full flex flex-col items-center space-y-12 pb-3">
						<Image
							src={NEW_LOGO}
							alt="OneTheLine 로고"
							className="w-72 mx-auto border border-1 rounded-full"
						/>
						<div>
							<h2 className="text-lg font-semibold text-center">
								OneTheLine 로그인
							</h2>
							<p className="text-sm">『하루를 바꾸는 단 한 줄』</p>
						</div>
					</div>

					{/* 구글 로그인 버튼 */}
					<Button
						className="w-full flex h-14 font-light items-center gap-3 justify-center bg-white hover:bg-black hover:text-white text-black border border-black py-3 px-4 rounded transition mb-3"
						onClick={handleGoogleLogin}
					>
						<Image
							src={GOOGLE_IMAGE}
							alt="구글 로그인"
							width={24}
						/>
						<span>구글 로그인</span>
					</Button>

					{/* 네이버 로그인 버튼 → 별도 제한 없음 */}
					<Button
						className="w-full flex h-14 font-light items-center gap-3 justify-center bg-white hover:bg-green-600 hover:text-white text-black border border-green-500 py-3 px-4 rounded transition"
						onClick={() =>
							signIn('naver', { redirect: true, callbackUrl: '/' })
						}
					>
						<Image
							src={NAVER_IMAGE}
							alt="네이버 로그인"
							width={24}
						/>
						<span>네이버 로그인</span>
					</Button>

					<div className="flex flex-col gap-y-3 py-3 items-center">
						<button onClick={handleOpen}>OneTheLine 소개</button>
						<Link href={'/term'}>서비스 이용약관</Link>
						<Link href={'/privacy'}>개인정보 처리방침</Link>
					</div>
				</CardBody>
			</Card>

			{/* 앱 정보 모달 */}
			<Dialog
				open={open}
				handler={setOpen}
			>
				<DialogHeader>OneTheLine이란?</DialogHeader>
				<DialogBody
					divider
					className=" font-light text-sm"
				>
					OneTheLine은 사용자가 하루를 바꿀 한 줄의 문장을 기록하고 공유하는
					서비스입니다.
					<strong className=" font-semibold"> Google 로그인 </strong> 또는{' '}
					<strong className="font-semibold">Naver 로그인</strong>을 통해
					개인화된 경험을 제공하며, 사용자의 문장을 안전하게 저장합니다.
				</DialogBody>
				<DialogFooter>
					<Button
						variant="gradient"
						color="black"
						onClick={handleClose}
					>
						닫기
					</Button>
				</DialogFooter>
			</Dialog>
		</>
	);
}
