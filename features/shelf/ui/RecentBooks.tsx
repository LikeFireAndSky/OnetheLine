'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useGetReadingLog } from '@/entities/archive/api/useGetReadingLog';
import LinkButton from '@/entities/line/ui/LinkButton';
import { getCategoryHex } from '@/features/create/config/bookEnrollmentConfig';
import { useBookData } from '@/shared/share/BookDataContext';
import { normalizeIsbn } from '@/shared/lib/isbn';
import { removeParentheses } from '@/shared/lib/utils';
import { useBookCovers, type BookCovers } from '../api/useBookCovers';
import { getRecentBooks, type RecentBook } from '../lib/recentBooks';

const TITLE = '최근 읽은 책';
const MAX_BOOKS = 8;

// 표지 (표지를 찾지 못하면 카테고리 색 천 표지에 제목을 적어 대신 보여줌)
const BookCover = ({
	src,
	title,
	category,
}: {
	src: string | null | undefined;
	title: string;
	category: string;
}) => {
	const coverFrame =
		'relative aspect-[2/3] w-full overflow-hidden rounded-[2px] shadow-[2px_4px_10px_-5px_rgba(31,29,26,0.55)] transition-transform duration-200 group-hover:-translate-y-0.5';

	if (src) {
		return (
			<div className={`${coverFrame} border border-rule bg-hanji-deep`}>
				<Image
					src={src}
					alt=""
					fill
					sizes="96px"
					unoptimized
					referrerPolicy="no-referrer"
					className="object-cover"
				/>
			</div>
		);
	}

	return (
		<div
			className={`${coverFrame} flex items-center justify-center px-2 text-center`}
			style={{ backgroundColor: getCategoryHex(category) }}
		>
			{/* 책등 선 */}
			<span
				aria-hidden
				className="absolute inset-y-0 left-1.5 w-px bg-hanji-light/30"
			/>
			<span className="font-serif text-[12px] font-bold leading-snug text-hanji-light line-clamp-4">
				{title}
			</span>
		</div>
	);
};

/**
 * 최근 읽은 책 목록 (가로로 넘겨보는 책장)
 */
export const RecentBooksShelf = ({
	books,
	covers,
	onSelect,
}: {
	books: RecentBook[];
	covers?: BookCovers;
	onSelect: (book: RecentBook) => void;
}) => (
	<ul className="-mx-4 mt-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1">
		{books.map(book => {
			const title = removeParentheses(book.BookTitle).trim();
			const isbn = normalizeIsbn(book.BookId);
			return (
				<li
					key={book.BookId}
					className="w-24 shrink-0 snap-start"
				>
					<button
						type="button"
						onClick={() => onSelect(book)}
						aria-label={`${title}에 문장 남기기`}
						className="group w-full text-left"
					>
						<BookCover
							src={isbn ? covers?.[isbn] : null}
							title={title}
							category={book.Category}
						/>
						<p className="mt-2 font-serif text-[13px] font-bold leading-snug text-ink line-clamp-2">
							{title}
						</p>
						<p className="mt-0.5 text-[12px] text-ink-muted">
							{book.sentenceCount}줄
						</p>
					</button>
				</li>
			);
		})}
	</ul>
);

// 불러오는 동안 보여줄 책 자리
const ShelfSkeleton = () => (
	<div
		aria-hidden
		className="mt-4 flex gap-3 animate-pulse"
	>
		{Array.from({ length: 4 }, (_, index) => (
			<div
				key={index}
				className="w-24 shrink-0"
			>
				<div className="aspect-[2/3] w-full rounded-[2px] bg-hanji-deep" />
				<div className="mt-2 h-3 w-4/5 rounded-sm bg-hanji-deep" />
			</div>
		))}
	</div>
);

export default function RecentBooks() {
	const { status } = useSession();
	const isLoggedIn = status === 'authenticated';
	// 기록 달력과 같은 서재 데이터를 공유 (react-query 캐시)
	const { data, isLoading, isError } = useGetReadingLog({
		enabled: isLoggedIn,
	});

	const books = useMemo(
		() => (isLoggedIn ? getRecentBooks(data?.data ?? [], MAX_BOOKS) : []),
		[isLoggedIn, data],
	);
	const isbns = useMemo(
		() =>
			books
				.map(book => normalizeIsbn(book.BookId))
				.filter((isbn): isbn is string => isbn !== null),
		[books],
	);
	const { data: covers } = useBookCovers(isbns);

	const { setBookData } = useBookData();
	const router = useRouter();

	// 책을 고르면 그 책이 선택된 기록 화면으로 이동해 바로 문장을 입력
	const handleSelect = (book: RecentBook) => {
		setBookData({
			BookId: book.BookId,
			BookTitle: book.BookTitle,
			BookAuthor: book.BookAuthor,
			BookPublisher: book.BookPublisher,
			BookPublishedDate: book.BookPublishedDate,
			Category: book.Category,
			Contents: book.Contents ?? [],
		});
		router.push('/log');
	};

	const isPending = status === 'loading' || (isLoggedIn && isLoading);

	return (
		<section
			aria-label={TITLE}
			className="paper w-full px-4 pt-4 pb-4"
		>
			<div className="flex items-start justify-between gap-3">
				<div>
					<h2 className="card-title">{TITLE}</h2>
					<p className="mt-0.5 text-[13px] text-ink-muted">
						책을 누르면 바로 문장을 남길 수 있어요.
					</p>
				</div>
				{isLoggedIn && books.length > 0 && (
					<Link
						href="/line"
						className="shrink-0 pt-0.5 text-[13px] text-ink-muted underline-offset-4 hover:text-ink hover:underline"
					>
						서재 전체
					</Link>
				)}
			</div>

			{isPending ? (
				<ShelfSkeleton />
			) : !isLoggedIn ? (
				<p className="mt-3 text-[14px] text-ink-soft">
					로그인하면 최근 읽은 책이 표지와 함께 보여요.
				</p>
			) : isError ? (
				<p
					role="alert"
					className="mt-3 text-[14px] text-ink-muted"
				>
					책 목록을 불러오지 못했습니다.
				</p>
			) : books.length === 0 ? (
				<div className="mt-3">
					<p className="text-[14px] text-ink-soft">
						아직 기록한 책이 없어요. 첫 문장을 남겨보세요.
					</p>
					<div className="mt-4">
						<LinkButton types="record" />
					</div>
				</div>
			) : (
				<RecentBooksShelf
					books={books}
					covers={covers}
					onSelect={handleSelect}
				/>
			)}
		</section>
	);
}
