import React from 'react';

const Loading = () => {
	return (
		<div className="w-full h-full flex flex-col gap-3 justify-center items-center">
			<p className=" font-light animate-pulse">로딩중...</p>
		</div>
	);
};

export default Loading;
