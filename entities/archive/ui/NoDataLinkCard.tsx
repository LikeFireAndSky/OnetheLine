import LinkButton from '@/entities/line/ui/LinkButton';
import React from 'react';
import PenMark from '@/shared/ui/PenMark';

const NoDataLinkCard = () => {
	return (
		<div className="paper w-full px-5 py-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="card-title">아직 등록된 문장이 없어요</h3>
					<p className="mt-1 text-[15px] text-ink-soft">
						앞으로의 하루들을 바꿀 문장을 지금 바로 기록해보세요.
					</p>
				</div>
				<PenMark className="h-9 w-9 shrink-0 text-ink-muted" />
			</div>
			<div className="mt-5">
				<LinkButton types="record" />
			</div>
		</div>
	);
};

export default NoDataLinkCard;
