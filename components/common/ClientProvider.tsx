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

	const theme = {
		radio: {
			defaultProps: {
				color: 'gray',
				label: undefined,
				icon: undefined,
				ripple: true,
				className: '',
				disabled: false,
				containerProps: undefined,
				labelProps: undefined,
				iconProps: undefined,
			},
			valid: {
				colors: ['yellow', 'brown', 'white', 'blue', 'gray'],
			},
			styles: {
				colors: {
					yellow: {
						color: 'text-coffee',
						border: 'checked:border-coffee',
						before: 'checked:before:bg-coffee',
					},
					gray: {
						color: 'text-grayey',
						border: 'checked:border-grayey',
						before: 'checked:before:bg-grayey',
					},
					green: {
						color: 'text-greeney',
						border: 'checked:border-greeney',
						before: 'checked:before:bg-greeney',
					},
					pink: {
						color: 'text-pinkey',
						border: 'checked:border-pinkey',
						before: 'checked:before:bg-pinkey',
					},
					white: {
						color: 'text-white',
						border: 'checked:border-bg-gray-400',
						before: 'checked:before:bg-gray-400',
					},
				},
			},
		},
	};

	return (
		<SessionProvider session={session}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider value={theme}>{children}</ThemeProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</SessionProvider>
	);
};

export default ClientProvider;
