import { Metadata } from 'next';
import RegisterPage from '@/modules/client/RegisterPage';

// Add caching for landing page to reduce server load
export const revalidate = 300; // Cache for 5 minutes
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Đăng ký',
};

export default function Page() {
  return <RegisterPage />;
}
