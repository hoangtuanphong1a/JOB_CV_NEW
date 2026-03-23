"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Users,
  Award,
  Search,
  Target,
  Star,
  Globe,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function CompaniesHero() {
  const stats = [
    { icon: Building2, label: "Công ty", value: "1,200+", color: "bg-indigo-500" },
    { icon: Briefcase, label: "Việc làm", value: "15,000+", color: "bg-purple-500" },
    { icon: Users, label: "Nhân viên", value: "250K+", color: "bg-blue-500" },
    { icon: TrendingUp, label: "Đang tuyển", value: "85%", color: "bg-emerald-500" }
  ];

  const features = [
    {
      icon: Search,
      title: "Khám phá công ty uy tín",
      description: "Tìm hiểu văn hóa, giá trị và cơ hội phát triển tại các công ty hàng đầu Việt Nam"
    },
    {
      icon: Target,
      title: "Theo dõi nhà tuyển dụng",
      description: "Đừng bỏ lỡ cơ hội việc làm từ những công ty bạn quan tâm nhất"
    },
    {
      icon: Star,
      title: "Đánh giá & Review",
      description: "Đọc đánh giá từ nhân viên hiện tại về môi trường làm việc thực tế"
    }
  ];

  const industries = [
    { name: "Công nghệ", emoji: "💻", companies: "320 công ty" },
    { name: "Tài chính", emoji: "🏦", companies: "180 công ty" },
    { name: "Bán lẻ", emoji: "🛒", companies: "150 công ty" },
    { name: "Sản xuất", emoji: "🏭", companies: "200 công ty" },
    { name: "Marketing", emoji: "📈", companies: "120 công ty" },
    { name: "Y tế", emoji: "🏥", companies: "90 công ty" }
  ];

  const topCompanies = [
    { name: "VNG Corporation", logo: "VNG", rating: 4.8 },
    { name: "FPT Software", logo: "FPT", rating: 4.7 },
    { name: "Vietcombank", logo: "VCB", rating: 4.6 },
    { name: "VinFast", logo: "VF", rating: 4.5 },
    { name: "Masan Group", logo: "MSN", rating: 4.4 }
  ];

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-16 lg:py-24 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200/40 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-pink-200/40 rounded-full blur-xl"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2 mb-6">
              <Building2 className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Khám phá công ty hàng đầu</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Tìm công ty
              <span className="bg-gradient-to-r from-[#f26b38] to-[#e05a27] bg-clip-text text-transparent">
                {" "}mơ ước
              </span>
              <br />
              của bạn
            </h1>

            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Khám phá văn hóa, giá trị và cơ hội phát triển tại hơn 1,200 công ty uy tín.
              Tìm nhà tuyển dụng phù hợp với mục tiêu sự nghiệp của bạn.
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
              >
                <div className={`inline-flex p-2 rounded-lg ${stat.color} text-white mb-2`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* Left Side - Features & Industries */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tại sao chọn chúng tôi?</h3>
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 flex-shrink-0">
                      <feature.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Industries */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Khám phá theo ngành nghề</h3>
                <div className="grid grid-cols-2 gap-3">
                  {industries.map((industry, index) => (
                    <motion.button
                      key={industry.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
                      className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition-all duration-200 text-left group"
                    >
                      <span className="text-lg">{industry.emoji}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">{industry.name}</div>
                        <div className="text-xs text-gray-500">{industry.companies}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Side - Top Companies & CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6"
            >

              {/* Top Companies */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Top công ty nổi bật</h3>
                <div className="space-y-3">
                  {topCompanies.map((company, index) => (
                    <motion.div
                      key={company.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {company.logo}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 group-hover:text-indigo-700">{company.name}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{company.rating}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="space-y-3"
              >
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#f26b38] to-[#e05a27] hover:from-[#e05a27] hover:to-[#d04f1e] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Khám phá công ty ngay
                </Button>
                <Link href="/cv-builder">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 font-semibold rounded-lg transition-all duration-300"
                  >
                    <Award className="h-5 w-5 mr-2" />
                    Ứng tuyển việc làm
                  </Button>
                </Link>
              </motion.div>

              {/* Employer CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 text-center shadow-lg"
              >
                <Globe className="h-10 w-10 mx-auto mb-3 opacity-90" />
                <h4 className="font-semibold mb-2">Bạn là nhà tuyển dụng?</h4>
                <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                  Đăng tin tuyển dụng để tiếp cận hàng nghìn ứng viên tài năng
                </p>
                <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold">
                  Đăng tin ngay
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center mt-12 pt-8 border-t border-gray-100"
          >
            <p className="text-gray-600 mb-6">
              <span className="font-semibold text-gray-900">250,000+ nhân viên</span> đang làm việc tại các công ty uy tín
            </p>

            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="w-3 h-3 bg-indigo-500 rounded-full mx-auto mb-2"></div>
                <div className="text-xs text-gray-600">Startups</div>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2"></div>
                <div className="text-xs text-gray-600">SMB</div>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-pink-500 rounded-full mx-auto mb-2"></div>
                <div className="text-xs text-gray-600">Enterprise</div>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-indigo-500 text-indigo-600 hover:bg-indigo-50"
            >
              Tìm hiểu thêm về CVKing
            </Button>
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
