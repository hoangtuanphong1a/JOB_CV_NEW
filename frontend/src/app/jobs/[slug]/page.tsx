"use client";

import React, { useState, useEffect, use } from "react";
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
  TrendingUp,
  Loader2,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { jobService, Job } from "@/services/jobService";
import { SavedJobsService } from "@/services/savedJobsService";
import { ApplicationService } from "@/services/applicationService";
import toast, { Toaster } from "react-hot-toast";

interface JobDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationData, setApplicationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null as File | null,
  });

  useEffect(() => {
    fetchJobDetails();
  }, [resolvedParams.slug]);

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching job details for slug:", resolvedParams.slug);

      // For now, we'll assume the slug is the job ID
      // In a real app, you'd need to resolve slug to job ID
      const jobData = await jobService.getJob(resolvedParams.slug);
      setJob(jobData);

      // Check if job is saved
      try {
        const savedStatus = await SavedJobsService.isJobSaved(jobData.id);
        setIsSaved(savedStatus.isSaved);
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Không thể tải thông tin công việc");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveJob = async () => {
    if (!job) return;

    try {
      if (isSaved) {
        await SavedJobsService.unsaveJob(job.id);
        setIsSaved(false);
        toast.success("Đã bỏ lưu công việc");
      } else {
        await SavedJobsService.saveJob(job.id);
        setIsSaved(true);
        toast.success("Đã lưu công việc");
      }
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
      const axiosError = error as { response?: { status: number } };
      if (axiosError?.response?.status === 401) {
        toast.error("Vui lòng đăng nhập để lưu công việc");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    try {
      const applicationPayload = {
        jobId: job.id,
        coverLetter: applicationData.coverLetter,
        source: "WEBSITE" as const,
      };

      await ApplicationService.createApplication(applicationPayload);
      setIsApplied(true);
      setShowApplicationForm(false);
      toast.success("Đơn ứng tuyển đã được gửi thành công!");
      // Navigate to employer dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard/employer");
      }, 1500);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại.");
    }
  };

  const getJobSalaryDisplay = (job: Job): string => {
    if (job.minSalary && job.maxSalary) {
      return `${
        job.currency || "VNĐ"
      } ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`;
    }
    if (job.minSalary) {
      return `Từ ${job.currency || "VNĐ"} ${job.minSalary.toLocaleString()}`;
    }
    if (job.maxSalary) {
      return `Đến ${job.currency || "VNĐ"} ${job.maxSalary.toLocaleString()}`;
    }
    return "Thương lượng";
  };

  const getJobLocation = (job: Job): string => {
    const parts = [job.city, job.state, job.country].filter(Boolean);
    return parts.join(", ") || "Không xác định";
  };

  const getJobTypeDisplay = (jobType?: string): string => {
    const typeMap: { [key: string]: string } = {
      full_time: "Toàn thời gian",
      part_time: "Bán thời gian",
      contract: "Hợp đồng",
      freelance: "Freelance",
      internship: "Thực tập",
    };
    return typeMap[jobType || ""] || "Không xác định";
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Vừa đăng";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#f26b38] mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin công việc...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy công việc
          </h1>
          <p className="text-gray-600">
            Công việc này có thể đã bị xóa hoặc không tồn tại.
          </p>
          <Button
            onClick={() => (window.location.href = "/jobs")}
            className="mt-4"
          >
            Quay lại danh sách việc làm
          </Button>
        </div>
      </div>
    );
  }

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
              <span>Việc làm</span> / <span>{job.company?.name}</span> /{" "}
              <span className="text-gray-900 font-medium">{job.title}</span>
            </div>

            {/* Job Title & Company */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 border flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg text-gray-700">
                        {job.company?.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{getJobLocation(job)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{getJobTypeDisplay(job.jobType)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-green-600">
                          {getJobSalaryDisplay(job)}
                        </span>
oa                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags & Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{job.experienceLevel}</Badge>
                  {job.remoteWork && (
                    <Badge variant="outline">Làm việc từ xa</Badge>
                  )}
                  {job.urgent && (
                    <Badge variant="destructive" className="bg-red-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Tuyển gấp
                    </Badge>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <span>Đăng {getTimeAgo(job.createdAt)}</span>
                  <span>{job.applicationCount} ứng viên đã ứng tuyển</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleSaveJob}
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      isSaved ? "fill-blue-500 text-blue-500" : ""
                    }`}
                  />
                  {isSaved ? "Đã lưu" : "Lưu việc làm"}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Chia sẻ
                </Button>
                {!isApplied ? (
                  <Button
                    className="flex items-center gap-2 bg-[#f26b38] hover:bg-[#e05a27]"
                    onClick={() => setShowApplicationForm(true)}
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
                      <p className="mb-4 text-gray-700 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    {/* Skills Required */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Kỹ năng yêu cầu
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {skill.name}
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
                    {job.requirements ? (
                      <div className="space-y-4">
                        {job.requirements
                          .split("\n")
                          .filter((req) => req.trim())
                          .map((requirement, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 leading-relaxed">
                                {requirement}
                              </span>
                            </motion.div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        Chưa có thông tin yêu cầu cụ thể.
                      </p>
                    )}
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
                    {job.benefits ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {job.benefits
                          .split("\n")
                          .filter((benefit) => benefit.trim())
                          .map((benefit, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <Award className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">
                                {benefit}
                              </span>
                            </motion.div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        Chưa có thông tin quyền lợi cụ thể.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 border flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {job.company?.name}
                    </h4>
                    <p className="text-sm text-gray-600">Công ty</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{getJobLocation(job)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span>Công nghệ thông tin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>Nhân viên</span>
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
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Ứng tuyển nhanh
                    </h3>
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
                  <span className="font-semibold">{job.viewCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ứng viên</span>
                  <span className="font-semibold">{job.applicationCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đăng cách đây</span>
                  <span className="font-semibold">
                    {getTimeAgo(job.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          {/* Animated Background Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -25, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-20 right-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, 20, 0],
                y: [0, -15, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-200/15 rounded-full blur-2xl"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl border border-white/30 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8 lg:p-10">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Ứng tuyển vị trí
                    </h3>
                    <div className="text-sm text-gray-600">
                      <strong className="text-gray-900">{job.title}</strong> tại{" "}
                      <strong className="text-gray-900">{job.company?.name}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>

              {/* Job Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 border flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 truncate">
                      {job.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{job.company?.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{getJobLocation(job)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-green-600">
                        {getJobSalaryDisplay(job)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Application Form */}
              <motion.form
                onSubmit={handleApply}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                {/* Personal Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-500" />
                    Thông tin cá nhân
                  </h4>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          required
                          value={applicationData.fullName}
                          onChange={(e) =>
                            setApplicationData({
                              ...applicationData,
                              fullName: e.target.value,
                            })
                          }
                          placeholder="Nhập họ và tên đầy đủ của bạn"
                          className="pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 border-gray-200 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          type="email"
                          required
                          value={applicationData.email}
                          onChange={(e) =>
                            setApplicationData({
                              ...applicationData,
                              email: e.target.value,
                            })
                          }
                          placeholder="Nhập địa chỉ email của bạn"
                          className="pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 border-gray-200 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          type="tel"
                          required
                          value={applicationData.phone}
                          onChange={(e) =>
                            setApplicationData({
                              ...applicationData,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Nhập số điện thoại liên hệ"
                          className="pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 border-gray-200 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Details Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Send className="h-5 w-5 text-orange-500" />
                    Chi tiết ứng tuyển
                  </h4>

                  <div className="space-y-4">
                    {/* Cover Letter */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thư xin việc (tùy chọn)
                      </label>
                      <Textarea
                        value={applicationData.coverLetter}
                        onChange={(e) =>
                          setApplicationData({
                            ...applicationData,
                            coverLetter: e.target.value,
                          })
                        }
                        placeholder="Giới thiệu ngắn gọn về bản thân, kinh nghiệm và lý do bạn muốn ứng tuyển vị trí này..."
                        rows={5}
                        className="border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 border-gray-200 focus:border-orange-500 resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Mô tả ngắn gọn về kinh nghiệm và động lực của bạn
                      </p>
                    </div>

                    {/* Resume Upload */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CV/Resume *
                      </label>
                      <div className="relative">
                        <Input
                          type="file"
                          required
                          accept=".pdf,.doc,.docx"
                          onChange={(e) =>
                            setApplicationData({
                              ...applicationData,
                              resume: e.target.files?.[0] || null,
                            })
                          }
                          className="border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 border-gray-200 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Chấp nhận file PDF, DOC, DOCX (tối đa 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms and Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="pt-6 border-t border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12 border-2 rounded-xl hover:bg-gray-50 transition-all duration-300"
                      onClick={() => setShowApplicationForm(false)}
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-[#f26b38] hover:bg-[#e05a27] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Gửi đơn ứng tuyển
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Bằng cách gửi đơn ứng tuyển, bạn đồng ý với{" "}
                    <a href="#" className="text-orange-500 hover:underline">
                      Chính sách bảo mật
                    </a>{" "}
                    của chúng tôi
                  </p>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
