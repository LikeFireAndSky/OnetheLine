'use client';

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@material-tailwind/react/components/Button';

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
				<Button
					color="black"
					placeholder="button"
					onPointerEnterCapture
					onPointerLeaveCapture
				>
					Click me
				</Button>
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
