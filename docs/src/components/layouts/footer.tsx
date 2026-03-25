"use client";

import Link from "next/link";
import {
  FacebookIcon,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Footer() {

  return (
    <footer>
      {/* Container luôn có chiều cao cố định để tính padding cho main */}
      <div
        className={cn(
          "px-4 py-16",
          "lg:h-[386px]"
        )}
      >
        {/* ---------- Nội dung footer (giữ nguyên) ---------- */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-700">CVking</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 max-w-xs">
              Nền tảng hệ thống hàng đầu Việt Nam, cung cấp các dịch vụ chất
              lượng cao.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: FacebookIcon, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Youtube, href: "#" },
              ].map(({ Icon, href }, i) => (
                <Button
                  key={i}
                  size="icon"
                  variant="ghost"
                  className="text-gray-500 hover:text-purple-600 hover:bg-purple-200/50 transition-all rounded-full"
                  asChild
                >
                  <Link href={href} target="_blank" rel="noopener">
                    <Icon className="h-5 w-5" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-purple-700">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              {[
                "Về chúng tôi",
                "Khóa học",
                "Giảng viên",
                "Blog",
                "Liên hệ",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-600 text-sm hover:text-purple-600 transition-colors duration-200 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-purple-700">
              Danh mục
            </h3>
            <ul className="space-y-2">
              {[
                "Lập trình",
                "Thiết kế",
                "Marketing",
                "Kinh doanh",
                "Ngoại ngữ",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href="#"
                    className="text-gray-600 text-sm hover:text-purple-600 transition-colors duration-200 inline-block"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-purple-700">
              Liên hệ
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-purple-600" />
                <Link
                  href="tel:01010101"
                  className="text-gray-700 hover:text-purple-600 transition-colors text-sm"
                >
                  010-101-01010
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-600" />
                <Link
                  href="mailto:support@blog.vn"
                  className="text-gray-700 hover:text-purple-600 transition-colors text-sm"
                >
                  support@blog.vn
                </Link>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                <span className="text-sm text-gray-600 leading-relaxed flex-1">
                  33 Xô Viết Nghệ Tĩnh, Hòa Cường, Hải Châu, Đà Nẵng
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-purple-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p className="text-gray-600">
              © {new Date().getFullYear()}{" "}
              <span className="font-medium text-purple-700">Blog</span>. Tất cả
              quyền được bảo lưu.
            </p>
            <div className="flex gap-5 text-gray-600">
              {["Điều khoản sử dụng", "Chính sách bảo mật", "Cookies"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    className="hover:text-purple-600 transition-colors duration-200"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
