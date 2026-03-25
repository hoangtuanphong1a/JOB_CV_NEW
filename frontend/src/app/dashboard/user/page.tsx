"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardUserPage() {
  const router = useRouter();

  useEffect(() => {
    // Check user authentication from localStorage
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        const userRoles = userData.roles || [];

        // Redirect based on user roles
        if (userRoles.includes("admin")) {
          router.push("/dashboard/admin");
        } else if (userRoles.includes("hr")) {
          router.push("/dashboard/hr");
        } else if (userRoles.includes("employer")) {
          router.push("/dashboard/employer");
        } else if (userRoles.includes("job_seeker")) {
          router.push("/dashboard/candidate");
        } else {
          // Default fallback - if no specific role, redirect to candidate dashboard
          router.push("/dashboard/candidate");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push('/auth/login');
      }
    } else {
      // Default to candidate dashboard if no user data
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
