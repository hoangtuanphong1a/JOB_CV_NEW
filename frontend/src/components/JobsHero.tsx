"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  TrendingUp,
  Users,
  Award,
  Search,
  MapPin,
  Sparkles,
  Target,
  Zap,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function JobsHero() {
  const stats = [
    { icon: Briefcase, label: "Việc làm", value: "15,000+", color: "bg-blue-500" },
    { icon: Users, label: "Công ty", value: "2,500+", color: "bg-emerald-500" },
    { icon: Award, label: "Ứng viên thành công", value: "50,000+", color: "bg-violet-500" },
    { icon: TrendingUp, label: "Tăng trưởng", value: "300%", color: "bg-amber-500" }
  ];

  const features = [
    {
      icon: Search,
      title: "Tìm kiếm thông minh",
      description: "Công cụ AI phân tích kỹ năng và kinh nghiệm để tìm việc phù hợp"
    },
    {
      icon: Target,
      title: "Khớp hồ sơ tự động",
      description: "Hệ thống matching thông minh kết nối ứng viên với nhà tuyển dụng"
    },
    {
      icon: Zap,
      title: "Ứng tuyển siêu tốc",
      description: "Gửi CV chỉ với 1 click, theo dõi tiến trình real-time"
    }
  ];

  const jobCategories = [
    { name: "IT & Công nghệ", emoji: "💻", count: "3,247" },
    { name: "Marketing", emoji: "📈", count: "1,892" },
    { name: "Thiết kế", emoji: "🎨", count: "1,456" },
    { name: "Tài chính", emoji: "💰", count: "987" },
    { name: "Bán hàng", emoji: "🛒", count: "2,134" },
    { name: "Nhân sự", emoji: "👥", count: "756" }
  ];

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-20 lg:py-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* Gradient orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
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
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">🚀 Khám phá 15,000+ cơ hội việc làm</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1]">
              Tìm việc làm
              <span className="bg-gradient-to-r from-[#f26b38] to-[#e05a27] bg-clip-text text-transparent">
                {" "}hoàn hảo
              </span>
              <br />
              cho bạn
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
              Nền tảng tuyển dụng thông minh kết nối tài năng với cơ hội.
              Khám phá hàng nghìn vị trí việc làm từ các công ty hàng đầu Việt Nam.
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
                  Bắt đầu tìm việc ngay
                </Button>
                <Link href="/cv-builder" className="flex-1">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700 hover:text-blue-700 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300"
                  >
                    <FileText className="h-5 w-5 mr-3" />
                    Tạo CV chuyên nghiệp
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
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Job Categories */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏷️ Khám phá theo ngành nghề</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {jobCategories.map((category, index) => (
                    <motion.button
                      key={category.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-white/50 hover:bg-white/80 rounded-xl border border-white/40 hover:border-blue-200 transition-all duration-200 text-left group"
                    >
                      <span className="text-2xl">{category.emoji}</span>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-blue-700">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.count} việc làm</div>
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
                        style={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Success Message */}
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
                    <div className="font-semibold text-lg">247 người</div>
                    <div className="text-emerald-100 text-sm">đã tìm được việc hôm nay</div>
                  </div>
                </div>
                <div className="text-emerald-100 text-sm leading-relaxed">
                  Trung bình mỗi phút có 1 ứng viên nhận được lời mời phỏng vấn!
                </div>
              </motion.div>

              {/* Trust Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/30"
              >
                <div className="text-3xl font-bold text-gray-900 mb-1">50,000+</div>
                <div className="text-sm text-gray-600 mb-3">Ứng viên thành công</div>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-center"
          >
            <p className="text-gray-600 mb-8 text-lg">
              Được tin dùng bởi <span className="font-semibold text-gray-900">2,500+ công ty</span> hàng đầu Việt Nam
            </p>

            {/* Company Logos Placeholder */}
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-300 to-green-400 rounded-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-300 to-purple-400 rounded-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-300 to-orange-400 rounded-lg"></div>
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
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
