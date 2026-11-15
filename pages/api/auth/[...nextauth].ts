import NextAuth from 'next-auth';
import { authOptions } from '@/shared/auth/authOptions';

// 기존 import 경로('@/pages/api/auth/[...nextauth]') 호환용 재export
export { authOptions };

export default NextAuth(authOptions);
