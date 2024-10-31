'use client';

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const SessionPage = () => {
	const { data: session } = useSession();

	if (session) {
		console.log(session);
		return (
			<>
				Signed in 완료 <br />
				<button onClick={() => signOut()}>Sign out</button>
				<p>{session.user?.name}</p>
				<p>{session.user?.email}</p>
				<p>{session.accessToken}</p>
			</>
		);
	}

	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	);
};

export default SessionPage;
