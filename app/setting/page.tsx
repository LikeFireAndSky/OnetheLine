'use client';

import LinkButton from '@/entities/line/ui/LinkButton';
import LogInButton from '@/processes/user/ui/LogInButton';
import React from 'react';
import { Card, CardFooter, CardBody } from '@material-tailwind/react';

const Page = () => {
	return (
		<section className="w-full h-full flex flex-col p-3 mt-3 space-y-5">
			<div className="w-full flex flex-col space-y-1">
				<Card className="w-full flex p-3">
					<CardBody>
						<h1 className="text-2xl font-semibold">Setting</h1>
						<p className="text-base">설정</p>
						<LogInButton />
					</CardBody>
					<CardFooter>
						<div className="w-full grid grid-cols-2 gap-3">
							<LinkButton types="term" />
							<LinkButton types="privacy" />
						</div>
					</CardFooter>
				</Card>
			</div>
		</section>
	);
};

export default Page;
