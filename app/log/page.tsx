'use client';

import BookEnrollment from '@/features/create/ui/BookEnrollment';
import { animated } from '@react-spring/web';
import React from 'react';
import { useBookData } from '@/shared/share/BookDataContext';
import { useFadeIn } from '@/shared/lib/useFadeIn';

const Page = () => {
	const [ref, fadeIn] = useFadeIn();

	const { bookData } = useBookData();

	return (
		<animated.section
			ref={ref}
			style={fadeIn}
			className="w-full h-full flex flex-col px-4 pt-6 pb-8 space-y-5"
		>
			<div className="w-full flex flex-col gap-1">
				<h1 className="page-title">한 줄 기록</h1>
				<p className="page-subtitle">
					지금, 당신의 마음을 움직이는 문장을 남겨보세요.
				</p>
			</div>
			<BookEnrollment bookData={bookData} />
		</animated.section>
	);
};

export default Page;
