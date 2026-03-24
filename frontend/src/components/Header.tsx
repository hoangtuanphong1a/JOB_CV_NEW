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
  Camera,
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
    avatar?: string;
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
        { name: "Việc làm Kế Toán", href: "/jobs?category=accounting", icon: Briefcase },
        { name: "Việc làm Tài Chính", href: "/jobs?category=finance", icon: Briefcase },
        { name: "Việc làm Kinh Doanh", href: "/jobs?category=sales", icon: Briefcase },
        { name: "Việc làm Nhân Sự", href: "/jobs?category=hr", icon: Briefcase },
        { name: "Việc làm Xây Dựng", href: "/jobs?category=construction", icon: Briefcase },
        { name: "Việc làm Y Tế", href: "/jobs?category=healthcare", icon: Briefcase },
        { name: "Việc làm Giáo Dục", href: "/jobs?category=education", icon: Briefcase },
        { name: "Việc làm Luật", href: "/jobs?category=legal", icon: Briefcase },
        {
          name: "Việc theo ngành nghề",
          href: "/jobs/categories",
          icon: Briefcase,
        },
        {
          name: "Việc theo địa điểm",
          href: "/jobs/locations",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Hồ Chí Minh",
          href: "/jobs?location=hcm",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Hà Nội",
          href: "/jobs?location=hanoi",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Đà Nẵng",
          href: "/jobs?location=danang",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Cần Thơ",
          href: "/jobs?location=cantho",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Bình Dương",
          href: "/jobs?location=binhduong",
          icon: Briefcase,
        },
        {
          name: "Việc làm Nổi bật",
          href: "/jobs?featured=true",
          icon: Briefcase,
        },
        {
          name: "Việc làm Tuyển gấp",
          href: "/jobs?urgent=true",
          icon: Briefcase,
        },
        {
          name: "Việc làm Part-time",
          href: "/jobs?type=parttime",
          icon: Briefcase,
        },
        { name: "Việc làm Remote", href: "/jobs?remote=true", icon: Briefcase },
        {
          name: "Việc làm Không cần kinh nghiệm",
          href: "/jobs?experience=none",
          icon: Briefcase,
        },
        {
          name: "Việc làm Mới tốt nghiệp",
          href: "/jobs?experience=fresh",
          icon: Briefcase,
        },
        {
          name: "Việc làm Có kinh nghiệm",
          href: "/jobs?experience=experienced",
          icon: Briefcase,
        },
        {
          name: "Việc làm Quản lý",
          href: "/jobs?experience=manager",
          icon: Briefcase,
        },
        {
          name: "Việc làm Thực tập",
          href: "/jobs?experience=intern",
          icon: Briefcase,
        },
        {
          name: "Việc làm Toàn thời gian",
          href: "/jobs?type=fulltime",
          icon: Briefcase,
        },
        {
          name: "Việc làm Hợp đồng",
          href: "/jobs?type=contract",
          icon: Briefcase,
        },
        {
          name: "Việc làm Nghề tự do",
          href: "/jobs?type=freelance",
          icon: Briefcase,
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
        { name: "Nổi bật", href: "/companies?featured=true", icon: Building2 },
        {
          name: "Tiêu biểu",
          href: "/companies?highlighted=true",
          icon: Building2,
        },
        {
          name: "Công nghệ",
          href: "/companies?industry=technology",
          icon: Building2,
        },
        {
          name: "Y tế",
          href: "/companies?industry=healthcare",
          icon: Building2,
        },
        {
          name: "Giáo dục",
          href: "/companies?industry=education",
          icon: Building2,
        },
        {
          name: "Bảo hiểm",
          href: "/companies?industry=insurance",
          icon: Building2,
        },
        {
          name: "Ngân hàng",
          href: "/companies?industry=banking",
          icon: Building2,
        },
        {
          name: "Marketing",
          href: "/companies?industry=marketing",
          icon: Building2,
        },
        {
          name: "Nhà hàng",
          href: "/companies?industry=restaurant",
          icon: Building2,
        },
        {
          name: "Khách sạn",
          href: "/companies?industry=hotel",
          icon: Building2,
        },
        {
          name: "Bất động sản",
          href: "/companies?industry=realestate",
          icon: Building2,
        },
        {
          name: "Công nghiệp",
          href: "/companies?industry=manufacturing",
          icon: Building2,
        },
        {
          name: "Thương mại",
          href: "/companies?industry=trading",
          icon: Building2,
        },
        {
          name: "Dịch vụ",
          href: "/companies?industry=services",
          icon: Building2,
        },
        {
          name: "Xây dựng",
          href: "/companies?industry=construction",
          icon: Building2,
        },
        {
          name: "Giao thông vận tải",
          href: "/companies?industry=transportation",
          icon: Building2,
        },
        {
          name: "Logistics",
          href: "/companies?industry=logistics",
          icon: Building2,
        },
        {
          name: "Nông nghiệp",
          href: "/companies?industry=agriculture",
          icon: Building2,
        },
        {
          name: "Khai khoáng",
          href: "/companies?industry=mining",
          icon: Building2,
        },
        {
          name: "Năng lượng",
          href: "/companies?industry=energy",
          icon: Building2,
        },
        {
          name: "Môi trường",
          href: "/companies?industry=environment",
          icon: Building2,
        },
        {
          name: "Tư vấn",
          href: "/companies?industry=consulting",
          icon: Building2,
        },
        { name: "Luật", href: "/companies?industry=legal", icon: Building2 },
        {
          name: "Kế toán",
          href: "/companies?industry=accounting",
          icon: Building2,
        },
        {
          name: "Kiểm toán",
          href: "/companies?industry=auditing",
          icon: Building2,
        },
        {
          name: "Quảng cáo",
          href: "/companies?industry=advertising",
          icon: Building2,
        },
        {
          name: "Truyền thông",
          href: "/companies?industry=media",
          icon: Building2,
        },
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
        {
          name: "Kỹ năng mềm",
          href: "/blog?category=soft-skills",
          icon: FileText,
        },
        {
          name: "Kỹ năng chuyên môn",
          href: "/blog?category=professional-skills",
          icon: FileText,
        },
        {
          name: "Tâm sự nghề nghiệp",
          href: "/blog?category=career-stories",
          icon: FileText,
        },
        {
          name: "Tin tức ngành",
          href: "/blog?category=industry-news",
          icon: FileText,
        },
        {
          name: "Hướng nghiệp",
          href: "/blog?category=career-guidance",
          icon: FileText,
        },
        {
          name: "Thị trường lao động",
          href: "/blog?category=labor-market",
          icon: FileText,
        },
        {
          name: "Bí quyết thành công",
          href: "/blog?category=success-tips",
          icon: FileText,
        },
        {
          name: "Câu chuyện thành đạt",
          href: "/blog?category=success-stories",
          icon: FileText,
        },
        {
          name: "Tư vấn nghề nghiệp",
          href: "/blog?category=career-advice",
          icon: FileText,
        },
      ],
    },
    {
      name: "Tạo CV",
      href: "/cv-builder",
      current:
        pathname === "/cv-builder" ||
        pathname?.startsWith("/cv-template/") ||
        pathname?.startsWith("/cv-preview/"),
      hasDropdown: true,
      dropdownItems: [
        { name: "Chọn mẫu CV", href: "/cv-builder", icon: FileText },
        { name: "Tạo CV mới", href: "/cv-builder", icon: FileText },
        {
          name: "Mẫu CV chuyên nghiệp",
          href: "/cv-builder?category=professional",
          icon: FileText,
        },
        {
          name: "Mẫu CV hiện đại",
          href: "/cv-builder?category=modern",
          icon: FileText,
        },
        {
          name: "Mẫu CV sáng tạo",
          href: "/cv-builder?category=creative",
          icon: FileText,
        },
        { name: "CV miễn phí", href: "/cv-builder?free=true", icon: FileText },
        {
          name: "CV cao cấp",
          href: "/cv-builder?premium=true",
          icon: FileText,
        },
        {
          name: "CV theo ngành nghề",
          href: "/cv-builder?industry=true",
          icon: FileText,
        },
        {
          name: "CV IT/Công nghệ",
          href: "/cv-builder?industry=it",
          icon: FileText,
        },
        {
          name: "CV Marketing",
          href: "/cv-builder?industry=marketing",
          icon: FileText,
        },
        {
          name: "CV Kế toán",
          href: "/cv-builder?industry=accounting",
          icon: FileText,
        },
        {
          name: "CV Kinh doanh",
          href: "/cv-builder?industry=business",
          icon: FileText,
        },
        {
          name: "CV Hành chính",
          href: "/cv-builder?industry=admin",
          icon: FileText,
        },
        {
          name: "CV Y tế",
          href: "/cv-builder?industry=healthcare",
          icon: FileText,
        },
        {
          name: "CV Giáo dục",
          href: "/cv-builder?industry=education",
          icon: FileText,
        },
        {
          name: "CV Xây dựng",
          href: "/cv-builder?industry=construction",
          icon: FileText,
        },
        {
          name: "CV theo kinh nghiệm",
          href: "/cv-builder?experience=true",
          icon: FileText,
        },
        {
          name: "CV cho sinh viên",
          href: "/cv-builder?experience=student",
          icon: FileText,
        },
        {
          name: "CV cho người đi làm",
          href: "/cv-builder?experience=professional",
          icon: FileText,
        },
        {
          name: "CV cho quản lý",
          href: "/cv-builder?experience=manager",
          icon: FileText,
        },
        {
          name: "CV cho thực tập",
          href: "/cv-builder?experience=intern",
          icon: FileText,
        },
        {
          name: "CV theo trình độ",
          href: "/cv-builder?level=true",
          icon: FileText,
        },
        {
          name: "CV tiếng Anh",
          href: "/cv-builder?language=en",
          icon: FileText,
        },
        {
          name: "CV tiếng Việt",
          href: "/cv-builder?language=vi",
          icon: FileText,
        },
        {
          name: "CV song ngữ",
          href: "/cv-builder?language=bilingual",
          icon: FileText,
        },
        {
          name: "CV theo mục đích",
          href: "/cv-builder?purpose=true",
          icon: FileText,
        },
        {
          name: "CV xin việc",
          href: "/cv-builder?purpose=job",
          icon: FileText,
        },
        {
          name: "CV du học",
          href: "/cv-builder?purpose=study",
          icon: FileText,
        },
        {
          name: "CV xin visa",
          href: "/cv-builder?purpose=visa",
          icon: FileText,
        },
        {
          name: "CV học bổng",
          href: "/cv-builder?purpose=scholarship",
          icon: FileText,
        },
      ],
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
                  <DropdownMenuContent align="start" className="w-[1200px]">
                    <div className="grid grid-cols-5 gap-4 p-4">
                      {item.dropdownItems?.map((dropdownItem, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => handleNavigation(dropdownItem.href)}
                          className="cursor-pointer p-2 hover:bg-gray-100 rounded-md whitespace-nowrap"
                        >
                          <div className="flex items-center gap-2">
                            <dropdownItem.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs font-normal">
                              {dropdownItem.name}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
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
              ),
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

                {/* Favorite Jobs Icon */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation("/saved-jobs")}
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                </Button>

                {/* Avatar Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {(user?.name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
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
                      onClick={() => handleNavigation("/dashboard/user")}
                      className="cursor-pointer"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {user?.roles?.includes("admin") ? "Quản trị hệ thống" : 
                       user?.roles?.includes("hr") ? "Quản lý tuyển dụng" : 
                       user?.roles?.includes("employer") ? "Quản lý doanh nghiệp" : 
                       user?.roles?.includes("job_seeker") ? "Hồ sơ ứng viên" : "Dashboard"}
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
                      <>
                        <button
                          onClick={() => handleNavigation("/saved-jobs")}
                          className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          Việc làm đã lưu
                        </button>
                        <button
                          onClick={() => handleNavigation("/cv-management")}
                          className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          Quản lý CV
                        </button>
                      </>
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