import Image from 'next/image';
import MainImagePen from '@/public/images/MainImage_Pen_Cut.png';
import Log from '@/components/ReadingLog/Log';
import LinkButton from '@/components/common/LinkButton';

const longSampleData = {
	title: 'Title',
	content:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel suscipit nisl. Nullam vitae dolor nec nisi fermentum ultricies. Nullam',
	date: '2021-10-01',
};

export default function Home() {
	return (
		<main className="w-full h-full flex flex-col">
			<Image
				src={MainImagePen}
				alt="MainImage_Pen"
				priority
				className="object-cover h-g2 w-full mx-auto"
			/>
			<section className="w-full flex flex-col flex-grow p-3 space-y-1">
				<div className="w-full flex flex-col p-3 space-y-1">
					<h1 className="text-5xl">OnetheLine</h1>
					<p className="text-xl">
						Just one line, the wonderful underline for reading log
					</p>
				</div>
				<h2 className="text-2xl">Today&apos;s reading log</h2>
				<Log {...longSampleData} />
				<LinkButton />
			</section>
		</main>
	);
}
