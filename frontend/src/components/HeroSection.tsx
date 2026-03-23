import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, MapPin, TrendingUp, Users, Award } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Main Heading */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#f26b38] to-[#e05a27] bg-clip-text text-transparent">
            Tìm việc làm mơ ước của bạn
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Kết nối với hàng nghìn công ty hàng đầu và cơ hội nghề nghiệp tốt nhất tại Việt Nam
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Tên công việc, kỹ năng..."
                  className="pl-10 h-12 text-base"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Địa điểm làm việc"
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button size="lg" className="bg-[#f26b38] hover:bg-[#e05a27] h-12 text-base font-medium">
                <Search className="h-5 w-5 mr-2" />
                Tìm việc làm
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
              <span>Từ khóa hot:</span>
              <Link href="#" className="text-[#f26b38] hover:underline">Frontend Developer</Link>
              <span>•</span>
              <Link href="#" className="text-[#f26b38] hover:underline">Backend Developer</Link>
              <span>•</span>
              <Link href="#" className="text-[#f26b38] hover:underline">UI/UX Designer</Link>
              <span>•</span>
              <Link href="#" className="text-[#f26b38] hover:underline">Product Manager</Link>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/jobs/post">
              <Button size="lg" variant="outline" className="border-[#f26b38] text-[#f26b38] hover:bg-[#f26b38] hover:text-white px-8 py-3 text-lg">
                Đăng tin tuyển dụng
              </Button>
            </Link>
            <Link href="/cv-builder">
              <Button size="lg" className="bg-[#f26b38] hover:bg-[#e05a27] px-8 py-3 text-lg">
                Tạo CV chuyên nghiệp
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-[#f26b38] mr-2" />
              <span className="text-3xl lg:text-4xl font-bold text-gray-900">15,000+</span>
            </div>
            <p className="text-gray-600">Việc làm đang tuyển</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-[#f26b38] mr-2" />
              <span className="text-3xl lg:text-4xl font-bold text-gray-900">2,500+</span>
            </div>
            <p className="text-gray-600">Công ty hàng đầu</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-8 w-8 text-[#f26b38] mr-2" />
              <span className="text-3xl lg:text-4xl font-bold text-gray-900">50,000+</span>
            </div>
            <p className="text-gray-600">Ứng viên thành công</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Search className="h-8 w-8 text-[#f26b38] mr-2" />
              <span className="text-3xl lg:text-4xl font-bold text-gray-900">1M+</span>
            </div>
            <p className="text-gray-600">Lượt tìm việc</p>
          </div>
        </div>
      </div>
    </section>
  );
}
