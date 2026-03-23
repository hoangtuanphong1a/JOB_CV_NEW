"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Users,
  Award,
  Search,
  PenTool,
  Lightbulb,
  Target,
  FileText,
  BookMarked,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function BlogHero() {
  const stats = [
    { icon: BookOpen, label: "Bài viết", value: "200+", color: "bg-emerald-500" },
    { icon: Users, label: "Độc giả", value: "50K+", color: "bg-blue-500" },
    { icon: Award, label: "Chuyên gia", value: "25+", color: "bg-purple-500" },
    { icon: TrendingUp, label: "Tăng trưởng", value: "150%", color: "bg-amber-500" }
  ];

  const features = [
    {
      icon: Lightbulb,
      title: "Kiến thức chuyên sâu",
      description: "Bài viết phân tích chi tiết về xu hướng tuyển dụng và phát triển sự nghiệp"
    },
    {
      icon: Target,
      title: "Hướng dẫn thực tế",
      description: "Các bài hướng dẫn step-by-step giúp bạn áp dụng ngay vào công việc"
    },
    {
      icon: BookMarked,
      title: "Cập nhật thường xuyên",
      description: "Nội dung mới mỗi tuần về kỹ năng, CV và thị trường lao động"
    }
  ];

  const categories = [
    { name: "Kỹ năng mềm", emoji: "🧠", count: "45 bài" },
    { name: "CV & Hồ sơ", emoji: "📄", count: "32 bài" },
    { name: "Phỏng vấn", emoji: "💬", count: "28 bài" },
    { name: "Xu hướng", emoji: "📈", count: "15 bài" },
    { name: "Sự nghiệp", emoji: "🎯", count: "38 bài" },
    { name: "Công nghệ", emoji: "💻", count: "42 bài" }
  ];

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-20 lg:py-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zM10 10c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm60 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* Animated orbs */}
        <div className="absolute top-10 -left-6 w-80 h-80 bg-gradient-to-r from-emerald-300/30 to-teal-300/30 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob" />
        <div className="absolute bottom-10 -right-6 w-80 h-80 bg-gradient-to-r from-cyan-300/30 to-blue-300/30 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-3000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-green-300/20 to-emerald-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-1500" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 shadow-lg">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700">📚 Blog CVKing - Kiến thức phát triển sự nghiệp</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1]">
              Khám phá kiến thức
              <span className="bg-gradient-to-r from-[#f26b38] to-[#e05a27] bg-clip-text text-transparent">
                {" "}chuyên sâu
              </span>
              <br />
              về sự nghiệp
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
              Nơi chia sẻ những bài viết chất lượng về kỹ năng, xu hướng tuyển dụng,
              và bí quyết phát triển sự nghiệp trong thị trường lao động Việt Nam.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-20">

            {/* Left Column - CTA & Features */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#f26b38] to-[#e05a27] hover:from-[#e05a27] hover:to-[#d04f1e] text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group flex-1"
                >
                  <Search className="h-5 w-5 mr-3" />
                  Khám phá bài viết
                </Button>
                <Link href="/cv-builder" className="flex-1">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-gray-700 hover:text-emerald-700 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300"
                  >
                    <GraduationCap className="h-5 w-5 mr-3" />
                    Học kỹ năng ngay
                  </Button>
                </Link>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📂 Khám phá theo chủ đề</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category, index) => (
                    <motion.button
                      key={category.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-white/50 hover:bg-white/80 rounded-xl border border-white/40 hover:border-emerald-200 transition-all duration-200 text-left group"
                    >
                      <span className="text-2xl">{category.emoji}</span>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-emerald-700">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.count}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${stat.color} transition-all duration-1000`}
                        style={{ width: `${Math.min(100, (index + 1) * 20 + 10)}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Featured Author */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">CVKing Team</div>
                    <div className="text-emerald-100 text-sm">25+ chuyên gia</div>
                  </div>
                </div>
                <div className="text-emerald-100 text-sm leading-relaxed mb-4">
                  Đội ngũ tác giả giàu kinh nghiệm từ các công ty top đầu Việt Nam,
                  sẵn sàng chia sẻ kiến thức quý báu.
                </div>
                <div className="flex justify-center">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-white/30 border-2 border-white flex items-center justify-center text-xs font-bold"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Newsletter Signup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/30"
              >
                <div className="text-3xl font-bold text-gray-900 mb-1">📧</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Newsletter hàng tuần</div>
                <div className="text-sm text-gray-600 mb-4">
                  Nhận bài viết mới nhất về phát triển sự nghiệp
                </div>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white w-full">
                  Đăng ký ngay
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Trust Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-center"
          >
            <p className="text-gray-600 mb-8 text-lg">
              Được tin dùng bởi <span className="font-semibold text-gray-900">50,000+ độc giả</span> hàng tháng
            </p>

            {/* Social Proof */}
            <div className="flex justify-center items-center gap-8 opacity-70 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">2,500+ bài viết</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">25 chuyên gia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">99% hài lòng</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                Tìm hiểu thêm
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                Bắt đầu đọc
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </section>
  );
}
