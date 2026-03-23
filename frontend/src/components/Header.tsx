"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Menu,
  User,
  Crown,
  LogOut,
  Settings,
  Briefcase,
  ChevronDown,
  Building2,
  FileText,
  Search,
  TrendingUp,
  Heart,
  Bell,
  MessageCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    userType?: string;
    roles?: string[];
  } | null>(null);

  // Update auth state when component mounts or when localStorage changes
  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    // Check auth state on mount
    checkAuthState();

    // Listen for storage changes (in case login happens in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "user") {
        checkAuthState();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom login event that can be dispatched after login
    const handleLoginEvent = () => checkAuthState();
    window.addEventListener("userLogin", handleLoginEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogin", handleLoginEvent);
    };
  }, []);

  const navigation = [
    {
      name: "Trang chủ",
      href: "/",
      current: pathname === "/",
      hasDropdown: false,
    },
    {
      name: "Việc làm",
      href: "/jobs",
      current: pathname === "/jobs" || pathname?.startsWith("/jobs/"),
      hasDropdown: true,
      dropdownItems: [
        { name: "Tìm việc làm", href: "/jobs", icon: Search },
        { name: "Đăng tin tuyển dụng", href: "/jobs/post", icon: Briefcase },
        { name: "Việc làm IT", href: "/jobs?category=it", icon: TrendingUp },
        {
          name: "Việc làm Marketing",
          href: "/jobs?category=marketing",
          icon: TrendingUp,
        },
      ],
    },
    {
      name: "Công ty",
      href: "/companies",
      current: pathname === "/companies" || pathname?.startsWith("/companies/"),
      hasDropdown: true,
      dropdownItems: [
        { name: "Danh sách công ty", href: "/companies", icon: Building2 },
        { name: "Top công ty", href: "/companies/top", icon: TrendingUp },
        { name: "Công ty IT", href: "/companies?industry=it", icon: Building2 },
        { name: "Công ty lớn", href: "/companies?size=large", icon: Building2 },
      ],
    },
    {
      name: "Blog",
      href: "/blog",
      current: pathname === "/blog" || pathname?.startsWith("/blog/"),
      hasDropdown: true,
      dropdownItems: [
        { name: "Tất cả bài viết", href: "/blog", icon: FileText },
        { name: "CV & Tuyển dụng", href: "/blog?category=cv", icon: FileText },
        { name: "Phỏng vấn", href: "/blog?category=interview", icon: FileText },
        {
          name: "Phát triển nghề nghiệp",
          href: "/blog?category=career",
          icon: FileText,
        },
      ],
    },
    {
      name: "Công cụ CV",
      href: "/cv-builder",
      current: pathname === "/cv-builder",
      hasDropdown: false,
    },
  ];

  const filteredNavigation = navigation;

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const getDashboardRoute = () => {
    // Check roles array with proper priority: admin > hr > employer > job_seeker
    if (user?.roles?.includes("admin")) {
      return "/dashboard/admin";
    } else if (user?.roles?.includes("hr")) {
      return "/dashboard/hr";
    } else if (user?.roles?.includes("employer")) {
      return "/dashboard/employer";
    } else if (user?.roles?.includes("job_seeker")) {
      return "/dashboard/candidate"; // For job seekers, redirect to candidate dashboard
    } else {
      return "/jobs"; // Default fallback
    }
  };

  const getRoleDisplayInfo = () => {
    if (user?.roles?.includes("admin")) {
      return {
        label: "Quản trị viên",
        color: "bg-red-100 text-red-800",
        icon: Crown,
      };
    } else if (user?.roles?.includes("hr")) {
      return {
        label: "HR",
        color: "bg-purple-100 text-purple-800",
        icon: User,
      };
    } else if (user?.roles?.includes("employer")) {
      return {
        label: "Nhà tuyển dụng",
        color: "bg-orange-100 text-orange-800",
        icon: Building2,
      };
    } else if (user?.roles?.includes("job_seeker")) {
      return {
        label: "Ứng viên",
        color: "bg-blue-100 text-blue-800",
        icon: User,
      };
    }
    return {
      label: "Người dùng",
      color: "bg-gray-100 text-gray-800",
      icon: User,
    };
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation("/")}
              className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity"
            >
              <Crown className="h-8 w-8" style={{ color: "#f26b38" }} />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                CVKing
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {filteredNavigation.map((item) =>
              item.hasDropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`${
                        item.current
                          ? "text-orange-600 border-b-2 border-orange-600"
                          : "text-gray-500 hover:text-gray-700"
                      } px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1`}
                    >
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {item.dropdownItems?.map((dropdownItem, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => handleNavigation(dropdownItem.href)}
                        className="cursor-pointer"
                      >
                        <dropdownItem.icon className="h-4 w-4 mr-2" />
                        {dropdownItem.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`${
                    item.current
                      ? "text-orange-600 border-b-2 border-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  {item.name}
                </button>
              )
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation("/notifications")}
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                </Button>

                {/* Chat Icon */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation("/messages")}
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                >
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                </Button>

                {/* Avatar Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
                    >
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {(user?.name || "U").charAt(0).toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || ""}
                      </p>
                      <span
                        className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                          getRoleDisplayInfo().color
                        }`}
                      >
                        {getRoleDisplayInfo().label}
                      </span>
                    </div>

                    <DropdownMenuItem
                      onClick={() => handleNavigation(getDashboardRoute())}
                      className="cursor-pointer"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>

                    {user?.roles?.includes("job_seeker") && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleNavigation("/saved-jobs")}
                          className="cursor-pointer"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Việc làm đã lưu
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleNavigation("/cv-management")}
                          className="cursor-pointer"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Quản lý CV
                        </DropdownMenuItem>
                      </>
                    )}

                    {user?.roles?.includes("employer") && (
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/jobs/post")}
                        className="cursor-pointer"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Đăng tin tuyển dụng
                      </DropdownMenuItem>
                    )}

                    {user?.roles?.includes("hr") && (
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/dashboard/hr")}
                        className="cursor-pointer"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Quản lý tuyển dụng
                      </DropdownMenuItem>
                    )}

                    {user?.roles?.includes("admin") && (
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/dashboard/admin")}
                        className="cursor-pointer"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Quản trị hệ thống
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => handleNavigation("/settings")}
                      className="cursor-pointer"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Cài đặt tài khoản
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleNavigation("/notifications")}
                      className="cursor-pointer"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Thông báo
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => {
                        // Clear localStorage and redirect to login
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("user");
                        // Dispatch custom event to update header
                        window.dispatchEvent(new CustomEvent("userLogin"));
                        router.push("/auth/login");
                      }}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation("/auth/login")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Đăng nhập
                </Button>
                <Button
                  size="sm"
                  style={{ backgroundColor: "#f26b38" }}
                  className="hover:bg-orange-600"
                  onClick={() => handleNavigation("/auth/register")}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="px-4 py-4 space-y-4">
              {filteredNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors ${
                    item.current
                      ? "text-orange-600 border-l-4 border-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.name}
                </button>
              ))}

              <div className="border-t pt-4 space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium text-gray-900">
                      {user?.name || "User"}
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded ${
                          getRoleDisplayInfo().color
                        }`}
                      >
                        {getRoleDisplayInfo().label}
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavigation(getDashboardRoute())}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Dashboard
                    </button>
                    {user?.roles?.includes("job_seeker") && (
                      <button
                        onClick={() => handleNavigation("/cv-management")}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Quản lý CV
                      </button>
                    )}
                    {user?.roles?.includes("employer") && (
                      <button
                        onClick={() => handleNavigation("/jobs/post")}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Đăng tin tuyển dụng
                      </button>
                    )}
                    {user?.roles?.includes("hr") && (
                      <button
                        onClick={() => handleNavigation("/dashboard/hr")}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Quản lý tuyển dụng
                      </button>
                    )}
                    {user?.roles?.includes("admin") && (
                      <button
                        onClick={() => handleNavigation("/dashboard/admin")}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Quản trị hệ thống
                      </button>
                    )}
                    <button
                      onClick={() => console.log("Logout")}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleNavigation("/auth/login")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Đăng nhập
                    </Button>
                    <Button
                      size="sm"
                      className="w-full bg-[#f26b38] hover:bg-[#e05a27]"
                      onClick={() => handleNavigation("/auth/register")}
                    >
                      Đăng ký
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
