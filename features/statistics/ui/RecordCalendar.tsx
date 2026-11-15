'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetReadingLog } from '@/entities/archive/api/useGetReadingLog';
import { getCategoryHex } from '@/features/create/config/bookEnrollmentConfig';
import { removeParentheses } from '@/shared/lib/utils';
import {
	WEEKDAYS,
	buildMonthWeeks,
	getRecordedDaysInMonth,
	getStampLevel,
	groupRecordsByDate,
	toDateKey,
	type CalendarLogSource,
	type DayRecord,
} from '../lib/recordCalendar';
import { ChartMessage } from './ChartCard';

const TITLE = '나의 기록 달력';

// 하루 기록 수에 따른 칸 색 (낙관 도장을 찍은 것처럼 기록이 많을수록 진하게)
const STAMP_CLASS = {
	0: 'text-ink-soft hover:bg-hanji-deep',
	1: 'bg-seal-wash text-ink hover:bg-seal/30',
	2: 'bg-seal/45 text-ink hover:bg-seal/55',
	3: 'bg-seal text-hanji-light hover:bg-seal-deep',
} as const;

const LEGEND_CLASS = {
	1: 'bg-seal-wash border border-seal/20',
	2: 'bg-seal/45',
	3: 'bg-seal',
} as const;

const NAV_BUTTON =
	'inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-hanji-deep hover:text-ink disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent';

// ✨ 샘플 데이터 (로그아웃용): 오늘 기준 며칠 전에 기록한 것처럼 표시
const SAMPLE_SENTENCES = [
	{
		BookTitle: '데미안',
		Category: 'literature-arts',
		content: '새는 알에서 나오려고 투쟁한다. 알은 세계이다.',
	},
	{
		BookTitle: '어린 왕자',
		Category: 'literature-arts',
		content: '가장 중요한 것은 눈에 보이지 않아.',
	},
	{
		BookTitle: '미움받을 용기',
		Category: 'selfHelp-psychology',
		content: '인간의 모든 고민은 인간관계에서 비롯된다.',
	},
	{
		BookTitle: '코스모스',
		Category: 'science-technology',
		content: '우리는 별의 물질로 이루어져 있다.',
	},
	{
		BookTitle: '총 균 쇠',
		Category: 'society-environment',
		content: '역사는 민족마다 다르게 진행되었다.',
	},
];
const SAMPLE_DAYS_AGO = [0, 0, 1, 3, 4, 4, 4, 8, 11, 15];

const buildSampleLogs = (now: Date): CalendarLogSource[] =>
	SAMPLE_DAYS_AGO.map((daysAgo, index) => {
		const sample = SAMPLE_SENTENCES[index % SAMPLE_SENTENCES.length];
		const date = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() - daysAgo,
			21 - index,
		);
		return {
			BookTitle: sample.BookTitle,
			Category: sample.Category,
			Contents: [
				{
					SentenceID: `sample-${index}`,
					Content: sample.content,
					Timestamp: date.getTime(),
				},
			],
		};
	});

// '2026-11-15' → '11월 15일 일요일'
const formatDayTitle = (key: string) => {
	const [year, month, day] = key.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	return `${month}월 ${day}일 ${WEEKDAYS[date.getDay()]}요일`;
};

const formatTime = (timestamp: number) =>
	new Date(timestamp).toLocaleTimeString('ko-KR', {
		hour: 'numeric',
		minute: '2-digit',
	});

type ViewMonth = { year: number; month: number };

