import React from 'react';
import Seal from '@/shared/ui/Seal';

const Loading = () => {
	return (
		<div
			role="status"
			className="w-full h-full flex flex-col gap-3 justify-center items-center"
		>
			<Seal
				size="lg"
				className="animate-pulse"
			/>
			<p className="font-serif text-[15px] text-ink-muted">불러오는 중...</p>
		</div>
	);
};

export default Loading;
