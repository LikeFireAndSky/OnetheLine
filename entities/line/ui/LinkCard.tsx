import { Card, CardBody } from '@material-tailwind/react';
import React from 'react';
import { linkCardTypes, useLinkCard } from '../model/useLinkCard';

const LinkCard = ({
	types,
	data,
	isLoading,
	isError,
}: {
	types: linkCardTypes;
	data: any;
	isLoading: boolean;
	isError: boolean;
}) => {
	const linkCardConfig = useLinkCard({ types, data, isLoading, isError });
	return (
		<Card className="w-full rounded-sm">
			<CardBody className="flex flex-col items-start justify-center">
				<p className="text-sm">{linkCardConfig.text}</p>
				<div className="flex items-center justify-center gap-1">
					{linkCardConfig.Icon}
					<p className="font-semibold text-black">{linkCardConfig.number}</p>
				</div>
			</CardBody>
		</Card>
	);
};

export default LinkCard;
