import LinkButton from '@/entities/line/ui/LinkButton';
import { Card, CardBody, CardFooter } from '@material-tailwind/react';
import React from 'react';

const NoDataLinkCard = () => {
	return (
		<Card>
			<CardBody>
				<h3 className="text-base font-bold">아직 등록된 문장이 없어요!</h3>
				<p className="text-sm">
					앞으로의 하루들을 바꿀 문장을 지금 바로 기록해보세요.
				</p>
			</CardBody>
			<CardFooter>
				<LinkButton types="record" />
			</CardFooter>
		</Card>
	);
};

export default NoDataLinkCard;
