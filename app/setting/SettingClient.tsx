'use client';

import LinkButton from '@/entities/line/ui/LinkButton';
import LogInButton from '@/processes/user/ui/LogInButton';
import React from 'react';
import { Card, CardFooter, CardBody } from '@material-tailwind/react';
import { useInView, animated } from '@react-spring/web';

interface SettingClientProps {
	session: any; // 실제로는 NextAuth Session 타입을 지정해도 됨
}

export default function SettingClient({ session }: SettingClientProps) {
	// React Spring 설정
	const [ref, inView] = useInView(() => ({
		from: { opacity: 0 },
		to: { opacity: 1 },
		config: {
			mass: 5,
			friction: 120,
			tension: 120,
		},
	}));

	return (
		<animated.section
			ref={ref}
			style={inView}
			className="w-full h-full flex flex-col p-3 mt-3 space-y-5"
		>
			<div className="w-full flex flex-col space-y-1">
				<Card className="w-full flex p-3">
					<CardBody>
						<h1 className="text-2xl font-semibold text-black">Setting</h1>
						<p className="text-base">설정</p>

						{/* 세션이 있다면 이름/이메일 표시 */}
						{session?.user ? (
							<div className="my-3">
								<h1 className="text-2xl font-semibold text-black">Account</h1>

								<div className="text-sm">
									<p className="text-base">계정</p>
									<strong>Email:</strong> {session.user.email}
								</div>
							</div>
						) : (
							<p className="text-sm mt-3">로그인 해주세요.</p>
						)}

						{/* 로그인 / 로그아웃 버튼 */}
						<LogInButton
							isAuthenticated={!!session?.user}
							isLoading={false}
						/>
					</CardBody>
					<CardFooter>
						<div className="w-full grid grid-rows-2 gap-3">
							<LinkButton types="term" />
							<LinkButton types="privacy" />
						</div>
					</CardFooter>
				</Card>
			</div>
		</animated.section>
	);
}
