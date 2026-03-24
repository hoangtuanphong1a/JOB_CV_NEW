import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PageRoute, canAccessRoute, getRedirectRoute } from "./utils/routing";

// Pages
import { Hero } from "./components/Hero";
import { SearchBar } from "./components/SearchBar";
import { JobCategories } from "./components/JobCategories";
import { FeaturedJobs } from "./components/FeaturedJobs";
import { FeaturedCompanies } from "./components/FeaturedCompanies";
import { BlogPreview } from "./components/BlogPreview";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { JobSearchPage } from "./pages/JobSearchPage";
import { JobDetailPage } from "./pages/JobDetailPage";
import { CVBuilderPage } from "./pages/CVBuilderPage";
import { BlogListPage } from "./pages/BlogListPage";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { CompanyListPage } from "./pages/CompanyListPage";
import { CompanyDetailPage } from "./pages/CompanyDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CandidateDashboard } from "./pages/CandidateDashboard";
import { EmployerDashboard } from "./pages/EmployerDashboard";
import { PostJobPage } from "./pages/PostJobPage";
import { HRDashboard } from "./pages/HRDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

// HomePage Component
function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <SearchBar />
      <JobCategories />
      <FeaturedJobs />
      <FeaturedCompanies />
      <BlogPreview />
      <Footer />
    </div>
  );
}

// Router Component
function Router() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageRoute>("home");

  // Make setCurrentPage globally available for navigation
  useEffect(() => {
    (window as any).navigateTo = (page: PageRoute) => {
      // Check if user can access the route
      if (canAccessRoute(page, user?.role || null)) {
        setCurrentPage(page);
      } else {
        // Redirect to appropriate page if access denied
        const redirectTo = getRedirectRoute(user?.role || null, page);
        setCurrentPage(redirectTo);
      }
    };
  }, [user]);

  // Auto-redirect based on authentication state
  useEffect(() => {
    // If trying to access login/register while authenticated, redirect to dashboard
    if (isAuthenticated && (currentPage === "login" || currentPage === "register")) {
      if (user?.role === "admin") {
        setCurrentPage("admin-dashboard");
      } else if (user?.role === "hr") {
        setCurrentPage("hr-dashboard");
      } else if (user?.role === "employer") {
        setCurrentPage("employer-dashboard");
      } else if (user?.role === "job-seeker") {
        setCurrentPage("candidate-dashboard");
      }
    }

    // Check if current page is accessible
    if (!canAccessRoute(currentPage, user?.role || null)) {
      const redirectTo = getRedirectRoute(user?.role || null, currentPage);
      setCurrentPage(redirectTo);
    }
  }, [isAuthenticated, user, currentPage]);

  // Render page based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "jobs":
        return <JobSearchPage />;
      case "job-detail":
        return <JobDetailPage />;
      case "cv-builder":
        return <CVBuilderPage />;
      case "blog":
        return <BlogListPage />;
      case "blog-detail":
        return <BlogDetailPage />;
      case "companies":
        return <CompanyListPage />;
      case "company-detail":
        return <CompanyDetailPage />;
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      case "candidate-dashboard":
        return <CandidateDashboard />;
      case "employer-dashboard":
        return <EmployerDashboard />;
      case "hr-dashboard":
        return <HRDashboard />;
      case "admin-dashboard":
        return <AdminDashboard />;
      case "post-job":
        return <PostJobPage />;
      default:
        return <HomePage />;
    }
  };

  return <>{renderPage()}</>;
}

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

// Helper function for navigation (can be used in any component)
declare global {
  interface Window {
    navigateTo: (page: PageRoute) => void;
  }
}
