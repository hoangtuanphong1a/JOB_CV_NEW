"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  CheckCircle,
  Clock,
  Plus,
  FileText,
  BarChart3,
  UserCheck,
  Calendar,
  Target,
  Building,
  LogOut,
  Settings,
  MessageSquare,
} from "lucide-react";

interface HRStats {
  activeJobs: number;
  totalApplications: number;
  interviewsScheduled: number;
  offersSent: number;
  hiresThisMonth: number;
  responseRate: number;
  avgTimeToHire: number;
  totalViews: number;
}

interface RecentApplication {
  id: string;
  candidateName: string;
  jobTitle: string;
  appliedDate: string;
  status:
    | "pending"
    | "reviewing"
    | "shortlisted"
    | "interviewed"
    | "offered"
    | "hired"
    | "rejected";
  avatar?: string;
}

interface ActiveJob {
  id: string;
  title: string;
  postedDate: string;
  applications: number;
  views: number;
  status: "active" | "expired" | "draft";
}

interface UpcomingInterview {
  id: string;
  candidateName: string;
  jobTitle: string;
  interviewDate: string;
  interviewType: "phone" | "video" | "in-person";
  interviewer: string;
}

export default function HRDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<HRStats>({
    activeJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    offersSent: 0,
    hiresThisMonth: 0,
    responseRate: 0,
    avgTimeToHire: 0,
    totalViews: 0,
  });
  const [recentApplications, setRecentApplications] = useState<
    RecentApplication[]
  >([]);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<
    UpcomingInterview[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHRData();
  }, []);

  const fetchHRData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      // Fetch HR dashboard stats
      const statsResponse = await fetch(`${apiUrl}/hr/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch active jobs
      const jobsResponse = await fetch(`${apiUrl}/hr/jobs?limit=3`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        const formattedJobs = jobsData.data.map((job: any) => ({
          id: job.id,
          title: job.title,
          postedDate: new Date(job.createdAt).toLocaleDateString("vi-VN"),
          applications: job._count?.applications || 0, // This might need adjustment based on actual API response
          views: job.viewCount || 0,
          status: job.status === "published" ? "active" : "draft",
        }));
        setActiveJobs(formattedJobs);
      }

      // Fetch recent applications
      const applicationsResponse = await fetch(
        `${apiUrl}/hr/applications?limit=4`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json();
        const formattedApplications = applicationsData.data.map((app: any) => ({
          id: app.id,
          candidateName:
            `${app.jobSeekerProfile?.user?.firstName || ""} ${
              app.jobSeekerProfile?.user?.lastName || ""
            }`.trim() || "Unknown",
          jobTitle: app.job?.title || "Unknown Position",
          appliedDate: new Date(app.createdAt).toLocaleDateString("vi-VN"),
          status: app.status,
        }));
        setRecentApplications(formattedApplications);
      }

      // Fetch upcoming interviews
      const interviewsResponse = await fetch(
        `${apiUrl}/hr/interviews/upcoming`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (interviewsResponse.ok) {
        const interviewsData = await interviewsResponse.json();
        const formattedInterviews = interviewsData.map((interview: any) => ({
          id: interview.id,
          candidateName: interview.candidateName,
          jobTitle: interview.jobTitle,
          interviewDate: interview.interviewDate,
          interviewType: "scheduled",
          interviewer: interview.interviewer,
        }));
        setUpcomingInterviews(formattedInterviews);
      }
    } catch (error) {
      console.error("Error fetching HR data:", error);
      // Keep mock data as fallback for now
      setActiveJobs([
        {
          id: "1",
          title: "Senior Frontend Developer",
          postedDate: "25/01/2025",
          applications: 24,
          views: 156,
          status: "active",
        },
        {
          id: "2",
          title: "Product Manager",
          postedDate: "20/01/2025",
          applications: 18,
          views: 89,
          status: "active",
        },
      ]);

      setRecentApplications([
        {
          id: "1",
          candidateName: "Nguyễn Văn A",
          jobTitle: "Senior Frontend Developer",
          appliedDate: "28/01/2025",
          status: "reviewing",
        },
      ]);

      setUpcomingInterviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700" },
      reviewing: { label: "Đang xem xét", color: "bg-blue-100 text-blue-700" },
      shortlisted: {
        label: "Ứng viên tiềm năng",
        color: "bg-purple-100 text-purple-700",
      },
      interviewed: {
        label: "Đã phỏng vấn",
        color: "bg-indigo-100 text-indigo-700",
      },
      offered: { label: "Đã đề nghị", color: "bg-green-100 text-green-700" },
      hired: { label: "Đã tuyển", color: "bg-emerald-100 text-emerald-700" },
      rejected: { label: "Đã từ chối", color: "bg-red-100 text-red-700" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case "phone":
        return "📞";
      case "video":
        return "📹";
      case "in-person":
        return "🏢";
      default:
        return "📅";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải dữ liệu HR...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Header with actions */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">HR Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Quản lý tuyển dụng và theo dõi ứng viên của công ty.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/hr/jobs/post">
                <Button className="bg-[#f26b38] hover:bg-[#e05a27]" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Đăng tin tuyển dụng
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.activeJobs}</div>
              <div className="text-sm text-gray-600">
                Tin tuyển dụng đang hoạt động
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {stats.totalApplications}
              </div>
              <div className="text-sm text-gray-600">Tổng đơn ứng tuyển</div>
              <div className="text-xs text-green-600 mt-1">+12 hôm nay</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Lượt xem tin</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {stats.hiresThisMonth}
              </div>
              <div className="text-sm text-gray-600">
                Đã tuyển dụng tháng này
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Management Actions */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Quản lý tuyển dụng
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link href="/dashboard/hr/jobs">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start gap-2 hover:border-[#f26b38] hover:text-[#f26b38] w-full"
                    >
                      <Briefcase className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-medium">
                          Quản lý tin tuyển dụng
                        </div>
                        <div className="text-sm text-gray-600">
                          Xem và chỉnh sửa các tin đăng
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/dashboard/hr/applications">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start gap-2 hover:border-[#f26b38] hover:text-[#f26b38] w-full"
                    >
                      <FileText className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-medium">Đơn ứng tuyển</div>
                        <div className="text-sm text-gray-600">
                          Xem và xử lý đơn ứng tuyển
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/dashboard/hr/interviews">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start gap-2 hover:border-[#f26b38] hover:text-[#f26b38] w-full"
                    >
                      <MessageSquare className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-medium">Lịch phỏng vấn</div>
                        <div className="text-sm text-gray-600">
                          Quản lý lịch phỏng vấn
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/dashboard/hr/reports">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start gap-2 hover:border-[#f26b38] hover:text-[#f26b38] w-full"
                    >
                      <BarChart3 className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-medium">Báo cáo tuyển dụng</div>
                        <div className="text-sm text-gray-600">
                          Thống kê và báo cáo
                        </div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Active Jobs */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Tin tuyển dụng đang hoạt động
                  </h2>
                  <Link href="/dashboard/hr/jobs">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#f26b38]"
                    >
                      Xem tất cả
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-[#f26b38] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Đăng {job.postedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{job.views} lượt xem</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{job.applications} ứng viên</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Chỉnh sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#f26b38] text-[#f26b38]"
                          >
                            Xem ứng viên
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Interviews */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Lịch phỏng vấn sắp tới
                </h3>
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">
                          {getInterviewTypeIcon(interview.interviewType)}
                        </span>
                        <span className="font-medium text-sm">
                          {interview.candidateName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {interview.jobTitle}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        {interview.interviewDate}
                      </p>
                      <p className="text-xs text-gray-500">
                        Người phỏng vấn: {interview.interviewer}
                      </p>
                    </div>
                  ))}
                  {upcomingInterviews.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Không có lịch phỏng vấn nào</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Recent Applications */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Ứng viên mới nhất
                </h3>
                <div className="space-y-3">
                  {recentApplications.slice(0, 4).map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#f26b38] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                        {application.avatar ? (
                          <img
                            src={application.avatar}
                            alt={application.candidateName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-[#f26b38]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">
                          {application.candidateName}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">
                          {application.jobTitle}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(application.status)}
                          <span className="text-xs text-gray-500">
                            {application.appliedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/hr/applications">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-4 text-[#f26b38]"
                  >
                    Xem tất cả ứng viên
                  </Button>
                </Link>
              </Card>

              {/* Hiring Performance */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Hiệu suất tuyển dụng</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Tỷ lệ phản hồi</span>
                      <span className="text-[#f26b38] font-medium">
                        {stats.responseRate}%
                      </span>
                    </div>
                    <Progress value={stats.responseRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Thời gian tuyển trung bình</span>
                      <span className="text-[#f26b38] font-medium">
                        {stats.avgTimeToHire} ngày
                      </span>
                    </div>
                    <Progress
                      value={Math.min((stats.avgTimeToHire / 30) * 100, 100)}
                      className="h-2"
                    />
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Mục tiêu tháng này</span>
                      <span className="text-green-600 font-medium">
                        {stats.hiresThisMonth}/5 tuyển dụng
                      </span>
                    </div>
                    <Progress
                      value={(stats.hiresThisMonth / 5) * 100}
                      className="h-2 mt-2"
                      style={{}}
                    />
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-[#f26b38]/20">
                <div className="text-center">
                  <Target className="h-8 w-8 text-[#f26b38] mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">
                    Mục tiêu tuyển dụng 2025
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tuyển dụng 50 nhân viên chất lượng cao
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#f26b38] mb-1">
                      {stats.hiresThisMonth * 2} {/* Mock data */}
                    </div>
                    <div className="text-xs text-gray-600">
                      Đã tuyển (ước tính cả năm)
                    </div>
                  </div>
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