export default function RecordCalendar() {
	const { status } = useSession();
	const isLoggedIn = status === 'authenticated';
	// 로그인 전에는 서재 API가 401만 돌려주므로 요청하지 않음
	const { data, isLoading, isError } = useGetReadingLog({
		enabled: isLoggedIn,
	});

	// 날짜는 사용자의 시간대 기준이어야 하므로 브라우저에서만 계산 (서버 UTC와 어긋나지 않게)
	const [today, setToday] = useState<Date | null>(null);
	const [viewMonth, setViewMonth] = useState<ViewMonth | null>(null);
	const [selectedKey, setSelectedKey] = useState<string | null>(null);

	useEffect(() => {
		const now = new Date();
		setToday(now);
		setViewMonth({ year: now.getFullYear(), month: now.getMonth() });
		setSelectedKey(toDateKey(now));
	}, []);

	const byDate = useMemo(() => {
		if (!today) return new Map<string, DayRecord[]>();
		const logs: CalendarLogSource[] = isLoggedIn
			? (data?.data ?? [])
			: buildSampleLogs(today);
		return groupRecordsByDate(logs);
	}, [isLoggedIn, data, today]);

	if (
		!today ||
		!viewMonth ||
		status === 'loading' ||
		(isLoggedIn && isLoading)
	) {
		return (
			<ChartMessage
				title={TITLE}
				message="기록을 불러오는 중입니다..."
			/>
		);
	}

	if (isLoggedIn && isError) {
		return (
			<ChartMessage
				title={TITLE}
				message="기록을 불러오지 못했습니다."
			/>
		);
	}

	const todayKey = toDateKey(today);
	const isCurrentMonth =
		viewMonth.year === today.getFullYear() &&
		viewMonth.month === today.getMonth();

	const recordedDays = getRecordedDaysInMonth(
		byDate,
		viewMonth.year,
		viewMonth.month,
	);
	const monthLines = recordedDays.reduce(
		(sum, key) => sum + (byDate.get(key)?.length ?? 0),
		0,
	);
	const subtitle = !isLoggedIn
		? '샘플 데이터 (로그인 필요)'
		: recordedDays.length > 0
			? `이 달에 ${recordedDays.length}일, ${monthLines}줄을 남겼어요.`
			: '이 달에는 아직 남긴 문장이 없어요.';

	const selectedRecords = selectedKey ? (byDate.get(selectedKey) ?? []) : [];

	// 달 이동: 이동한 달에서 가장 최근에 기록한 날을 선택 (없으면 선택 해제)
	const moveMonth = (offset: number) => {
		const next = new Date(viewMonth.year, viewMonth.month + offset, 1);
		const nextView = { year: next.getFullYear(), month: next.getMonth() };
		setViewMonth(nextView);
		setSelectedKey(
			getRecordedDaysInMonth(byDate, nextView.year, nextView.month)[0] ?? null,
		);
	};

	return (
		<section
			aria-label={TITLE}
			className="paper w-full px-4 pt-4 pb-4"
		>
			<h2 className="card-title">{TITLE}</h2>
			<p className="mt-0.5 text-[13px] text-ink-muted">{subtitle}</p>

			{/* 월 이동 */}
			<div className="mt-4 flex items-center justify-between">
				<button
					type="button"
					onClick={() => moveMonth(-1)}
					aria-label="이전 달"
					className={NAV_BUTTON}
				>
					<ChevronLeftIcon
						aria-hidden
						className="h-5 w-5"
					/>
				</button>
				<p
					aria-live="polite"
					className="font-serif text-[17px] font-bold text-ink"
				>
					{viewMonth.year}년 {viewMonth.month + 1}월
				</p>
				<button
					type="button"
					onClick={() => moveMonth(1)}
					aria-label="다음 달"
					disabled={isCurrentMonth}
					className={NAV_BUTTON}
				>
					<ChevronRightIcon
						aria-hidden
						className="h-5 w-5"
					/>
				</button>
			</div>

			{/* 요일 (일요일은 주홍) */}
			<div
				aria-hidden
				className="mt-3 grid grid-cols-7 text-center text-[12px] font-medium"
			>
				{WEEKDAYS.map((weekday, index) => (
					<span
						key={weekday}
						className={index === 0 ? 'text-seal' : 'text-ink-muted'}
					>
						{weekday}
					</span>
				))}
			</div>

			{/* 날짜 */}
			<div className="mt-1 grid grid-cols-7 gap-1">
				{buildMonthWeeks(viewMonth.year, viewMonth.month)
					.flat()
					.map((date, index) => {
						if (!date) {
							return (
								<span
									key={`empty-${index}`}
									aria-hidden
								/>
							);
						}
						const key = toDateKey(date);
						const count = byDate.get(key)?.length ?? 0;
						const isToday = key === todayKey;
						const isSelected = key === selectedKey;
						const isFuture = key > todayKey;

						return (
							<button
								key={key}
								type="button"
								onClick={() => setSelectedKey(key)}
								disabled={isFuture}
								aria-pressed={isSelected}
								aria-label={`${date.getMonth() + 1}월 ${date.getDate()}일${
									isToday ? ', 오늘' : ''
								}${count > 0 ? `, ${count}줄 기록` : ''}`}
								className={`relative flex h-10 items-center justify-center rounded-sm text-[14px] transition-colors disabled:cursor-default disabled:text-ink-faint/60 ${
									STAMP_CLASS[getStampLevel(count)]
								} ${isToday ? 'font-bold' : ''} ${
									isSelected
										? 'ring-2 ring-ink ring-offset-1 ring-offset-hanji-light'
										: ''
								}`}
							>
								{date.getDate()}
								{/* 오늘 표시 */}
								{isToday && (
									<span
										aria-hidden
										className="absolute bottom-1 h-[2px] w-3 rounded-full bg-current"
									/>
								)}
							</button>
						);
					})}
			</div>

			{/* 범례 */}
			<div
				aria-hidden
				className="mt-3 flex items-center justify-end gap-1.5 text-[12px] text-ink-muted"
			>
				<span>적게</span>
				{([1, 2, 3] as const).map(level => (
					<span
						key={level}
						className={`h-3 w-3 rounded-[2px] ${LEGEND_CLASS[level]}`}
					/>
				))}
				<span>많이</span>
			</div>

			{/* 선택한 날의 문장 */}
			<div className="mt-4 border-t border-rule pt-4">
				{selectedKey === null ? (
					<p className="text-[14px] text-ink-muted">
						날짜를 누르면 그날 남긴 문장을 볼 수 있어요.
					</p>
				) : (
					<>
						<p className="font-serif text-[16px] font-bold text-ink">
							{formatDayTitle(selectedKey)}
							{selectedRecords.length > 0 && (
								<span className="ml-2 font-sans text-[13px] font-normal text-ink-muted">
									{selectedRecords.length}줄
								</span>
							)}
						</p>
						{selectedRecords.length === 0 ? (
							<p className="mt-2 text-[14px] text-ink-muted">
								이 날에는 남긴 문장이 없어요.
							</p>
						) : (
							<ul className="mt-3 space-y-4">
								{selectedRecords.map(record => (
									<li
										key={record.id}
										className="border-l-2 pl-3"
										style={{ borderColor: getCategoryHex(record.category) }}
									>
										<p className="whitespace-pre-line font-serif text-[15px] leading-[1.75] text-ink">
											{record.content}
										</p>
										<p className="mt-1 text-[12px] text-ink-muted">
											{removeParentheses(record.bookTitle)} ·{' '}
											{formatTime(record.timestamp)}
										</p>
									</li>
								))}
							</ul>
						)}
					</>
				)}
			</div>
		</section>
	);
}
