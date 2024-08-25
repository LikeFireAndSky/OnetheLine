"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const SessionPage = () => {
  const { data: session } = useSession();

  if (session) {
    console.log(session);
    return (
      <>
        Signed in 완료 <br />
        <button onClick={() => signOut()}>Sign out</button>
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
