import {
	Button,
	Input,
	Option,
	Select,
	Textarea,
} from '@material-tailwind/react';
import React from 'react';
import { Controller } from 'react-hook-form';
import useBookEnrollment from '../model/useBookEnrollment';
import { bookCategoriesKor } from '../config/bookEnrollmentConfig';
import { BookDialogs } from './BookDialog';
import { PlusIcon } from '@heroicons/react/16/solid';
import { BookData } from '@/shared/share/BookDataContext';

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
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="space-y-4 pb-6">
				{/* Book Name */}
				<div>
					<div className="grid gap-1">
						<div className="grid grid-flow-col gap-1">
							<Input
								className="col-span-4"
								label="책 검색하기"
								crossOrigin={'anonymous'}
								onChange={e => setSearchQuery(e.target.value)}
							/>
							<Button
								className="p-1"
								onClick={handleOpen}
							>
								검색하기
							</Button>
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
				</div>
				<div>
					<Input
						label="책 이름"
						crossOrigin={'anonymous'}
						readOnly={true}
						value={getBookTitle()}
					/>
					<div>
						{errors.bookTitle && (
							<p className="text-red-500 text-sm mt-1">
								{errors.bookTitle.message}
							</p>
						)}
					</div>
				</div>
				{/* Category */}
				<div>
					<Controller
						name="category"
						control={control}
						render={({ field }) => (
							<Select
								label="책 카테고리"
								{...field}
								placeholder="Select a category"
							>
								{bookCategoriesKor.map(category => (
									<Option
										key={category.type}
										value={category.type}
										className="w-full flex justify-between"
									>
										<div className="w-full flex justify-between items-center gap-2">
											<p>{category.kor}</p>
											<p className={`w-3 h-3 rounded-full ${category.color}`} />
										</div>
									</Option>
								))}
							</Select>
						)}
					/>
					{errors.category && (
						<p className="text-red-500 text-sm mt-1">
							{errors.category.message}
						</p>
					)}
				</div>

				{/* Passage */}
				<div>
					<Textarea
						{...register('sentence')}
						label="나만의 구절"
						rows={7}
					/>
					{errors.sentence && (
						<p className="text-red-500 text-sm mt-1">
							{errors.sentence.message}
						</p>
					)}
				</div>
			</div>
			<div>
				<Button
					type="submit"
					className="ml-auto"
					disabled={mutationLoading}
				>
					{mutationLoading ? (
						<span className="flex items-center gap-1 animate-pulse">
							등록 중...
						</span>
					) : (
						<span className="flex items-center gap-1">
							<PlusIcon className="h-4" />
							등록하기
						</span>
					)}
				</Button>
			</div>
		</form>
	);
};

export default BookEnrollment;
