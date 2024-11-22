'use client';

import { LogType } from '@/types';
import React from 'react';
import {
	Card,
	CardBody,
	CardFooter,
	Typography,
	Button,
} from '@material-tailwind/react';
import { useRouter } from 'next/navigation';

export const MUI_PROPERTIES = {
	placeholder: true,
	onPointerEnterCapture: true,
	onPointerLeaveCapture: true,
};

const Log = ({ title, content, date }: LogType) => {
	const router = useRouter();

	const onClick = () => {
		router.push('/line');
	};

	return (
		<Card
			{...MUI_PROPERTIES}
			className="w-full"
		>
			<CardBody {...MUI_PROPERTIES}>
				<Typography
					{...MUI_PROPERTIES}
					color="gray"
				>
					{date}
				</Typography>
				<Typography
					{...MUI_PROPERTIES}
					variant="h5"
				>
					{title}
				</Typography>
				<Typography {...MUI_PROPERTIES}>{content}</Typography>
			</CardBody>
			<CardFooter {...MUI_PROPERTIES}>
				<Button
					onClick={onClick}
					{...MUI_PROPERTIES}
					color="blue-gray"
				>
					같은 책의 다른 문장 바로 보러가기
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Log;
