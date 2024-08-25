import Image from "next/image";
import MainImagePen from "@/public/images/MainImage_Pen_Cut.png";
import Log from "@/components/ReadingLog/Log";

const longSampleData = {
  title: "Title",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel suscipit nisl. Nullam vitae dolor nec nisi fermentum ultricies. Nullam",
  date: "2021-10-01",
};

export default function Home() {
  return (
    <main className="w-full h-full">
      <section>
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
        </div>
      </section>
      <section className="w-full flex flex-col p-3 space-y-1">
        <h2 className="text-2xl">Today&apos;s reading log</h2>
        <Log {...longSampleData} />
      </section>
    </main>
  );
}
