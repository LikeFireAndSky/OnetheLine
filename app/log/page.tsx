'use client';

import BookEnrollment from '@/features/create/ui/BookEnrollment';
import { useInView, animated } from '@react-spring/web';
import React from 'react';
import { useBookData } from '@/shared/share/BookDataContext';

const Page = () => {
	const [ref, inView] = useInView(() => ({
		from: { opacity: 0 },
		to: { opacity: 1 },
		config: {
			mass: 5,
			friction: 120,
			tension: 120,
		},
	}));

	const { bookData } = useBookData();

	return (
		<animated.section
			ref={ref}
			style={inView}
			className="w-full h-full flex flex-col p-3 mt-3 space-y-5"
		>
			<div className="w-full flex flex-col space-y-1">
				<h1 className="text-2xl font-semibold">Create the Line</h1>
				<p className="text-base">
					지금, 당신의 마음을 움직이는 문장을 남겨보세요.
				</p>
			</div>
			<BookEnrollment bookData={bookData} />
		</animated.section>
	);
};

export default Page;
