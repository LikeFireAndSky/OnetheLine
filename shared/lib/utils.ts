export const changeTime = (time: string) => {
	const date = new Date(time);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	return `${year}년 ${month}월 ${day}일`;
};

// 책 이름 ()제거 함수
export const removeParentheses = (str: string) => {
	let result = '';
	let depth = 0;

	for (let char of str) {
		if (char === '(') {
			depth++; // 괄호 열리면 depth 증가
		} else if (char === ')') {
			if (depth > 0) depth--; // 괄호 닫히면 depth 감소
		} else if (depth === 0) {
			result += char; // 괄호 밖일 때만 추가
		}
	}

	return result;
};
