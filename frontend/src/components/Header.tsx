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
        { name: "Quản lí việc làm", href: "/jobs/manage", icon: Briefcase },
        { name: "Việc làm đã lưu", href: "/saved-jobs", icon: Heart },
        {
          name: "Việc làm đã ứng tuyển",
          href: "/jobs/applied",
          icon: Briefcase,
        },
        {
          name: "Việc làm chờ ứng tuyển",
          href: "/jobs/pending",
          icon: Briefcase,
        },
        {
          name: "Việc theo ngành nghề",
          href: "/jobs/categories",
          icon: Briefcase,
        },
        {
          name: "Việc làm Công Nghệ Thông Tin",
          href: "/jobs?category=it",
          icon: Briefcase,
        },
        {
          name: "Việc làm Kế Toán/Kiểm Toán",
          href: "/jobs?category=accounting",
          icon: Briefcase,
        },
        {
          name: "Việc làm Tài Chính/Ngân Hàng",
          href: "/jobs?category=finance",
          icon: Briefcase,
        },
        {
          name: "Việc làm Hành Chính/Văn Phòng",
          href: "/jobs?category=admin",
          icon: Briefcase,
        },
        {
          name: "Việc làm Kinh Doanh/Bán Hàng",
          href: "/jobs?category=sales",
          icon: Briefcase,
        },
        {
          name: "Việc làm Marketing/Quảng Cáo",
          href: "/jobs?category=marketing",
          icon: Briefcase,
        },
        {
          name: "Việc làm Xây Dựng/Kiến Trúc",
          href: "/jobs?category=construction",
          icon: Briefcase,
        },
        {
          name: "Việc làm Y Tế/Dược",
          href: "/jobs?category=healthcare",
          icon: Briefcase,
        },
        {
          name: "Việc làm Giáo Dục/Đào Tạo",
          href: "/jobs?category=education",
          icon: Briefcase,
        },
        {
          name: "Việc làm Nhân Sự",
          href: "/jobs?category=hr",
          icon: Briefcase,
        },
        {
          name: "Việc làm Luật/Pháp Lý",
          href: "/jobs?category=legal",
          icon: Briefcase,
        },
        {
          name: "Việc làm Bán Hàng",
          href: "/jobs?category=sales",
          icon: Briefcase,
        },
        {
          name: "Việc làm Kỹ Thuật",
          href: "/jobs?category=engineering",
          icon: Briefcase,
        },
        {
          name: "Việc làm Dịch Vụ",
          href: "/jobs?category=services",
          icon: Briefcase,
        },
        {
          name: "Việc làm Nghệ Thuật/Thiết Kế",
          href: "/jobs?category=art",
          icon: Briefcase,
        },
        {
          name: "Việc làm Du Lịch/Khách Sạn",
          href: "/jobs?category=hotel",
          icon: Briefcase,
        },
        {
          name: "Việc làm Bất Động Sản",
          href: "/jobs?category=realestate",
          icon: Briefcase,
        },
        {
          name: "Việc làm Bảo Hiểm",
          href: "/jobs?category=insurance",
          icon: Briefcase,
        },
        {
          name: "Việc làm Ngân Hàng",
          href: "/jobs?category=banking",
          icon: Briefcase,
        },
        {
          name: "Việc làm Xuất Nhập Khẩu",
          href: "/jobs?category=importexport",
          icon: Briefcase,
        },
        {
          name: "Việc làm Logistic/Vận Tải",
          href: "/jobs?category=logistics",
          icon: Briefcase,
        },
        {
          name: "Việc làm Nông Lâm/Ngư Nghiệp",
          href: "/jobs?category=agriculture",
          icon: Briefcase,
        },
        {
          name: "Việc làm Cơ Khí/Chế Tạo",
          href: "/jobs?category=mechanical",
          icon: Briefcase,
        },
        {
          name: "Việc làm Điện/Điện Tử",
          href: "/jobs?category=electronics",
          icon: Briefcase,
        },
        {
          name: "Việc làm Dầu Khí/Hóa Chất",
          href: "/jobs?category=chemical",
          icon: Briefcase,
        },
        {
          name: "Việc làm Thời Trang/Mỹ Phẩm",
          href: "/jobs?category=fashion",
          icon: Briefcase,
        },
        {
          name: "Việc làm Báo Chí/Truyền Thông",
          href: "/jobs?category=media",
          icon: Briefcase,
        },
        {
          name: "Việc làm Thể Thao/Vận Động",
          href: "/jobs?category=sports",
          icon: Briefcase,
        },
        {
          name: "Việc làm Công Viên/Nghĩa Trang",
          href: "/jobs?category=cemetery",
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
          name: "Việc làm tại Đà Nẵng",
          href: "/jobs?location=danang",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Hà Nội",
          href: "/jobs?location=hanoi",
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
          name: "Việc làm tại Đắk Lắk",
          href: "/jobs?location=daklak",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Hải Phòng",
          href: "/jobs?location=haiphong",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại An Giang",
          href: "/jobs?location=angiang",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Bà Rịa - Vũng Tàu",
          href: "/jobs?location=vungtau",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Bắc Giang",
          href: "/jobs?location=bacgiang",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Bắc Kạn",
          href: "/jobs?location=bacan",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Bạc Liêu",
          href: "/jobs?location=baclieu",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Bắc Ninh",
          href: "/jobs?location=bacninh",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Bến Tre",
          href: "/jobs?location=bentre",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Bình Định",
          href: "/jobs?location=binhdinh",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Bình Phước",
          href: "/jobs?location=binhphuoc",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Bình Thuận",
          href: "/jobs?location=binhthuan",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Cà Mau",
          href: "/jobs?location=camau",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Cao Bằng",
          href: "/jobs?location=caobang",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Đắk Nông",
          href: "/jobs?location=daknong",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Điện Biên",
          href: "/jobs?location=dienbien",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Đồng Nai",
          href: "/jobs?location=donai",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Đồng Tháp",
          href: "/jobs?location=dongthap",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Gia Lai",
          href: "/jobs?location=gialai",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Hà Giang",
          href: "/jobs?location=hagiang",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Hà Nam",
          href: "/jobs?location=hanam",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Hà Tĩnh",
          href: "/jobs?location=hatinh",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Hải Dương",
          href: "/jobs?location=haiduong",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Hậu Giang",
          href: "/jobs?location=haugiang",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Hòa Bình",
          href: "/jobs?location=hoabinh",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Hưng Yên",
          href: "/jobs?location=hungyen",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Khánh Hòa",
          href: "/jobs?location=khanhhoa",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Kiên Giang",
          href: "/jobs?location=kiengiang",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Kon Tum",
          href: "/jobs?location=kontum",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Lai Châu",
          href: "/jobs?location=laichau",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Lâm Đồng",
          href: "/jobs?location=lamdong",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Lạng Sơn",
          href: "/jobs?location=langson",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Lào Cai",
          href: "/jobs?location=laocai",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Long An",
          href: "/jobs?location=longan",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Nam Định",
          href: "/jobs?location=namdinh",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Nghệ An",
          href: "/jobs?location=nghean",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Ninh Bình",
          href: "/jobs?location=ninhbinh",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Ninh Thuận",
          href: "/jobs?location=ninhthuan",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Phú Thọ",
          href: "/jobs?location=phutho",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Phú Yên",
          href: "/jobs?location=phuyen",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Quảng Bình",
          href: "/jobs?location=quangbinh",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Quảng Nam",
          href: "/jobs?location=quangnam",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Quảng Ngãi",
          href: "/jobs?location=quangngai",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Quảng Ninh",
          href: "/jobs?location=quangninh",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Quảng Trị",
          href: "/jobs?location=quangtri",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Sóc Trăng",
          href: "/jobs?location=soctrang",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Sơn La",
          href: "/jobs?location=sonla",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Tây Ninh",
          href: "/jobs?location=tayninh",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Thái Bình",
          href: "/jobs?location=thaibinh",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Thái Nguyên",
          href: "/jobs?location=thainguyen",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Thanh Hóa",
          href: "/jobs?location=thanhhoa",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Thừa Thiên Huế",
          href: "/jobs?location=thuathienhue",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Tiền Giang",
          href: "/jobs?location=tiengiang",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Trà Vinh",
          href: "/jobs?location=travinh",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Tuyên Quang",
          href: "/jobs?location=tuyenquang",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Vĩnh Long",
          href: "/jobs?location=vinhlong",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Vĩnh Phúc",
          href: "/jobs?location=vinhphuc",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Yên Bái",
          href: "/jobs?location=yenbai",
          icon: Briefcase,
        },
        {
          name: "Việc làm tại Nước Ngoài",
          href: "/jobs?location=abroad",
          icon: Briefcase,
        },
        {
          name: "Việc theo nhu cầu",
          href: "/jobs/requirements",
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
          name: "Việc làm Phổ thông",
          href: "/jobs?level=general",
          icon: Briefcase,
        },
        {
          name: "Việc làm Sinh viên",
          href: "/jobs?experience=student",
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
          name: "Việc làm Bán thời gian",
          href: "/jobs?type=parttime",
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
        { name: "Việc làm Theo ca", href: "/jobs?type=shift", icon: Briefcase },
        {
          name: "Việc làm Theo giờ",
          href: "/jobs?type=hourly",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo dự án",
          href: "/jobs?type=project",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo mùa",
          href: "/jobs?type=seasonal",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo tuần",
          href: "/jobs?type=weekly",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo tháng",
          href: "/jobs?type=monthly",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo năm",
          href: "/jobs?type=yearly",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo ngày",
          href: "/jobs?type=daily",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ hành chính",
          href: "/jobs?type=office",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca đêm",
          href: "/jobs?type=night",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng",
          href: "/jobs?type=morning",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca chiều",
          href: "/jobs?type=afternoon",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca tối",
          href: "/jobs?type=evening",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-tối",
          href: "/jobs?type=morning_evening",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-chiều",
          href: "/jobs?type=morning_afternoon",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca chiều-tối",
          href: "/jobs?type=afternoon_evening",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-chiều-tối",
          href: "/jobs?type=morning_afternoon_evening",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-tối-sáng",
          href: "/jobs?type=morning_evening_morning",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-chiều-tối-sáng",
          href: "/jobs?type=morning_afternoon_evening_morning",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-chiều-tối-sáng-chiều",
          href: "/jobs?type=morning_afternoon_evening_morning_afternoon",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-chiều-tối-sáng-chiều-tối",
          href: "/jobs?type=morning_afternoon_evening_morning_afternoon_evening",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-chiều-tối-sáng-chiều-tối-sáng",
          href: "/jobs?type=morning_afternoon_evening_morning_afternoon_evening_morning",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-chiều-tối-sáng-chiều-tối-sáng-chiều",
          href: "/jobs?type=morning_afternoon_evening_morning_afternoon_evening_morning_afternoon",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-chiều-tối-sáng-chiều-tối-sáng-chiều-tối",
          href: "/jobs?type=morning_afternoon_evening_morning_afternoon_evening_morning_afternoon_evening",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-chiều-tối-sáng-chiều-tối-sáng-chiều-tối-sáng",
          href: "/jobs?type=morning_afternoon_evening_morning_afternoon_evening_morning_afternoon_evening_morning",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-chiều-tối-sáng-chiều-tối-sáng-chiều-tối-sáng-chiều",
          href: "/jobs?type=morning_afternoon_evening_morning_afternoon_evening_morning_afternoon_evening_morning_afternoon",
          icon: Briefcase,
        },
        {
          name: "Việc làm Theo giờ ca sáng-chiều-tối-sáng-chiều-tối-sáng-chiều-tối-sáng-chiều-tối",
          href: "/jobs?type=morning_afternoon_evening_morning_afternoon_evening_morning_afternoon_evening_morning_afternoon_evening",
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
          name: "Thủy sản",
          href: "/companies?industry=aquaculture",
          icon: Building2,
        },
        {
          name: "Lâm nghiệp",
          href: "/companies?industry=forestry",
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
        {
          name: "Xuất bản",
          href: "/companies?industry=publishing",
          icon: Building2,
        },
        {
          name: "Phần mềm",
          href: "/companies?industry=software",
          icon: Building2,
        },
        {
          name: "Phần cứng",
          href: "/companies?industry=hardware",
          icon: Building2,
        },
        {
          name: "Viễn thông",
          href: "/companies?industry=telecom",
          icon: Building2,
        },
        {
          name: "Internet",
          href: "/companies?industry=internet",
          icon: Building2,
        },
        { name: "Game", href: "/companies?industry=game", icon: Building2 },
        {
          name: "E-commerce",
          href: "/companies?industry=ecommerce",
          icon: Building2,
        },
        {
          name: "Fintech",
          href: "/companies?industry=fintech",
          icon: Building2,
        },
        { name: "Edtech", href: "/companies?industry=edtech", icon: Building2 },
        {
          name: "Healthtech",
          href: "/companies?industry=healthtech",
          icon: Building2,
        },
        {
          name: "AgriTech",
          href: "/companies?industry=agritech",
          icon: Building2,
        },
        {
          name: "PropTech",
          href: "/companies?industry=proptech",
          icon: Building2,
        },
        {
          name: "LogiTech",
          href: "/companies?industry=logitech",
          icon: Building2,
        },
        {
          name: "InsurTech",
          href: "/companies?industry=insurtech",
          icon: Building2,
        },
        {
          name: "LegalTech",
          href: "/companies?industry=legaltech",
          icon: Building2,
        },
        {
          name: "GovTech",
          href: "/companies?industry=govtech",
          icon: Building2,
        },
        {
          name: "CleanTech",
          href: "/companies?industry=cleantech",
          icon: Building2,
        },
        {
          name: "Greentech",
          href: "/companies?industry=greentech",
          icon: Building2,
        },
        {
          name: "Cleantech",
          href: "/companies?industry=cleantech",
          icon: Building2,
        },
        {
          name: "Renewable Energy",
          href: "/companies?industry=renewable",
          icon: Building2,
        },
        {
          name: "Solar Energy",
          href: "/companies?industry=solar",
          icon: Building2,
        },
        {
          name: "Wind Energy",
          href: "/companies?industry=wind",
          icon: Building2,
        },
        {
          name: "Hydro Energy",
          href: "/companies?industry=hydro",
          icon: Building2,
        },
        {
          name: "Geothermal Energy",
          href: "/companies?industry=geothermal",
          icon: Building2,
        },
        {
          name: "Biomass Energy",
          href: "/companies?industry=biomass",
          icon: Building2,
        },
        {
          name: "Biofuel Energy",
          href: "/companies?industry=biofuel",
          icon: Building2,
        },
        {
          name: "Hydrogen Energy",
          href: "/companies?industry=hydrogen",
          icon: Building2,
        },
        {
          name: "Fuel Cell Energy",
          href: "/companies?industry=fuelcell",
          icon: Building2,
        },
        {
          name: "Battery Energy",
          href: "/companies?industry=battery",
          icon: Building2,
        },
        {
          name: "Storage Energy",
          href: "/companies?industry=storage",
          icon: Building2,
        },
        {
          name: "Smart Grid Energy",
          href: "/companies?industry=smartgrid",
          icon: Building2,
        },
        {
          name: "Microgrid Energy",
          href: "/companies?industry=microgrid",
          icon: Building2,
        },
        {
          name: "Distributed Energy",
          href: "/companies?industry=distributed",
          icon: Building2,
        },
        {
          name: "Centralized Energy",
          href: "/companies?industry=centralized",
          icon: Building2,
        },
        {
          name: "Grid Energy",
          href: "/companies?industry=grid",
          icon: Building2,
        },
        {
          name: "Off-grid Energy",
          href: "/companies?industry=offgrid",
          icon: Building2,
        },
        {
          name: "On-grid Energy",
          href: "/companies?industry=ongrid",
          icon: Building2,
        },
        {
          name: "Hybrid Energy",
          href: "/companies?industry=hybrid",
          icon: Building2,
        },
        {
          name: "Renewable Hybrid Energy",
          href: "/companies?industry=renewable_hybrid",
          icon: Building2,
        },
        {
          name: "Non-renewable Hybrid Energy",
          href: "/companies?industry=nonrenewable_hybrid",
          icon: Building2,
        },
        {
          name: "Fossil Fuel Energy",
          href: "/companies?industry=fossil",
          icon: Building2,
        },
        {
          name: "Coal Energy",
          href: "/companies?industry=coal",
          icon: Building2,
        },
        {
          name: "Oil Energy",
          href: "/companies?industry=oil",
          icon: Building2,
        },
        {
          name: "Gas Energy",
          href: "/companies?industry=gas",
          icon: Building2,
        },
        {
          name: "Nuclear Energy",
          href: "/companies?industry=nuclear",
          icon: Building2,
        },
        {
          name: "Thermal Energy",
          href: "/companies?industry=thermal",
          icon: Building2,
        },
        {
          name: "Kinetic Energy",
          href: "/companies?industry=kinetic",
          icon: Building2,
        },
        {
          name: "Potential Energy",
          href: "/companies?industry=potential",
          icon: Building2,
        },
        {
          name: "Chemical Energy",
          href: "/companies?industry=chemical",
          icon: Building2,
        },
        {
          name: "Electrical Energy",
          href: "/companies?industry=electrical",
          icon: Building2,
        },
        {
          name: "Magnetic Energy",
          href: "/companies?industry=magnetic",
          icon: Building2,
        },
        {
          name: "Radiant Energy",
          href: "/companies?industry=radiant",
          icon: Building2,
        },
        {
          name: "Sound Energy",
          href: "/companies?industry=sound",
          icon: Building2,
        },
        {
          name: "Mechanical Energy",
          href: "/companies?industry=mechanical",
          icon: Building2,
        },
        {
          name: "Heat Energy",
          href: "/companies?industry=heat",
          icon: Building2,
        },
        {
          name: "Light Energy",
          href: "/companies?industry=light",
          icon: Building2,
        },
        {
          name: "Solar Light Energy",
          href: "/companies?industry=solar_light",
          icon: Building2,
        },
        {
          name: "LED Light Energy",
          href: "/companies?industry=led",
          icon: Building2,
        },
        {
          name: "Laser Light Energy",
          href: "/companies?industry=laser",
          icon: Building2,
        },
        {
          name: "UV Light Energy",
          href: "/companies?industry=uv",
          icon: Building2,
        },
        {
          name: "IR Light Energy",
          href: "/companies?industry=ir",
          icon: Building2,
        },
        {
          name: "X-ray Light Energy",
          href: "/companies?industry=xray",
          icon: Building2,
        },
        {
          name: "Gamma Light Energy",
          href: "/companies?industry=gamma",
          icon: Building2,
        },
        {
          name: "Cosmic Light Energy",
          href: "/companies?industry=cosmic",
          icon: Building2,
        },
        {
          name: "Radio Light Energy",
          href: "/companies?industry=radio",
          icon: Building2,
        },
        {
          name: "Microwave Light Energy",
          href: "/companies?industry=microwave",
          icon: Building2,
        },
        {
          name: "Infrared Light Energy",
          href: "/companies?industry=infrared",
          icon: Building2,
        },
        {
          name: "Visible Light Energy",
          href: "/companies?industry=visible",
          icon: Building2,
        },
        {
          name: "Ultraviolet Light Energy",
          href: "/companies?industry=ultraviolet",
          icon: Building2,
        },
        {
          name: "X-ray Light Energy",
          href: "/companies?industry=xray",
          icon: Building2,
        },
        {
          name: "Gamma Light Energy",
          href: "/companies?industry=gamma",
          icon: Building2,
        },
        {
          name: "Cosmic Light Energy",
          href: "/companies?industry=cosmic",
          icon: Building2,
        },
        {
          name: "Radio Light Energy",
          href: "/companies?industry=radio",
          icon: Building2,
        },
        {
          name: "Microwave Light Energy",
          href: "/companies?industry=microwave",
          icon: Building2,
        },
        {
          name: "Infrared Light Energy",
          href: "/companies?industry=infrared",
          icon: Building2,
        },
        {
          name: "Visible Light Energy",
          href: "/companies?industry=visible",
          icon: Building2,
        },
        {
          name: "Ultraviolet Light Energy",
          href: "/companies?industry=ultraviolet",
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
