import { UserRole } from "../contexts/AuthContext";

export type PageRoute =
  | "home"
  | "jobs"
  | "job-detail"
  | "companies"
  | "company-detail"
  | "cv-builder"
  | "blog"
  | "blog-detail"
  | "login"
  | "register"
  | "candidate-dashboard"
  | "employer-dashboard"
  | "hr-dashboard"
  | "admin-dashboard"
  | "post-job"
  | "manage-jobs"
  | "applicants"
  | "manage-users"
  | "manage-companies"
  | "saved-jobs"
  | "my-applications"
  | "profile";

// Define which roles can access which routes
export const rolePermissions: Record<PageRoute, UserRole[] | "public" | "authenticated"> = {
  // Public routes - anyone can access
  home: "public",
  jobs: "public",
  "job-detail": "public",
  companies: "public",
  "company-detail": "public",
  blog: "public",
  "blog-detail": "public",
  login: "public",
  register: "public",

  // Job seeker only
  "candidate-dashboard": ["job-seeker"],
  "my-applications": ["job-seeker"],
  "saved-jobs": ["job-seeker"],

  // Employer and HR can access
  "employer-dashboard": ["employer", "hr"],
  "post-job": ["employer", "hr"],
  "manage-jobs": ["employer", "hr"],
  applicants: ["employer", "hr"],

  // HR only (additional features)
  "hr-dashboard": ["hr"],

  // Admin only
  "admin-dashboard": ["admin"],
  "manage-users": ["admin"],
  "manage-companies": ["admin"],

  // Authenticated users
  "cv-builder": "authenticated",
  profile: "authenticated",
};

// Get default dashboard route based on user role
export function getDefaultDashboard(role: UserRole): PageRoute {
  switch (role) {
    case "admin":
      return "admin-dashboard";
    case "hr":
      return "hr-dashboard";
    case "employer":
      return "employer-dashboard";
    case "job-seeker":
      return "candidate-dashboard";
    default:
      return "home";
  }
}

// Check if user can access a route
export function canAccessRoute(route: PageRoute, userRole: UserRole | null): boolean {
  const permission = rolePermissions[route];

  // Public routes
  if (permission === "public") return true;

  // Need to be authenticated
  if (!userRole) return false;

  // Routes that need authentication (any role)
  if (permission === "authenticated") return true;

  // Role-specific routes
  if (Array.isArray(permission)) {
    return permission.includes(userRole);
  }

  return false;
}

// Get redirect route when access denied
export function getRedirectRoute(userRole: UserRole | null, attemptedRoute: PageRoute): PageRoute {
  // If not logged in and trying to access protected route, go to login
  if (!userRole && rolePermissions[attemptedRoute] !== "public") {
    return "login";
  }

  // If logged in but no permission, redirect to their dashboard
  if (userRole) {
    return getDefaultDashboard(userRole);
  }

  // Default to home
  return "home";
}

// Navigation helpers
export interface NavItem {
  label: string;
  route: PageRoute;
  icon?: string;
}

export function getNavigationItems(userRole: UserRole | null): NavItem[] {
  const publicNav: NavItem[] = [
    { label: "Trang chủ", route: "home" },
    { label: "Tìm việc làm", route: "jobs" },
    { label: "Công ty", route: "companies" },
    { label: "Blog", route: "blog" },
  ];

  if (!userRole) {
    return publicNav;
  }

  // Add role-specific navigation
  const roleNav: Record<UserRole, NavItem[]> = {
    "job-seeker": [
      ...publicNav,
      { label: "Dashboard", route: "candidate-dashboard" },
      { label: "Đơn ứng tuyển", route: "my-applications" },
      { label: "Việc làm đã lưu", route: "saved-jobs" },
      { label: "Tạo CV", route: "cv-builder" },
    ],
    employer: [
      ...publicNav,
      { label: "Dashboard", route: "employer-dashboard" },
      { label: "Đăng tin", route: "post-job" },
      { label: "Quản lý tin", route: "manage-jobs" },
      { label: "Ứng viên", route: "applicants" },
    ],
    hr: [
      ...publicNav,
      { label: "Dashboard", route: "hr-dashboard" },
      { label: "Đăng tin", route: "post-job" },
      { label: "Quản lý tin", route: "manage-jobs" },
      { label: "Ứng viên", route: "applicants" },
    ],
    admin: [
      { label: "Dashboard", route: "admin-dashboard" },
      { label: "Quản lý users", route: "manage-users" },
      { label: "Quản lý công ty", route: "manage-companies" },
      { label: "Quản lý tin", route: "manage-jobs" },
      { label: "Xem website", route: "home" },
    ],
  };

  return roleNav[userRole] || publicNav;
}
