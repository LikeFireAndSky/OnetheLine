'use client';

import React from 'react';
import Log from '@/components/ReadingLog/Log';
import { useInView, animated } from '@react-spring/web';

const longSampleData = {
	title: 'Title',
	content:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel suscipit nisl. Nullam vitae dolor nec nisi fermentum ultricies. Nullam',
	date: '2021-10-01',
};

const Home = () => {
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
			className="w-full h-full flex flex-col justify-center px-3"
		>
			<div className="w-full flex flex-col space-y-1">
				<h1 className="text-5xl">OnetheLine</h1>
				<p className="text-xl">오늘 하루를 바꿀 최고의 문장을 기록하세요.</p>
			</div>
			<div className="w-full flex justify-center py-5">
				<div className="w-5/6 border-t border-2" />
			</div>
			<Log {...longSampleData} />
		</animated.section>
	);
};

export default Home;
