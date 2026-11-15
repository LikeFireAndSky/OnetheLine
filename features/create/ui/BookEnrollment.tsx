import { Input, Option, Select, Textarea } from '@material-tailwind/react';
import React from 'react';
import { Controller } from 'react-hook-form';
import useBookEnrollment from '../model/useBookEnrollment';
import { bookCategoriesKor } from '../config/bookEnrollmentConfig';
import { BookDialogs } from './BookDialog';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { BookData } from '@/shared/share/BookDataContext';

// 입력 오류 문구
const FieldError = ({ message }: { message?: string }) =>
	message ? (
		<p
			role="alert"
			className="mt-1.5 text-[13px] text-seal"
		>
			{message}
		</p>
	) : null;

const BookEnrollment = ({ bookData }: { bookData?: BookData }) => {
	const {
		handleSubmit,
		control,
		register,
		searchResults,
		onSubmit,
		setSearchQuery,
		errors,
		open,
		isLoading,
		isError,
		handleOpen,
		handleSelectBook,
		getBookTitle,
		mutationLoading,
	} = useBookEnrollment(bookData);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="paper w-full px-5 pt-6 pb-5"
		>
			<div className="space-y-5">
				{/* 책 검색 */}
				<div>
					<div className="flex items-start gap-2">
						<Input
							color="gray"
							label="책 검색하기"
							crossOrigin={'anonymous'}
							containerProps={{ className: 'min-w-0 flex-1' }}
							onChange={e => setSearchQuery(e.target.value)}
						/>
						<button
							type="button"
							className="btn-ink h-10 w-auto shrink-0 px-4 text-[14px]"
							onClick={handleOpen}
						>
							<MagnifyingGlassIcon
								aria-hidden
								className="w-4 h-4"
							/>
							검색
						</button>
					</div>
					<BookDialogs
						open={open}
						isLoading={isLoading}
						isError={isError}
						searchResults={searchResults}
						handleOpen={handleOpen}
						handleSelectBook={handleSelectBook}
					/>
				</div>

				{/* 책 이름 */}
				<div>
					<Input
						color="gray"
						label="책 이름"
						crossOrigin={'anonymous'}
						readOnly={true}
						value={getBookTitle()}
					/>
					<FieldError message={errors.bookTitle?.message} />
				</div>

				{/* 카테고리 */}
				<div>
					<Controller
						name="category"
						control={control}
						render={({ field }) => (
							<Select
								color="gray"
								label="책 카테고리"
								{...field}
								placeholder="카테고리를 선택하세요"
								menuProps={{ className: 'bg-hanji-light' }}
							>
								{bookCategoriesKor.map(category => (
									<Option
										key={category.type}
										value={category.type}
										className="w-full flex justify-between"
									>
										<div className="w-full flex justify-between items-center gap-2 text-ink">
											<p>{category.kor}</p>
											<p
												aria-hidden
												className={`w-3 h-3 rounded-full ${category.color}`}
											/>
										</div>
									</Option>
								))}
							</Select>
						)}
					/>
					<FieldError message={errors.category?.message} />
				</div>

				{/* 구절 */}
				<div>
					{/* 최근 읽은 책/서재에서 책을 골라 들어오면 바로 입력할 수 있게 커서를 둠 */}
					<Textarea
						color="gray"
						autoFocus={!!bookData?.BookId}
						{...register('sentence')}
						label="나만의 구절"
						rows={7}
						className="font-serif text-[16px] leading-[1.8] text-ink"
					/>
					<FieldError message={errors.sentence?.message} />
				</div>
			</div>

			<button
				type="submit"
				className="btn-ink mt-6"
				disabled={mutationLoading}
			>
				{mutationLoading ? (
					<span className="animate-pulse">등록 중...</span>
				) : (
					<>
						<PlusIcon
							aria-hidden
							className="w-5 h-5"
						/>
						등록하기
					</>
				)}
			</button>
		</form>
	);
};

export default BookEnrollment;
