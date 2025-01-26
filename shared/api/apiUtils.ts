'use client';

import axios from 'axios';

export const findDevelopment = () => {
	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:3000/api';
	} else {
		return 'https://onetheline.xyz/api';
	}
};

export const api = axios.create({
	baseURL: findDevelopment(),
});
