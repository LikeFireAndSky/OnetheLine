import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		userId?: string; // 사용자 구분을 위한 ID (DynamoDB 파티션 키)
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		userId?: string; // 고유 ID (Google 사용자는 Google 'sub')
		provider?: string; // 로그인한 IdP 이름 (예: 'Google')
	}
}

declare module 'react' {
	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		placeholder?: string; // placeholder 속성 추가
		onPointerEnterCapture?: () => void; // onPointerEnterCapture 속성 추가
		onPointerLeaveCapture?: () => void; // onPointerLeaveCapture 속성 추가
	}
}
