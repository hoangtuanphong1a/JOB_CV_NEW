"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Users,
  Eye,
  CheckCircle,
  Plus,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  Edit,
  UserCheck,
  Loader2,
} from "lucide-react";
import { jobService, Job } from "@/services/jobService";
import { CompanyService } from "@/services/companyService";
import { ApplicationService } from "@/services/applicationService";

interface EmployerStats {
  activeJobs: number;
  totalApplications: number;
  totalViews: number;
  hiredCount: number;
  responseRate: number;
  avgHiringTime: number;
  qualityApplicants: number;
}

interface ActiveJob {
  id: string;
  title: string;
  postedDate: string;
  views: number;
  applications: number;
  status: "active" | "expired" | "draft";
  tags: string[];
}

interface RecentApplicant {
  id: string;
  name: string;
  jobTitle: string;
  appliedDate: string;
  avatar?: string;
}

export default function EmployerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<EmployerStats>({
    activeJobs: 0,
    totalApplications: 0,
    totalViews: 0,
    hiredCount: 0,
    responseRate: 0,
    avgHiringTime: 0,
    qualityApplicants: 0,
  });
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<RecentApplicant[]>(
    []
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // Try to fetch real data, fallback to mock data if APIs don't exist
      try {
        // Fetch jobs using jobService
        const jobsResponse = await jobService.getJobs({ page: 1, limit: 3 });
        const activeJobsData = jobsResponse.data.slice(0, 3).map(job => ({
          id: job.id,
          title: job.title,
          postedDate: new Date(job.createdAt).toLocaleDateString('vi-VN'),
          views: job.viewCount,
          applications: job.applicationCount,
          status: 'active' as const,
          tags: [...job.skills.map(s => s.name), ...job.tags.map(t => t.name)].slice(0, 3)
        }));
        setActiveJobs(activeJobsData);
        setStats(prev => ({ ...prev, activeJobs: jobsResponse.total || activeJobsData.length }));
      } catch (error) {
        console.warn('Jobs API not available, using mock data:', error);
        // Mock active jobs
        setActiveJobs([
          {
            id: '1',
            title: 'Senior Frontend Developer',
            postedDate: '2 ngày trước',
            views: 45,
            applications: 12,
            status: 'active',
            tags: ['React', 'TypeScript', 'Node.js']
          },
          {
            id: '2',
            title: 'Full Stack Developer',
            postedDate: '5 ngày trước',
            views: 78,
            applications: 8,
            status: 'active',
            tags: ['React', 'Node.js', 'MongoDB']
          }
        ]);
        setStats(prev => ({ ...prev, activeJobs: 2 }));
      }

      try {
        // Fetch applications using ApplicationService
        const applicationsResponse = await ApplicationService.getApplications({ page: 1, limit: 4 });
        const recentApps = applicationsResponse.data.slice(0, 4).map(app => ({
          id: app.id,
          name: 'Ứng viên ẩn danh', // Would need to get user info
          jobTitle: app.job?.title || 'Vị trí không xác định',
          appliedDate: new Date(app.appliedAt).toLocaleDateString('vi-VN'),
          avatar: undefined
        }));
        setRecentApplicants(recentApps);
        setStats(prev => ({ ...prev, totalApplications: applicationsResponse.total || recentApps.length }));
      } catch (error) {
        console.warn('Applications API not available, using mock data:', error);
        // Mock recent applicants
        setRecentApplicants([
          {
            id: '1',
            name: 'Nguyễn Văn A',
            jobTitle: 'Senior Frontend Developer',
            appliedDate: '2 giờ trước',
            avatar: undefined
          },
          {
            id: '2',
            name: 'Trần Thị B',
            jobTitle: 'Full Stack Developer',
            appliedDate: '5 giờ trước',
            avatar: undefined
          }
        ]);
        setStats(prev => ({ ...prev, totalApplications: 2 }));
      }

      try {
        // Fetch company info using CompanyService
        const companiesResponse = await CompanyService.getUserCompanies();
        if (companiesResponse.length > 0) {
          setCompanyInfo(companiesResponse[0]);
        }
      } catch (error) {
        console.warn('Companies API not available:', error);
        // Mock company info
        setCompanyInfo({
          id: '1',
          name: 'Công ty ABC',
          industry: 'Công nghệ thông tin',
          city: 'TP.HCM',
          state: 'Hồ Chí Minh',
          country: 'Việt Nam'
        });
      }

      // Set mock stats for other metrics
      setStats(prev => ({
        ...prev,
        totalViews: Math.floor(Math.random() * 1000) + 500,
        hiredCount: Math.floor(Math.random() * 10) + 1,
        responseRate: Math.floor(Math.random() * 30) + 70,
        avgHiringTime: Math.floor(Math.random() * 20) + 5,
        qualityApplicants: Math.floor(Math.random() * 20) + 60
      }));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set fallback stats
      setStats({
        activeJobs: 0,
        totalApplications: 0,
        totalViews: 0,
        hiredCount: 0,
        responseRate: 0,
        avgHiringTime: 0,
        qualityApplicants: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Đang hoạt động", color: "bg-green-100 text-green-700" },
      expired: { label: "Đã hết hạn", color: "bg-red-100 text-red-700" },
      draft: { label: "Bản nháp", color: "bg-yellow-100 text-yellow-700" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
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
              <h1 className="text-3xl font-bold">Dashboard Nhà tuyển dụng</h1>
              <p className="text-gray-600 mt-1">
                Quản lý tin tuyển dụng và theo dõi ứng viên của bạn.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/jobs/post">
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
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-[#f26b38]" />
                </div>
                <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.activeJobs}</div>
              <div className="text-sm text-gray-600">Tin tuyển dụng</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {stats.totalApplications}
              </div>
              <div className="text-sm text-gray-600">Ứng viên mới</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totalViews}</div>
              <div className="text-sm text-gray-600">Lượt xem tin</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.hiredCount}</div>
              <div className="text-sm text-gray-600">Đã tuyển</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Jobs */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Tin tuyển dụng đang hoạt động
                  </h2>
                  <Link href="/dashboard/employer/jobs">
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
                  {activeJobs.length > 0 ? (
                    activeJobs.map((job) => (
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
                            <div className="flex gap-2">
                              {job.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {getStatusBadge(job.status)}
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Chỉnh sửa
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#f26b38] text-[#f26b38]"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Xem ứng viên
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Chưa có tin tuyển dụng nào</p>
                      <Link href="/jobs/post">
                        <Button className="mt-4 bg-[#f26b38] hover:bg-[#e05a27]">
                          Đăng tin đầu tiên
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>

              {/* Recent Applicants */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Ứng viên mới nhất</h2>
                  <Link href="/dashboard/employer/applicants">
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
                  {recentApplicants.length > 0 ? (
                    recentApplicants.map((applicant) => (
                      <div
                        key={applicant.id}
                        className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:border-[#f26b38] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            {applicant.avatar ? (
                              <img
                                src={applicant.avatar}
                                alt={applicant.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <Users className="h-6 w-6 text-[#f26b38]" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              {applicant.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Ứng tuyển: {applicant.jobTitle}
                            </p>
                            <p className="text-xs text-gray-500">
                              {applicant.appliedDate}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/dashboard/employer/applicants/${applicant.id}`}
                        >
                          <Button
                            size="sm"
                            className="bg-[#f26b38] hover:bg-[#e05a27]"
                          >
                            Xem CV
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Chưa có ứng viên nào ứng tuyển</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Thông tin công ty</h3>
                  <Link href="/dashboard/employer/company">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#f26b38]"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Cập nhật
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {companyInfo ? (
                    <>
                      <div className="text-sm">
                        <span className="text-gray-600">Tên công ty:</span>
                        <p className="font-medium">{companyInfo.name}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Ngành:</span>
                        <p className="font-medium">
                          {companyInfo.industry || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Quy mô:</span>
                        <p className="font-medium">
                          {companyInfo.size || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Địa chỉ:</span>
                        <p className="font-medium">
                          {[
                            companyInfo.city,
                            companyInfo.state,
                            companyInfo.country,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Chưa cập nhật"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>Chưa có thông tin công ty</p>
                      <Link href="/dashboard/employer/company">
                        <Button
                          size="sm"
                          className="mt-2 bg-[#f26b38] hover:bg-[#e05a27]"
                        >
                          Cập nhật ngay
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>

              {/* Performance */}
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
                  <div className="flex items-center justify-between text-sm">
                    <span>Thời gian tuyển dụng TB</span>
                    <span className="text-[#f26b38] font-medium">
                      {stats.avgHiringTime} ngày
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Ứng viên chất lượng</span>
                      <span className="text-green-600 font-medium">
                        {stats.qualityApplicants}%
                      </span>
                    </div>
                    <Progress
                      value={stats.qualityApplicants}
                      className="h-2 [&>div]:bg-green-600"
                    />
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Thống kê nhanh</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tin hết hạn</span>
                    <Badge className="bg-red-100 text-red-700">3</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Đang chờ duyệt</span>
                    <Badge className="bg-yellow-100 text-yellow-700">5</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">CV chưa xem</span>
                    <Badge className="bg-blue-100 text-blue-700">24</Badge>
                  </div>
                </div>
              </Card>

              {/* Upgrade */}
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-[#f26b38]/20">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-[#f26b38] mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Nâng cấp gói Premium</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Đăng tin không giới hạn, ưu tiên hiển thị và nhiều tính năng
                    khác
                  </p>
                  <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27]">
                    Nâng cấp ngay
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
