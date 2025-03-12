// app/setting/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import SettingClient from './SettingClient';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function SettingPage() {
	// (1) 서버에서 세션 정보를 미리 가져옴
	const session = await getServerSession(authOptions);

	// (2) 세션이 없다면 리다이렉트하거나, 메시지를 띄울 수 있음
	// 여기서는 예시로 로그인 페이지로 리다이렉트
	// if (!session) {
	// 	redirect('/');
	// }

	// (3) 세션이 있다면 클라이언트 컴포넌트에 props로 전달
	return <SettingClient session={session} />;
}
