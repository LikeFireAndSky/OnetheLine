'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { ThemeProvider } from '@material-tailwind/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Globals, useReducedMotion } from '@react-spring/web';
import { BookDataProvider } from '@/shared/share/BookDataContext';

const ClientProvider = ({
	children,
	session,
}: {
	children: React.ReactNode;
	session: Session | null;
}) => {
	const [queryClient] = React.useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	// OS의 '동작 줄이기' 설정을 켠 사용자에게는 애니메이션 없이 바로 표시
	const prefersReducedMotion = useReducedMotion();
	React.useEffect(() => {
		Globals.assign({ skipAnimation: !!prefersReducedMotion });
	}, [prefersReducedMotion]);

	return (
		<SessionProvider session={session}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<BookDataProvider>{children}</BookDataProvider>
				</ThemeProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</SessionProvider>
	);
};

export default ClientProvider;
