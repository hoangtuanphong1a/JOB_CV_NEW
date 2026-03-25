"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Calendar,
  Clock,
  Target,
  ArrowLeft,
  Download,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";

interface ReportData {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalHires: number;
  avgTimeToHire: number;
  responseRate: number;
  applicationsByStatus: {
    pending: number;
    reviewing: number;
    shortlisted: number;
    interviewed: number;
    offered: number;
    hired: number;
    rejected: number;
  };
  topPerformingJobs: Array<{
    id: string;
    title: string;
    applications: number;
    views: number;
    conversionRate: number;
  }>;
  monthlyStats: Array<{
    month: string;
    applications: number;
    hires: number;
    views: number;
  }>;
  sourceAnalytics: Array<{
    source: string;
    applications: number;
    percentage: number;
  }>;
}

export default function HRReportsPage() {
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // Mock data for demonstration
      const mockData: ReportData = {
        totalJobs: 24,
        activeJobs: 12,
        totalApplications: 456,
        totalHires: 18,
        avgTimeToHire: 14,
        responseRate: 85,
        applicationsByStatus: {
          pending: 45,
          reviewing: 78,
          shortlisted: 32,
          interviewed: 28,
          offered: 15,
          hired: 18,
          rejected: 240,
        },
        topPerformingJobs: [
          {
            id: "1",
            title: "Senior Frontend Developer",
            applications: 78,
            views: 456,
            conversionRate: 17.1,
          },
          {
            id: "2",
            title: "Product Manager",
            applications: 65,
            views: 389,
            conversionRate: 16.7,
          },
          {
            id: "3",
            title: "DevOps Engineer",
            applications: 52,
            views: 312,
            conversionRate: 16.7,
          },
          {
            id: "4",
            title: "UI/UX Designer",
            applications: 48,
            views: 298,
            conversionRate: 16.1,
          },
        ],
        monthlyStats: [
          { month: "T1", applications: 89, hires: 4, views: 567 },
          { month: "T2", applications: 112, hires: 5, views: 678 },
          { month: "T3", applications: 134, hires: 6, views: 789 },
          { month: "T4", applications: 121, hires: 3, views: 712 },
        ],
        sourceAnalytics: [
          { source: "Trang web công ty", applications: 156, percentage: 34.2 },
          { source: "LinkedIn", applications: 123, percentage: 27.0 },
          { source: "Giới thiệu", applications: 89, percentage: 19.5 },
          { source: "VietnamWorks", applications: 56, percentage: 12.3 },
          { source: "Khác", applications: 32, percentage: 7.0 },
        ],
      };

      setReportData(mockData);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      reviewing: "bg-blue-500",
      shortlisted: "bg-purple-500",
      interviewed: "bg-indigo-500",
      offered: "bg-green-500",
      hired: "bg-emerald-500",
      rejected: "bg-red-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Chờ xử lý",
      reviewing: "Đang xem xét",
      shortlisted: "Tiềm năng",
      interviewed: "Đã phỏng vấn",
      offered: "Đã đề nghị",
      hired: "Đã tuyển",
      rejected: "Từ chối",
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (isLoading || !reportData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải báo cáo...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalApplications = Object.values(reportData.applicationsByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/hr")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Báo cáo tuyển dụng</h1>
                <p className="text-gray-600 mt-1">
                  Thống kê và phân tích hiệu quả tuyển dụng của công ty.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                  <SelectItem value="year">Năm này</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{reportData.totalJobs}</div>
              <div className="text-sm text-gray-600">Tổng tin tuyển dụng</div>
              <div className="text-xs text-gray-500 mt-1">
                {reportData.activeJobs} đang hoạt động
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+23%</span>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{reportData.totalApplications}</div>
              <div className="text-sm text-gray-600">Tổng đơn ứng tuyển</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+8%</span>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{reportData.totalHires}</div>
              <div className="text-sm text-gray-600">Đã tuyển dụng</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <TrendingDown className="h-4 w-4" />
                  <span>-2 ngày</span>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{reportData.avgTimeToHire} ngày</div>
              <div className="text-sm text-gray-600">Thời gian tuyển TB</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Application Status Distribution */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Phân bố trạng thái ứng viên</h2>
                <div className="space-y-4">
                  {Object.entries(reportData.applicationsByStatus).map(([status, count]) => {
                    const percentage = totalApplications > 0 ? (count / totalApplications) * 100 : 0;
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                            <span>{getStatusLabel(status)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{count}</span>
                            <span className="text-gray-500">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Top Performing Jobs */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Tin tuyển dụng hiệu quả nhất</h2>
                <div className="space-y-4">
                  {reportData.topPerformingJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#f26b38] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#f26b38] text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{job.applications} ứng viên</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{job.views} lượt xem</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span className="text-green-600 font-medium">
                              {job.conversionRate}% chuyển đổi
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Monthly Trends */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Xu hướng theo tháng</h2>
                <div className="space-y-4">
                  {reportData.monthlyStats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-[#f26b38] text-white flex items-center justify-center font-bold">
                        {stat.month}
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Ứng tuyển</div>
                          <div className="font-semibold">{stat.applications}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Tuyển dụng</div>
                          <div className="font-semibold text-green-600">{stat.hires}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Lượt xem</div>
                          <div className="font-semibold">{stat.views}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Response Rate */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Tỷ lệ phản hồi</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#f26b38] mb-2">
                    {reportData.responseRate}%
                  </div>
                  <Progress value={reportData.responseRate} className="h-3 mb-2" />
                  <p className="text-sm text-gray-600">
                    Ứng viên được phản hồi trong 48 giờ
                  </p>
                </div>
              </Card>

              {/* Source Analytics */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Nguồn ứng viên</h3>
                <div className="space-y-3">
                  {reportData.sourceAnalytics.map((source, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{source.source}</span>
                        <span className="font-medium">{source.applications}</span>
                      </div>
                      <Progress value={source.percentage} className="h-2" />
                      <div className="text-xs text-gray-500 text-right">
                        {source.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Key Metrics */}
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-[#f26b38]/20">
                <h3 className="font-semibold mb-4">Chỉ số quan trọng</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tỷ lệ chuyển đổi</span>
                    <span className="font-semibold text-[#f26b38]">
                      {((reportData.totalHires / totalApplications) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ứng viên/tin</span>
                    <span className="font-semibold">
                      {(totalApplications / reportData.totalJobs).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tuyển dụng/tin</span>
                    <span className="font-semibold text-green-600">
                      {(reportData.totalHires / reportData.activeJobs).toFixed(1)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Hành động nhanh</h3>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Tải báo cáo PDF
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Xem báo cáo chi tiết
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Lên lịch báo cáo
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}