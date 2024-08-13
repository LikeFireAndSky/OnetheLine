import Image from 'next/image';
import MainImagePen from '@/public/images/MainImage_Pen_Cut.png';

export default function Home() {
	return (
		<div className="w-full h-full">
			<div className="flex items-center justify-center h-g2">
				<Image
					src={MainImagePen}
					alt="MainImage_Pen"
					priority
					className="object-cover"
				/>
			</div>
			<div className="w-full flex flex-col p-3 space-y-1">
				<h1 className="text-5xl">OnetheLine</h1>
				<p className="text-xl">
					Just one line, the wonderful underline for reading log
				</p>
				<div></div>
			</div>
		</div>
	);
}
