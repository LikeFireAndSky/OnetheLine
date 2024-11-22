'use client';

import React, { useEffect } from 'react';
import AccordionComponent from '@/components/line/AccordionComponent';
import { useInView, animated } from '@react-spring/web';

const SampleLog = [
	{
		title: '트랜드 코리아 2025',
		contents:
			"We're not always in the position that we want to be at. We're constantly growing. We're constantly making mistakes. We're constantly trying to express ourselves and actualize our dreams. We're not always in the position that we want to be at. We're constantly growing. We're constantly making mistakes. We're constantly trying to express ourselves and actualize our dreams. We're not always in the position that we want to be at. We're constantly growing. We're constantly making mistakes. We're constantly trying to express ourselves and actualize our dreams. We're not always in the position that we want to be at. We're constantly growing. We're constantly making mistakes. We're constantly trying to express ourselves and actualize our dreams.",
		category: 'business-economics',
	},
	{
		title: '지구 끝의 온실',
		contents: '우리가 살아가는 세상은 어떤 모습일까? 그것은 누구도 알 수 없다',
		category: 'literature-arts',
	},
	{
		title: '디지털 트랜스포메이션',
		contents:
			'디지털 기술이 비즈니스와 사회에 미치는 영향은 날로 커지고 있다. 우리는 이러한 변화에 적응하고 발전해야 한다.',
		category: 'science-technology',
	},
	{
		title: '감정의 이해',
		contents:
			'감정은 인간의 행동에 깊은 영향을 미친다. 이를 이해하는 것은 더 나은 의사결정과 관계를 만드는 데 필수적이다.',
		category: 'selfHelp-psychology',
	},
	{
		title: '미래의 교육',
		contents:
			'AI와 데이터가 결합된 미래의 교육은 전통적인 방식에서 벗어나 학생 중심의 학습 환경을 제공할 것이다.',
		category: 'science-technology',
	},
	{
		title: '자연과 공존',
		contents:
			'환경 파괴를 멈추고 자연과 공존하기 위한 방법을 모색해야 한다. 이는 우리 모두의 책임이다.',
		category: 'society-environment',
	},
	{
		title: '혁신의 가치',
		contents:
			'혁신은 새로운 가치를 창출하는 과정이다. 실패를 두려워하지 않고 도전하는 자세가 중요하다.',
		category: 'business-economics',
	},
	{
		title: '시간 관리의 기술',
		contents:
			'효과적인 시간 관리는 삶의 질을 높이고 목표를 달성하는 데 중요한 역할을 한다. 이를 위한 전략이 필요하다.',
		category: 'selfHelp-psychology',
	},
	{
		title: '여행의 의미',
		contents:
			'여행은 단순한 이동 이상의 의미를 지닌다. 새로운 문화와 사람들을 만나는 과정에서 성장할 수 있다.',
		category: 'selfHelp-psychology',
	},
	{
		title: '코딩의 미래',
		contents:
			'프로그래밍은 더 이상 개발자만의 언어가 아니다. 모든 사람이 기본적인 코딩 능력을 갖추는 시대가 오고 있다.',
		category: 'business-economics',
	},
	{
		title: '미래의 교육',
		contents:
			'AI와 데이터가 결합된 미래의 교육은 전통적인 방식에서 벗어나 학생 중심의 학습 환경을 제공할 것이다.',
		category: 'business-economics',
	},
	{
		title: '자연과 공존',
		contents:
			'환경 파괴를 멈추고 자연과 공존하기 위한 방법을 모색해야 한다. 이는 우리 모두의 책임이다.',
		category: 'society-environment',
	},
	{
		title: '혁신의 가치',
		contents:
			'혁신은 새로운 가치를 창출하는 과정이다. 실패를 두려워하지 않고 도전하는 자세가 중요하다.',
		category: 'business-economics',
	},
];

const Page = () => {
	const [isMounted, setIsMounted] = React.useState(false);

	const [ref, inView] = useInView(() => ({
		from: { opacity: 0 },
		to: { opacity: 1 },
		config: {
			mass: 5,
			friction: 120,
			tension: 120,
		},
	}));

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<animated.section
			ref={ref}
			style={inView}
			className="w-full p-3"
		>
			<>
				{SampleLog.map((log, index) => (
					<AccordionComponent
						key={index}
						index={index}
						title={log.title}
						category={log.category}
						contents={log.contents}
					/>
				))}
			</>
		</animated.section>
	);
};

export default Page;
