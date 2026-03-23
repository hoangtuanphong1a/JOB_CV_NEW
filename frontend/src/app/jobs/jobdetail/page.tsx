"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Building2,
  Star,
  Heart,
  Share2,
  Bookmark,
  Send,
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobApplicationForm from "@/components/JobApplicationForm";

// Mock job data - in real app, this would come from API
const jobData = {
  id: "1",
  slug: "senior-frontend-developer",
  title: "Senior Frontend Developer",
  company: {
    id: "1",
    name: "TechCorp Vietnam",
    logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=80&h=80&fit=crop&crop=center",
    location: "Quận 1, TP.HCM",
    rating: 4.8,
    verified: true
  },
  type: "Toàn thời gian",
  experience: "3-5 năm",
  salary: {
    min: 25,
    max: 40,
    currency: "triệu",
    period: "tháng"
  },
  location: "TP.HCM",
  remote: "Có thể làm remote",
  posted: "2 ngày trước",
  applicants: 47,
  urgent: true,

  description: `Chúng tôi đang tìm kiếm một Senior Frontend Developer tài năng để gia nhập đội ngũ phát triển sản phẩm của chúng tôi.

Trong vai trò này, bạn sẽ:
- Phát triển và duy trì các ứng dụng web hiện đại sử dụng React, TypeScript
- Cộng tác với đội ngũ backend và thiết kế để tạo ra trải nghiệm người dùng tuyệt vời
- Tham gia vào quá trình thiết kế kiến trúc và lựa chọn công nghệ
- Mentorship cho các developer junior
- Đóng góp vào việc cải thiện quy trình phát triển và chất lượng code`,

  requirements: [
    "Ít nhất 3 năm kinh nghiệm phát triển Frontend",
    "Thành thạo React, TypeScript, và các công nghệ web hiện đại",
    "Kinh nghiệm với state management (Redux, Zustand, etc.)",
    "Hiểu biết về RESTful APIs và GraphQL",
    "Kinh nghiệm với testing frameworks (Jest, React Testing Library)",
    "Khả năng làm việc nhóm và giao tiếp tốt",
    "Tiếng Anh giao tiếp",
    "Ưu tiên có kinh nghiệm với Next.js, Tailwind CSS"
  ],

  benefits: [
    "Lương thưởng cạnh tranh theo năng lực",
    "Bảo hiểm sức khỏe 100% cho nhân viên và gia đình",
    "13 tháng lương + thưởng hiệu suất",
    "Nghỉ phép 24 ngày/năm + nghỉ lễ tết",
    "Đào tạo và phát triển nghề nghiệp liên tục",
    "Môi trường làm việc năng động, sáng tạo",
    "Cơ hội thăng tiến và phát triển bản thân",
    "Team building và các hoạt động tập thể hàng tháng"
  ],

  skills: [
    "React", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS",
    "Redux", "GraphQL", "Jest", "Git", "Figma"
  ],

  similarJobs: [
    {
      id: "2",
      title: "Frontend Developer",
      company: "StartupTech",
      location: "TP.HCM",
      salary: "15-25 triệu",
      logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=60&h=60&fit=crop&crop=center"
    },
    {
      id: "3",
      title: "Fullstack Developer",
      company: "InnoTech",
      location: "Hà Nội",
      salary: "20-35 triệu",
      logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=60&h=60&fit=crop&crop=center"
    },
    {
      id: "4",
      title: "React Developer",
      company: "CodeMaster",
      location: "Đà Nẵng",
      salary: "18-30 triệu",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=60&h=60&fit=crop&crop=center"
    }
  ]
};

export default function JobDetailPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const handleApplicationSuccess = () => {
    // The JobApplicationForm component now handles the redirect internally
    // We just need to update local state
    setIsApplied(true);
    setShowApplicationForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600 mb-4">
              <span>Việc làm</span> / <span>Frontend Developer</span> / <span className="text-gray-900 font-medium">{jobData.title}</span>
            </div>

            {/* Job Title & Company */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={jobData.company.logo}
                    alt={jobData.company.name}
                    className="w-12 h-12 rounded-lg border"
                  />
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                      {jobData.title}
                    </h1>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg text-gray-700">{jobData.company.name}</span>
                      {jobData.company.verified && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{jobData.company.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{jobData.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{jobData.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-green-600">
                          {jobData.salary.min}-{jobData.salary.max} {jobData.salary.currency}/{jobData.salary.period}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags & Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{jobData.experience}</Badge>
                  <Badge variant="outline">{jobData.remote}</Badge>
                  {jobData.urgent && (
                    <Badge variant="destructive" className="bg-red-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Tuyển gấp
                    </Badge>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <span>Đăng {jobData.posted}</span>
                  <span>{jobData.applicants} ứng viên đã ứng tuyển</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-blue-500 text-blue-500' : ''}`} />
                  {isSaved ? 'Đã lưu' : 'Lưu việc làm'}
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Chia sẻ
                </Button>
                {!isApplied ? (
                  <Button
                    className="flex items-center gap-2 bg-[#f26b38] hover:bg-[#e05a27]"
                    onClick={() => window.location.href = `/jobs/${jobData.slug}/apply`}
                  >
                    <Send className="h-4 w-4" />
                    Ứng tuyển ngay
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="flex items-center gap-2 bg-green-500"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Đã ứng tuyển
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Mô tả công việc</TabsTrigger>
                <TabsTrigger value="requirements">Yêu cầu</TabsTrigger>
                <TabsTrigger value="benefits">Phúc lợi</TabsTrigger>
              </TabsList>

              {/* Job Description */}
              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Chi tiết công việc</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      {jobData.description.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Skills Required */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Kỹ năng yêu cầu</h4>
                      <div className="flex flex-wrap gap-2">
                        {jobData.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Requirements */}
              <TabsContent value="requirements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Yêu cầu ứng viên</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {jobData.requirements.map((requirement, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">{requirement}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Benefits */}
              <TabsContent value="benefits" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quyền lợi và đãi ngộ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {jobData.benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <Award className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Việc làm tương tự</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobData.similarJobs.map((job) => (
                    <div key={job.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-10 h-10 rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{job.salary}</p>
                        <Button size="sm" variant="outline">Xem chi tiết</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin công ty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={jobData.company.logo}
                    alt={jobData.company.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{jobData.company.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{jobData.company.rating}</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{jobData.company.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span>Công nghệ thông tin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>1000+ nhân viên</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Xem trang công ty
                </Button>
              </CardContent>
            </Card>

            {/* Quick Apply */}
            {!isApplied && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">Ứng tuyển nhanh</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Chỉ mất 2 phút để hoàn thành đơn ứng tuyển
                    </p>
                    <Button
                      className="w-full bg-[#f26b38] hover:bg-[#e05a27]"
                      onClick={() => setShowApplicationForm(true)}
                    >
                      Ứng tuyển ngay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê công việc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lượt xem</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ứng viên</span>
                  <span className="font-semibold">{jobData.applicants}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đăng cách đây</span>
                  <span className="font-semibold">{jobData.posted}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <JobApplicationForm
          jobId={jobData.id}
          jobTitle={jobData.title}
          companyName={jobData.company.name}
          onSuccess={handleApplicationSuccess}
          onCancel={() => setShowApplicationForm(false)}
          isModal={true}
        />
      )}
    </div>
  );
}
