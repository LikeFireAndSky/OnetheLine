// useLinkCard.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DocumentTextIcon, FireIcon } from '@heroicons/react/16/solid';
import { useLinkCard, UseLinkCardProps } from '../model/useLinkCard';

// 테스트를 위한 래퍼 컴포넌트
const HookTestComponent: React.FC<UseLinkCardProps> = props => {
	const config = useLinkCard(props);

	// Icon은 React 엘리먼트이므로, 해당 타입을 비교하기 위해 type 프로퍼티를 활용합니다.
	const iconType =
		config.Icon.type === DocumentTextIcon
			? 'DocumentTextIcon'
			: config.Icon.type === FireIcon
			? 'FireIcon'
			: 'Unknown';

	return (
		<div>
			<span data-testid="text">{config.text}</span>
			<span data-testid="number">{config.number}</span>
			<span data-testid="icon-type">{iconType}</span>
		</div>
	);
};

describe('useLinkCard hook', () => {
	describe('totalBooks 타입 테스트', () => {
		it('로딩 상태에서는 "로딩중..."을 반환해야 합니다.', () => {
			const props: UseLinkCardProps = {
				types: 'totalBooks',
				isLoading: true,
				isError: false,
				data: { isEnrolled: true, data: { totalBooks: 10 } },
			};

			const { getByTestId } = render(<HookTestComponent {...props} />);
			expect(getByTestId('number')).toHaveTextContent('로딩중...');
		});

		it('에러 상태에서는 "에러가 발생했습니다."를 반환해야 합니다.', () => {
			const props: UseLinkCardProps = {
				types: 'totalBooks',
				isLoading: false,
				isError: true,
				data: { isEnrolled: true, data: { totalBooks: 10 } },
			};

			const { getByTestId } = render(<HookTestComponent {...props} />);
			expect(getByTestId('number')).toHaveTextContent('에러가 발생했습니다.');
		});

		it('정상 상태: 등록되어 있고 데이터가 존재하면 totalBooks 값을 반환해야 합니다.', () => {
			const props: UseLinkCardProps = {
				types: 'totalBooks',
				isLoading: false,
				isError: false,
				data: { isEnrolled: true, data: { totalBooks: 15 } },
			};

			const { getByTestId } = render(<HookTestComponent {...props} />);
			expect(getByTestId('number')).toHaveTextContent('15');
		});

		it('정상 상태: 등록되지 않았거나 데이터가 없으면 0을 반환해야 합니다.', () => {
			const props: UseLinkCardProps = {
				types: 'totalBooks',
				isLoading: false,
				isError: false,
				data: { isEnrolled: false },
			};

			const { getByTestId } = render(<HookTestComponent {...props} />);
			expect(getByTestId('number')).toHaveTextContent('0');
		});

		it('전체 책 수 카드의 텍스트와 아이콘이 올바른지 확인합니다.', () => {
			const props: UseLinkCardProps = {
				types: 'totalBooks',
				isLoading: false,
				isError: false,
				data: { isEnrolled: true, data: { totalBooks: 5 } },
			};

			const { getByTestId } = render(<HookTestComponent {...props} />);
			expect(getByTestId('text')).toHaveTextContent('전체 책 수');
			expect(getByTestId('icon-type')).toHaveTextContent('DocumentTextIcon');
		});
	});

	describe('totalSentences 타입 테스트', () => {
		it('로딩 상태에서는 "로딩중..."을 반환해야 합니다.', () => {
			const props: UseLinkCardProps = {
				types: 'totalSentences',
				isLoading: true,
				isError: false,
				data: { isEnrolled: true, SentenceCounts: 20 },
			};

			const { getByTestId } = render(<HookTestComponent {...props} />);
			expect(getByTestId('number')).toHaveTextContent('로딩중...');
		});

		it('에러 상태에서는 "에러가 발생했습니다."를 반환해야 합니다.', () => {
			const props: UseLinkCardProps = {
				types: 'totalSentences',
				isLoading: false,
				isError: true,
				data: { isEnrolled: true, SentenceCounts: 20 },
			};

			const { getByTestId } = render(<HookTestComponent {...props} />);
			expect(getByTestId('number')).toHaveTextContent('에러가 발생했습니다.');
		});

		it('정상 상태: 등록되어 있고 SentenceCounts 값이 있으면 해당 값을 반환해야 합니다.', () => {
			const props: UseLinkCardProps = {
				types: 'totalSentences',
				isLoading: false,
				isError: false,
				data: { isEnrolled: true, SentenceCounts: 25 },
			};

			const { getByTestId } = render(<HookTestComponent {...props} />);
			expect(getByTestId('number')).toHaveTextContent('25');
		});

		it('정상 상태: 등록되지 않았으면 0을 반환해야 합니다.', () => {
			const props: UseLinkCardProps = {
				types: 'totalSentences',
				isLoading: false,
				isError: false,
				data: { isEnrolled: false, SentenceCounts: 25 },
			};

			const { getByTestId } = render(<HookTestComponent {...props} />);
			expect(getByTestId('number')).toHaveTextContent('0');
		});

		it('전체 구절 수 카드의 텍스트와 아이콘이 올바른지 확인합니다.', () => {
			const props: UseLinkCardProps = {
				types: 'totalSentences',
				isLoading: false,
				isError: false,
				data: { isEnrolled: true, SentenceCounts: 30 },
			};

			const { getByTestId } = render(<HookTestComponent {...props} />);
			expect(getByTestId('text')).toHaveTextContent('전체 구절 수');
			expect(getByTestId('icon-type')).toHaveTextContent('FireIcon');
		});
	});
});
