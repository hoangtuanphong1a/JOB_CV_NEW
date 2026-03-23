"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Briefcase,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import { adminService, Job as AdminJob } from "@/services/adminService";

interface Job {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo?: string;
  };
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'draft' | 'published' | 'closed' | 'expired' | 'pending_approval';
  postedDate: string;
  expiryDate?: string;
  applicationsCount: number;
  viewsCount: number;
  category: string;
  employmentType: string;
  description: string;
}

interface JobFilters {
  status?: string;
  company?: string;
  category?: string;
  search?: string;
}

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [filters, currentPage]);

  const fetchJobs = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 20,
        ...filters
      };

      const response = await adminService.getAllJobs(params);

      // Transform the data to match UI expectations
      const transformedJobs: Job[] = response.data.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: 'Not specified', // Not available in current backend
        salary: job.salaryMin && job.salaryMax ? {
          min: job.salaryMin,
          max: job.salaryMax,
          currency: 'VND'
        } : undefined,
        status: job.status as Job['status'],
        postedDate: job.createdAt,
        expiryDate: job.expiresAt || undefined,
        applicationsCount: job.applications?.length || 0,
        viewsCount: 0, // Not available in current backend
        category: 'General', // Not available in current backend
        employmentType: 'Full-time', // Not available in current backend
        description: job.description
      }));

      setJobs(transformedJobs);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await adminService.updateJobStatus(jobId, newStatus);
      fetchJobs(); // Refresh the list
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Đã xuất bản', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      draft: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-700', icon: Edit },
      closed: { label: 'Đã đóng', color: 'bg-red-100 text-red-700', icon: XCircle },
      expired: { label: 'Đã hết hạn', color: 'bg-orange-100 text-orange-700', icon: Clock },
      pending_approval: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary) return 'Thỏa thuận';
    if (salary.min && salary.max) {
      return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${salary.currency}`;
    }
    return `${salary.min?.toLocaleString() || salary.max?.toLocaleString()} ${salary.currency}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách tin tuyển dụng...</p>
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
                <h1 className="text-3xl font-bold">Quản lý tin tuyển dụng</h1>
                <p className="text-gray-600 mt-1">Duyệt và quản lý tất cả tin tuyển dụng trên hệ thống.</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tiêu đề công việc..."
                    className="pl-10"
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>

              <Select value={filters.status || 'all'} onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value })}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="closed">Đã đóng</SelectItem>
                  <SelectItem value="expired">Đã hết hạn</SelectItem>
                  <SelectItem value="pending_approval">Chờ duyệt</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.category || 'all'} onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? undefined : value })}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  <SelectItem value="technology">Công nghệ</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Bán hàng</SelectItem>
                  <SelectItem value="finance">Tài chính</SelectItem>
                  <SelectItem value="hr">Nhân sự</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setFilters({})}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Xóa bộ lọc
              </Button>
            </div>
          </Card>

          {/* Jobs List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Danh sách tin tuyển dụng ({jobs.length})</h2>
            </div>

            <div className="space-y-4">
              {jobs.length > 0 ? jobs.map((job) => (
                <div key={job.id} className="p-6 border border-gray-200 rounded-lg hover:border-[#f26b38] transition-colors">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                          {job.company.logo ? (
                            <img src={job.company.logo} alt={job.company.name} className="w-full h-full rounded-lg object-cover" />
                          ) : (
                            <Building className="h-6 w-6 text-[#f26b38]" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold hover:text-[#f26b38] cursor-pointer">{job.title}</h3>
                            {getStatusBadge(job.status)}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              <span>{job.company.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Đăng {new Date(job.postedDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span>{job.applicationsCount} ứng viên</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-gray-400" />
                              <span>{job.viewsCount} lượt xem</span>
                            </div>
                            <div className="font-medium text-green-600">
                              {formatSalary(job.salary)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="secondary">{job.category}</Badge>
                            <Badge variant="outline">{job.employmentType}</Badge>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </Button>

                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Xem công việc
                      </Button>

                      {job.status === 'pending_approval' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 flex-1"
                            onClick={() => handleStatusChange(job.id, 'published')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 flex-1"
                            onClick={() => handleStatusChange(job.id, 'draft')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Từ chối
                          </Button>
                        </div>
                      )}

                      {job.status === 'published' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleStatusChange(job.id, 'closed')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Đóng tin
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Không tìm thấy tin tuyển dụng nào</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Trước
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? "bg-[#f26b38] hover:bg-[#e05a27]" : ""}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Sau
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
