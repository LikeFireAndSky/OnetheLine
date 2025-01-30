'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@material-tailwind/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const ClientProvider = ({
	children,
	session,
}: {
	children: React.ReactNode;
	session: any;
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

	return (
		<SessionProvider session={session}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>{children}</ThemeProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</SessionProvider>
	);
};

export default ClientProvider;
