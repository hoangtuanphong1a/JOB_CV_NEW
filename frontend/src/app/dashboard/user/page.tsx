import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/services/userService";

export default async function DashboardUserPage() {
  // Try to get session from server-side
  const session = await getServerSession(authOptions);

  // Debug: Log session
  console.log("Server Session:", session);

  if (!session?.user) {
    console.log("No session user, redirecting to login");
    redirect("/auth/login");
  }

  try {
    // Try to get user from UserService
    const user = await UserService.getProfile();

    // Debug: Log user roles
    console.log("User roles:", user.roles);

    // Redirect based on user roles
    if (user.roles?.includes("admin")) {
      redirect("/dashboard/admin");
    } else if (user.roles?.includes("hr")) {
      redirect("/dashboard/hr");
    } else if (user.roles?.includes("employer")) {
      redirect("/dashboard/employer");
    } else if (user.roles?.includes("job_seeker")) {
      redirect("/dashboard/candidate");
    } else {
      // Default fallback - if no specific role, redirect to candidate dashboard
      redirect("/dashboard/candidate");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    redirect("/auth/login");
  }
}
