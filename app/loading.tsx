'use client';

import { Spinner } from '@material-tailwind/react';
import React from 'react';

const loading = () => {
	return (
		<div className="w-full h-full flex flex-col gap-3 justify-center items-center">
			<p className=" font-light animate-pulse">로딩중...</p>
			<Spinner
				onPointerEnterCapture={false}
				onPointerLeaveCapture={false}
			/>
		</div>
	);
};

export default loading;
