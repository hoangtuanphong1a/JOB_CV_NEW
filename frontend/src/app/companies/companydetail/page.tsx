"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  Calendar,
  Globe,
  Star,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  Heart,
  Share2,
  Briefcase,
  Award,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Mock company data - in real app, this would come from API
const companyData = {
  id: "1",
  slug: "techcorp-vietnam",
  name: "TechCorp Vietnam",
  logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=150&h=150&fit=crop&crop=center",
  coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
  industry: "Công nghệ thông tin",
  size: "1000-5000 nhân viên",
  founded: "2015",
  location: "Quận 1, TP.HCM",
  website: "https://techcorp.vn",
  description: "TechCorp Vietnam là công ty công nghệ hàng đầu Việt Nam, chuyên cung cấp giải pháp phần mềm và dịch vụ số cho doanh nghiệp.",
  about: `TechCorp Vietnam được thành lập từ năm 2015 với sứ mệnh mang công nghệ hiện đại đến với cộng đồng doanh nghiệp Việt Nam. Chúng tôi tự hào là đối tác tin cậy của hơn 1000 doanh nghiệp trên toàn quốc.

Với đội ngũ hơn 500 kỹ sư và chuyên gia hàng đầu, chúng tôi cung cấp các giải pháp toàn diện về:
- Phát triển ứng dụng di động và web
- Tư vấn chuyển đổi số
- Giải pháp đám mây và AI
- Bảo mật thông tin doanh nghiệp

TechCorp Vietnam luôn cam kết mang đến giá trị tối đa cho khách hàng và tạo môi trường làm việc tốt nhất cho nhân viên.`,
  benefits: [
    "Lương thưởng cạnh tranh",
    "Bảo hiểm sức khỏe 100%",
    "Đào tạo và phát triển nghề nghiệp",
    "Môi trường làm việc năng động",
    "Cơ hội thăng tiến nhanh",
    "Chế độ nghỉ phép hấp dẫn"
  ],
  culture: [
    "Đổi mới sáng tạo",
    "Tôn trọng và hợp tác",
    "Học hỏi liên tục",
    "Định hướng khách hàng",
    "Chất lượng vượt trội"
  ],
  jobs: [
    {
      id: "1",
      title: "Frontend Developer",
      type: "Toàn thời gian",
      location: "TP.HCM",
      salary: "15-25 triệu",
      posted: "2 ngày trước"
    },
    {
      id: "2",
      title: "Backend Developer",
      type: "Toàn thời gian",
      location: "TP.HCM",
      salary: "18-30 triệu",
      posted: "1 tuần trước"
    },
    {
      id: "3",
      title: "DevOps Engineer",
      type: "Toàn thời gian",
      location: "Hà Nội",
      salary: "20-35 triệu",
      posted: "3 ngày trước"
    }
  ],
  stats: {
    employees: "1,247",
    offices: "5",
    years: "9",
    rating: "4.8"
  }
};

export default function CompanyDetailPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
        <img
          src={companyData.coverImage}
          alt={companyData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Company Header */}
      <div className="relative -mt-16 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Company Logo */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <img
                src={companyData.logo}
                alt={companyData.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white shadow-lg"
              />
            </motion.div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {companyData.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{companyData.industry}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{companyData.size}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{companyData.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 max-w-2xl">
                    {companyData.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    {isSaved ? 'Đã lưu' : 'Lưu'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Chia sẻ
                  </Button>
                  <Button
                    className="flex items-center gap-2 bg-[#f26b38] hover:bg-[#e05a27]"
                  >
                    <Mail className="h-4 w-4" />
                    Liên hệ
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{companyData.stats.employees}</div>
              <div className="text-sm text-gray-600">Nhân viên</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{companyData.stats.offices}</div>
              <div className="text-sm text-gray-600">Văn phòng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{companyData.stats.years}</div>
              <div className="text-sm text-gray-600">Năm thành lập</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-gray-900">{companyData.stats.rating}</span>
              </div>
              <div className="text-sm text-gray-600">Đánh giá</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-white border">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="jobs">Việc làm ({companyData.jobs.length})</TabsTrigger>
              <TabsTrigger value="culture">Văn hóa</TabsTrigger>
              <TabsTrigger value="benefits">Phúc lợi</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Giới thiệu công ty</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        {companyData.about.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin liên hệ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span>{companyData.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <a href={companyData.website} className="text-blue-600 hover:underline flex items-center gap-1">
                          {companyData.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span>Thành lập năm {companyData.founded}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Giá trị cốt lõi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {companyData.culture.map((value, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-gray-700">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Phúc lợi nổi bật</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {companyData.benefits.slice(0, 4).map((benefit, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Award className="h-5 w-5 text-orange-500" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Việc làm đang tuyển dụng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companyData.jobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{job.type}</span>
                            <span>{job.location}</span>
                            <span className="text-green-600 font-medium">{job.salary}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{job.posted}</span>
                          <Button size="sm">
                            Ứng tuyển
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Culture Tab */}
            <TabsContent value="culture" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Văn hóa công ty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companyData.culture.map((value, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="text-center p-6 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl border"
                      >
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                          <Award className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{value}</h3>
                        <p className="text-sm text-gray-600">
                          Chúng tôi cam kết tạo dựng môi trường làm việc theo giá trị này.
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quyền lợi nhân viên</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {companyData.benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{benefit}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Đảm bảo quyền lợi tốt nhất cho nhân viên.
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
