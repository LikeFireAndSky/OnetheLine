'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { Button, Card, CardBody } from '@material-tailwind/react';
import Image from 'next/image';
import GOOGLE_IMAGE from '@/public/images/btn_google.svg';
import NAVER_IMAGE from '@/public/images/btn_naver.svg';
import NEW_LOGO from '@/public/images/NEW_LOGO.png';

export default function LoginPage() {
	return (
		<Card className="flex w-4/5 mx-auto my-auto px-12 items-center justify-center">
			<CardBody className="w-full">
				<div className="w-full flex flex-col items-center space-y-12 pb-3">
					<Image
						src={NEW_LOGO}
						alt="OneTheLine 로고"
						className=" w-72 mx-auto border borer-1 rounded-full"
					/>
					<div>
						<h2 className="text-xl font-semibold text-center">
							OneTheLine 로그인
						</h2>
						<p>『하루를 바꾸는 단 한 줄』</p>
					</div>
				</div>
				{/* 아이디(일반) 로그인 버튼 */}
				<Button
					className="w-full flex h-14 font-light items-center gap-3 justify-center bg-white hover:bg-black hover:text-white text-black border border-black py-3 px-4 rounded transition mb-3"
					onClick={() => signIn('google', { redirect: true, callbackUrl: '/' })}
				>
					<Image
						src={GOOGLE_IMAGE}
						alt="구글 로그인"
						width={24}
					/>
					구글 아이디 로그인
				</Button>

				{/* 네이버 로그인 버튼 */}
				<Button
					className="w-full flex h-14 font-light items-center gap-3 justify-center bg-white hover:bg-green-600 hover:text-white text-black border border-green-500 py-3 px-4 rounded transition"
					onClick={() => signIn('naver', { redirect: true, callbackUrl: '/' })}
				>
					<Image
						src={NAVER_IMAGE}
						alt="구글 로그인"
						width={24}
					/>
					네이버 아이디 로그인
				</Button>
			</CardBody>
		</Card>
	);
}
