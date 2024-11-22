import FooterNav from '@/components/common/FooterNav';
import React, { ReactNode } from 'react';

const template = async ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex flex-col items-center w-full max-w-[540px] bg-white mx-auto h-[100dvh] overflow-hidden">
			<main className="w-full flex flex-1 flex-col overflow-scroll">
				{children}
			</main>
			<FooterNav />
		</div>
	);
};

export default template;
