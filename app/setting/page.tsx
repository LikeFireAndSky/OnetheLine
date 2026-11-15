// app/setting/page.tsx
import { getServerSession } from 'next-auth';
import SettingClient from './SettingClient';
import { authOptions } from '@/shared/auth/authOptions';

export default async function SettingPage() {
	// (1) 서버에서 세션 정보를 미리 가져옴
	const session = await getServerSession(authOptions);

	// (2) 클라이언트 컴포넌트에는 화면에 필요한 값(이메일)만 전달
	const account = session?.user ? { email: session.user.email ?? '' } : null;

	return <SettingClient account={account} />;
}
