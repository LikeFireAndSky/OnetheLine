'use client';

import LinkButton from '@/entities/line/ui/LinkButton';
import LogInButton from '@/processes/user/ui/LogInButton';
import React from 'react';
import { animated } from '@react-spring/web';
import { useFadeIn } from '@/shared/lib/useFadeIn';

// 화면에 필요한 계정 정보만 전달받음 (로그인하지 않았다면 null)
export type SettingAccount = {
	email: string;
};

interface SettingClientProps {
	account: SettingAccount | null;
}

export default function SettingClient({ account }: SettingClientProps) {
	const [ref, fadeIn] = useFadeIn();

	return (
		<animated.section
			ref={ref}
			style={fadeIn}
			className="w-full h-full flex flex-col px-4 pt-6 pb-8 space-y-5"
		>
			<div className="w-full flex flex-col gap-1">
				<h1 className="page-title">설정</h1>
				<p className="page-subtitle">계정과 약관을 확인하세요.</p>
			</div>

			<section className="paper w-full px-5 py-5">
				<h2 className="card-title">계정</h2>
				{/* 로그인했다면 이메일 표시 */}
				{account ? (
					<dl className="mt-3 text-[15px]">
						<dt className="eyebrow">이메일</dt>
						<dd className="mt-0.5 break-all text-ink">{account.email}</dd>
					</dl>
				) : (
					<p className="mt-2 text-[15px] text-ink-soft">로그인 해주세요.</p>
				)}

				{/* 로그인 / 로그아웃 버튼 */}
				<div className="mt-5">
					<LogInButton
						isAuthenticated={!!account}
						isLoading={false}
					/>
				</div>
			</section>

			<section className="paper w-full px-5 py-5">
				<h2 className="card-title">약관</h2>
				<div className="mt-4 grid gap-3">
					<LinkButton types="term" />
					<LinkButton types="privacy" />
				</div>
			</section>
		</animated.section>
	);
}
