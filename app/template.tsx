import ClientProvider from "@/components/common/ClientProvider";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import React, { ReactNode } from "react";

const template = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();
  return (
    <ClientProvider session={session}>
      <div className="flex flex-col items-center w-full max-w-[540px] bg-white mx-auto h-[100dvh] overflow-hidden">
        <main className="w-full flex flex-1 flex-col overflow-scroll">
          {children}
        </main>
      </div>
    </ClientProvider>
  );
};

export default template;
