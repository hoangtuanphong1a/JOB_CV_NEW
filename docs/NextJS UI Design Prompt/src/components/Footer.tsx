import { Briefcase, Facebook, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#f26b38] to-[#e05a27]">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl text-white">CVKing</span>
            </div>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Nền tảng tuyển dụng hàng đầu Việt Nam, kết nối hàng nghìn ứng viên 
              với các công ty uy tín và cơ hội nghề nghiệp lý tưởng.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm">Đăng ký nhận tin tức việc làm mới nhất</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email của bạn"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
                <Button size="sm" className="bg-[#f26b38] hover:bg-[#e05a27]">
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>

          {/* Dành cho ứng viên */}
          <div>
            <h3 className="text-white mb-4">Dành cho ứng viên</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Tìm việc làm
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Việc làm đã lưu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Tạo CV miễn phí
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Công cụ CV
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Cẩm nang nghề nghiệp
                </a>
              </li>
            </ul>
          </div>

          {/* Dành cho nhà tuyển dụng */}
          <div>
            <h3 className="text-white mb-4">Dành cho nhà tuyển dụng</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Đăng tin tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Tìm ứng viên
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Bảng giá dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Giải pháp tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Về CVKing */}
          <div>
            <h3 className="text-white mb-4">Về CVKing</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f26b38] transition-colors">
                  Quy chế hoạt động
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
              <Mail className="h-5 w-5 text-[#f26b38]" />
            </div>
            <div>
              <div className="text-gray-500">Email</div>
              <div className="text-white">contact@cvking.vn</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
              <Phone className="h-5 w-5 text-[#f26b38]" />
            </div>
            <div>
              <div className="text-gray-500">Hotline</div>
              <div className="text-white">1900 xxxx</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
              <MapPin className="h-5 w-5 text-[#f26b38]" />
            </div>
            <div>
              <div className="text-gray-500">Địa chỉ</div>
              <div className="text-white">Hà Nội, Việt Nam</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © 2024 CVKing. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 hover:bg-[#f26b38] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 hover:bg-[#f26b38] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 hover:bg-[#f26b38] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 hover:bg-[#f26b38] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
