import React from 'react';
import PenMark from '@/shared/ui/PenMark';

const Loading = () => {
	return (
		<div
			role="status"
			className="w-full h-full flex flex-col gap-3 justify-center items-center"
		>
			<PenMark className="h-10 w-10 animate-pulse text-ink-muted" />
			<p className="font-serif text-[15px] text-ink-muted">불러오는 중...</p>
		</div>
	);
};

export default Loading;
