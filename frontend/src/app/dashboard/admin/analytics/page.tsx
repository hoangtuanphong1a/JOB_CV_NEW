"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Building,
  FileText,
  Calendar,
  ArrowLeft,
  Download,
  RefreshCw,
  Eye,
  Clock,
  Target,
  Activity,
  CheckCircle
} from "lucide-react";

interface AnalyticsData {
  userActivity: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    growthRate: number;
  };
  jobMarket: {
    totalJobs: number;
    activeJobs: number;
    filledJobs: number;
    avgTimeToFill: number;
  };
  applications: {
    totalApplications: number;
    successRate: number;
    avgApplicationsPerJob: number;
    topCategories: Array<{ name: string; count: number }>;
  };
  revenue: {
    totalRevenue: number;
    monthlyRevenue: number;
    subscriptionRevenue: number;
    jobPostRevenue: number;
  };
  systemPerformance: {
    avgResponseTime: number;
    uptime: number;
    errorRate: number;
    concurrentUsers: number;
  };
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'revenue'>('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`/api/admin/analytics?period=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
        setChartData(data.chartData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/analytics/export?format=${format}&period=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${timeRange}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
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
              <p className="mt-4 text-gray-600">Đang tải dữ liệu phân tích...</p>
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Báo cáo & Thống kê</h1>
                <p className="text-gray-600 mt-1">Phân tích dữ liệu và báo cáo chi tiết về hoạt động hệ thống.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 ngày</SelectItem>
                  <SelectItem value="30d">30 ngày</SelectItem>
                  <SelectItem value="90d">90 ngày</SelectItem>
                  <SelectItem value="1y">1 năm</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={fetchAnalyticsData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>

              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mb-8 bg-white p-1 rounded-lg border">
            {[
              { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
              { id: 'users', label: 'Người dùng', icon: Users },
              { id: 'jobs', label: 'Việc làm', icon: Briefcase },
              { id: 'revenue', label: 'Doanh thu', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'users' | 'jobs' | 'revenue')}
                className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#f26b38] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {analyticsData && (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          +{analyticsData.userActivity.growthRate}%
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold mb-1">{analyticsData.userActivity.totalUsers.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Tổng người dùng</div>
                      <div className="text-xs text-green-600 mt-1">
                        {analyticsData.userActivity.activeUsers} đang hoạt động
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <Briefcase className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold mb-1">{analyticsData.jobMarket.totalJobs.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Tin tuyển dụng</div>
                      <div className="text-xs text-green-600 mt-1">
                        {analyticsData.jobMarket.filledJobs} đã tuyển
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold mb-1">{analyticsData.applications.totalApplications.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Đơn ứng tuyển</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {analyticsData.applications.successRate}% tỷ lệ thành công
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <TrendingUp className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold mb-1">{analyticsData.revenue.totalRevenue.toLocaleString()} VND</div>
                      <div className="text-sm text-gray-600">Tổng doanh thu</div>
                      <div className="text-xs text-green-600 mt-1">
                        {analyticsData.revenue.monthlyRevenue.toLocaleString()} VND tháng này
                      </div>
                    </Card>
                  </div>

                  {/* Charts Section */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* User Growth Chart */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Tăng trưởng người dùng</h3>
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600">Biểu đồ tăng trưởng người dùng</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {analyticsData.userActivity.newUsers} người dùng mới trong {timeRange}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Job Market Overview */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Thị trường việc làm</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium">Việc làm đang hoạt động</p>
                            <p className="text-sm text-gray-600">{analyticsData.jobMarket.activeJobs} vị trí</p>
                          </div>
                          <div className="text-2xl font-bold text-blue-600">{analyticsData.jobMarket.activeJobs}</div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium">Thời gian tuyển trung bình</p>
                            <p className="text-sm text-gray-600">từ khi đăng tin</p>
                          </div>
                          <div className="text-2xl font-bold text-green-600">{analyticsData.jobMarket.avgTimeToFill} ngày</div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                          <div>
                            <p className="font-medium">Ứng viên trung bình</p>
                            <p className="text-sm text-gray-600">mỗi vị trí</p>
                          </div>
                          <div className="text-2xl font-bold text-purple-600">{analyticsData.applications.avgApplicationsPerJob}</div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Top Categories */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Danh mục phổ biến</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {analyticsData.applications.topCategories.map((category, index) => (
                        <div key={category.name} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{category.name}</span>
                            <Badge variant="secondary">#{index + 1}</Badge>
                          </div>
                          <div className="text-2xl font-bold text-[#f26b38]">{category.count}</div>
                          <div className="text-xs text-gray-600">việc làm</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold">{analyticsData.userActivity.totalUsers.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Tổng người dùng</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Đang hoạt động</span>
                          <span className="font-medium">{analyticsData.userActivity.activeUsers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Mới đăng ký</span>
                          <span className="font-medium">{analyticsData.userActivity.newUsers}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Activity className="h-8 w-8 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold">{analyticsData.userActivity.growthRate}%</div>
                          <div className="text-sm text-gray-600">Tỷ lệ tăng trưởng</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        So với kỳ trước
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Eye className="h-8 w-8 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold">{analyticsData.systemPerformance.concurrentUsers}</div>
                          <div className="text-sm text-gray-600">Người dùng đồng thời</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Trung bình theo ngày
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Jobs Tab */}
              {activeTab === 'jobs' && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-4 gap-6">
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Briefcase className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold">{analyticsData.jobMarket.totalJobs}</div>
                          <div className="text-sm text-gray-600">Tổng việc làm</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold">{analyticsData.jobMarket.activeJobs}</div>
                          <div className="text-sm text-gray-600">Đang hoạt động</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="h-8 w-8 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold">{analyticsData.jobMarket.filledJobs}</div>
                          <div className="text-sm text-gray-600">Đã tuyển</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="h-8 w-8 text-orange-600" />
                        <div>
                          <div className="text-2xl font-bold">{analyticsData.jobMarket.avgTimeToFill}</div>
                          <div className="text-sm text-gray-600">Ngày trung bình</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        để tuyển xong
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Revenue Tab */}
              {activeTab === 'revenue' && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-4 gap-6">
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold">{analyticsData.revenue.totalRevenue.toLocaleString()} VND</div>
                          <div className="text-sm text-gray-600">Tổng doanh thu</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold">{analyticsData.revenue.monthlyRevenue.toLocaleString()} VND</div>
                          <div className="text-sm text-gray-600">Doanh thu tháng này</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="h-8 w-8 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold">{analyticsData.revenue.subscriptionRevenue.toLocaleString()} VND</div>
                          <div className="text-sm text-gray-600">Từ gói dịch vụ</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Briefcase className="h-8 w-8 text-orange-600" />
                        <div>
                          <div className="text-2xl font-bold">{analyticsData.revenue.jobPostRevenue.toLocaleString()} VND</div>
                          <div className="text-sm text-gray-600">Từ đăng tin</div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Revenue Breakdown */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Phân tích doanh thu</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Biểu đồ doanh thu theo thời gian</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
