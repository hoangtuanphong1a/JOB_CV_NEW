import { Metadata } from 'next';
import LoginPage from '@/modules/client/LoginPage';

// Add caching for landing page to reduce server load
export const revalidate = 300; // Cache for 5 minutes
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Đăng nhập',
};

export default function Page() {
  return <LoginPage />;
}
