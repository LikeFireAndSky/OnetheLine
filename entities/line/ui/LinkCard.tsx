import React from 'react';
import { LinkCardTypes, useLinkCard } from '../model/useLinkCard';

// 숫자 뒤에 붙일 단위
const unitMap: Record<LinkCardTypes, string> = {
	totalBooks: '권',
	totalSentences: '줄',
};

const LinkCard = ({
	types,
	data,
	isLoading,
	isError,
}: {
	types: LinkCardTypes;
	data: any;
	isLoading: boolean;
	isError: boolean;
}) => {
	const linkCardConfig = useLinkCard({ types, data, isLoading, isError });
	const isNumber = typeof linkCardConfig.number === 'number';

	return (
		<div className="paper w-full px-4 py-4">
			<div className="flex items-center gap-1.5 text-ink-muted">
				{linkCardConfig.Icon}
				<p className="eyebrow">{linkCardConfig.text}</p>
			</div>
			{isNumber ? (
				<p className="mt-1.5 font-serif text-ink">
					<span className="text-[28px] font-bold leading-none">
						{linkCardConfig.number}
					</span>
					<span className="ml-1 text-[15px]">{unitMap[types]}</span>
				</p>
			) : (
				<p className="mt-2 text-[14px] text-ink-muted">
					{linkCardConfig.number}
				</p>
			)}
		</div>
	);
};

export default LinkCard;
