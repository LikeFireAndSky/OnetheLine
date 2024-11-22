'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@material-tailwind/react';

const ClientProvider = ({
	children,
	session,
}: {
	children: React.ReactNode;
	session: any;
}) => {
	return (
		<SessionProvider session={session}>
			<ThemeProvider>{children}</ThemeProvider>
		</SessionProvider>
	);
};

export default ClientProvider;
