'use client';

import BookEnrollment from '@/features/create/ui/BookEnrollment';
import React from 'react';

const Page = () => {
	return (
		<section className="w-full h-full flex flex-col p-3 mt-3 space-y-5">
			<div className="w-full flex flex-col space-y-1">
				<h1 className="text-2xl font-semibold">Create the Line</h1>
				<p className="text-base">앞으로의 하루를 바꿀 구절을 기록하세요.</p>
			</div>
			<BookEnrollment />
		</section>
	);
};

export default Page;
