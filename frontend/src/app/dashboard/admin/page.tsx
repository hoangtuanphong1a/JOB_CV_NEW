"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Briefcase,
  Building,
  FileText,
  TrendingUp,
  Activity,
  Shield,
  Settings,
  LogOut,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Database,
  Server,
  UserCog
} from "lucide-react";
import { adminService, AdminStats } from "@/services/adminService";

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'job_posted' | 'application_submitted' | 'company_created';
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error';
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    users: { total: 0, active: 0, newToday: 0 },
    jobs: { total: 0, active: 0, newToday: 0 },
    companies: { total: 0, active: 0, newToday: 0 },
    applications: { total: 0, pending: 0, newToday: 0 },
    revenue: { total: 0, thisMonth: 0, growth: 0 },
    system: { uptime: 0, memoryUsage: 0, diskUsage: 0 }
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch admin dashboard overview using the service
      const data = await adminService.getDashboardOverview();
      setStats(data);

      // Mock recent activity data (in real app, this would come from API)
      setRecentActivity([
        {
          id: '1',
          type: 'user_registered',
          description: 'Nguyễn Văn A đã đăng ký tài khoản mới',
          timestamp: '2025-01-29 13:30',
          status: 'success'
        },
        {
          id: '2',
          type: 'job_posted',
          description: 'Công ty Tech Corp đã đăng tin tuyển dụng Developer',
          timestamp: '2025-01-29 12:45',
          status: 'success'
        },
        {
          id: '3',
          type: 'application_submitted',
          description: 'Trần Thị B đã ứng tuyển vị trí Marketing Manager',
          timestamp: '2025-01-29 11:20',
          status: 'success'
        },
        {
          id: '4',
          type: 'company_created',
          description: 'Công ty mới Global Solutions đã được tạo',
          timestamp: '2025-01-29 10:15',
          status: 'warning'
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'job_posted':
        return <Briefcase className="h-4 w-4 text-green-600" />;
      case 'application_submitted':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'company_created':
        return <Building className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Header with actions */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">HR Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Quản lý toàn bộ hệ thống và giám sát hoạt động.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt hệ thống
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
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+{stats.users.newToday}</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.users.total.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Tổng người dùng</div>
              <div className="text-xs text-green-600 mt-1">{stats.users.active} đang hoạt động</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+{stats.jobs.newToday}</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.jobs.total.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Tin tuyển dụng</div>
              <div className="text-xs text-green-600 mt-1">{stats.jobs.active} đang hoạt động</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+{stats.companies.newToday}</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.companies.total.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Công ty</div>
              <div className="text-xs text-green-600 mt-1">{stats.companies.active} đang hoạt động</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">{stats.applications.pending}</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.applications.total.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Đơn ứng tuyển</div>
              <div className="text-xs text-orange-600 mt-1">+{stats.applications.newToday} hôm nay</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Management Actions */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Quản lý hệ thống</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 hover:border-[#f26b38] hover:text-[#f26b38]"
                    onClick={() => router.push('/dashboard/admin/users')}
                  >
                    <UserCog className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Quản lý người dùng</div>
                      <div className="text-sm text-gray-600">Xem, chỉnh sửa và quản lý tài khoản</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 hover:border-[#f26b38] hover:text-[#f26b38]"
                    onClick={() => router.push('/dashboard/admin/jobs')}
                  >
                    <Briefcase className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Quản lý tin tuyển dụng</div>
                      <div className="text-sm text-gray-600">Duyệt và quản lý các tin đăng</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 hover:border-[#f26b38] hover:text-[#f26b38]"
                    onClick={() => router.push('/dashboard/admin/companies')}
                  >
                    <Building className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Quản lý công ty</div>
                      <div className="text-sm text-gray-600">Xem và quản lý thông tin công ty</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 hover:border-[#f26b38] hover:text-[#f26b38]"
                    onClick={() => router.push('/dashboard/admin/applications')}
                  >
                    <FileText className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Quản lý ứng tuyển</div>
                      <div className="text-sm text-gray-600">Xem và xử lý đơn ứng tuyển</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 hover:border-[#f26b38] hover:text-[#f26b38]"
                    onClick={() => router.push('/dashboard/admin/content')}
                  >
                    <Settings className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Quản lý nội dung</div>
                      <div className="text-sm text-gray-600">Skills, danh mục và nội dung khác</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 hover:border-[#f26b38] hover:text-[#f26b38]"
                    onClick={() => router.push('/dashboard/admin/analytics')}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Báo cáo & Thống kê</div>
                      <div className="text-sm text-gray-600">Phân tích dữ liệu và báo cáo</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 hover:border-[#f26b38] hover:text-[#f26b38]"
                    onClick={() => router.push('/dashboard/admin/blog')}
                  >
                    <FileText className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Quản lý Blog</div>
                      <div className="text-sm text-gray-600">Bài viết, duyệt nội dung, thống kê</div>
                    </div>
                  </Button>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Hoạt động gần đây</h2>
                  <Button variant="ghost" size="sm" className="text-[#f26b38]">
                    Xem tất cả
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                      {activity.status && (
                        <div className={`text-xs font-medium ${getActivityStatusColor(activity.status)}`}>
                          {activity.status === 'success' && <CheckCircle className="h-4 w-4" />}
                          {activity.status === 'warning' && <AlertTriangle className="h-4 w-4" />}
                          {activity.status === 'error' && <XCircle className="h-4 w-4" />}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* System Health */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Tình trạng hệ thống
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Uptime</span>
                      <span className="text-green-600 font-medium">{stats.system.uptime}%</span>
                    </div>
                    <Progress value={stats.system.uptime} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>RAM sử dụng</span>
                      <span className="text-blue-600 font-medium">{stats.system.memoryUsage}%</span>
                    </div>
                    <Progress value={stats.system.memoryUsage} className="h-2 [&>div]:bg-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Đĩa sử dụng</span>
                      <span className="text-purple-600 font-medium">{stats.system.diskUsage}%</span>
                    </div>
                    <Progress value={stats.system.diskUsage} className="h-2 [&>div]:bg-purple-600" />
                  </div>
                </div>
              </Card>

              {/* Revenue Overview */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Doanh thu
                </h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {stats.revenue.thisMonth.toLocaleString()} VND
                  </div>
                  <div className="text-sm text-gray-600 mb-4">Tháng này</div>
                  <div className="flex items-center justify-center gap-2">
                    <Badge className={stats.revenue.growth >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                      {stats.revenue.growth >= 0 ? '+' : ''}{stats.revenue.growth}%
                    </Badge>
                    <span className="text-sm text-gray-600">so với tháng trước</span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Hành động nhanh</h3>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Sao lưu dữ liệu
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Kiểm tra bảo mật
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Xem logs hệ thống
                  </Button>
                </div>
              </Card>

              {/* Alerts */}
              <Card className="p-6 border-red-200 bg-red-50">
                <h3 className="font-semibold mb-4 text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Cảnh báo
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-700">5 tin tuyển dụng hết hạn</p>
                      <p className="text-xs text-red-600">Cần xử lý khẩn cấp</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-700">3 công ty chờ duyệt</p>
                      <p className="text-xs text-yellow-600">Xem xét trong 24h</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
