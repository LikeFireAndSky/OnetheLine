'use client';

import { useInView } from '@react-spring/web';

/**
 * 화면에 들어올 때 한 번만 짧게 떠오르는 페이드인
 * (기존 스프링 설정은 수 초간 화면이 흐릿하게 보여 가독성을 해쳤음)
 */
export const useFadeIn = () =>
	useInView(
		() => ({
			from: { opacity: 0, transform: 'translateY(6px)' },
			to: { opacity: 1, transform: 'translateY(0px)' },
			config: { duration: 320 },
		}),
		{ once: true },
	);
