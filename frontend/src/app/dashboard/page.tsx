"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check user authentication and type
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      try {
        const userData = JSON.parse(user);
        const role = userData.role || userData.userType || 'job-seeker';

        // Redirect to appropriate dashboard based on role
        if (role === 'admin') {
          router.push('/dashboard/admin');
        } else if (role === 'employer' || role === 'hr') {
          router.push('/dashboard/hr');
        } else {
          router.push('/dashboard/candidate');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/auth/login');
      }
    } else {
      // Default to candidate dashboard if no user type specified
      router.push('/dashboard/candidate');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    </div>
  );
}
