"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Users,
  Calendar,
  Edit,
  Trash2,
  ArrowLeft,
  Clock,
  MapPin,
  DollarSign,
  Building,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  location?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  jobType?: string;
  status: "active" | "expired" | "draft" | "closed";
  applicationsCount: number;
  viewsCount: number;
  createdAt: string;
  expiredAt?: string;
  category?: {
    id: string;
    name: string;
  };
}

interface JobFilters {
  status?: string;
  search?: string;
}

export default function HRJobsPage() {
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
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...filters,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/jobs/my-jobs?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setJobs(data.data || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Đang hoạt động", color: "bg-green-100 text-green-700" },
      expired: { label: "Đã hết hạn", color: "bg-red-100 text-red-700" },
      draft: { label: "Bản nháp", color: "bg-gray-100 text-gray-700" },
      closed: { label: "Đã đóng", color: "bg-yellow-100 text-yellow-700" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatSalary = (amount: number): string => {
    const cleanAmount = Math.floor(amount);
    return cleanAmount.toLocaleString("vi-VN");
  };

  const formatSalaryDisplay = (salary?: {
    min: number;
    max: number;
    currency: string;
  }) => {
    if (!salary) return "Thương lượng";
    if (salary.min && salary.max) {
      return `${formatSalary(salary.min)} - ${formatSalary(salary.max)} ${salary.currency}`;
    }
    if (salary.min) {
      return `Từ ${formatSalary(salary.min)} ${salary.currency}`;
    }
    if (salary.max) {
      return `Đến ${formatSalary(salary.max)} ${salary.currency}`;
    }
    return "Thương lượng";
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
                onClick={() => router.push("/dashboard/hr")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Quản lý tin tuyển dụng</h1>
                <p className="text-gray-600 mt-1">
                  Quản lý và theo dõi các tin tuyển dụng của bạn.
                </p>
              </div>
            </div>
            <Link href="/dashboard/hr/jobs/post">
              <Button className="bg-[#f26b38] hover:bg-[#e05a27]">
                <Plus className="h-4 w-4 mr-2" />
                Đăng tin mới
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên vị trí..."
                    className="pl-10"
                    value={filters.search || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>

              <Select
                value={filters.status || ""}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value || undefined })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="expired">Đã hết hạn</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="closed">Đã đóng</SelectItem>
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

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {jobs.filter((job) => job.status === "active").length}
              </div>
              <div className="text-sm text-gray-600">Đang hoạt động</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {jobs.reduce((sum, job) => sum + job.applicationsCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Tổng ứng viên</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {jobs.reduce((sum, job) => sum + job.viewsCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Tổng lượt xem</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Clock className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {jobs.filter((job) => job.status === "draft").length}
              </div>
              <div className="text-sm text-gray-600">Bản nháp</div>
            </Card>
          </div>

          {/* Jobs List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Danh sách tin tuyển dụng ({jobs.length})
              </h2>
            </div>

            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-[#f26b38] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          {getStatusBadge(job.status)}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-green-600 font-medium">
                              {formatSalaryDisplay(job.salary)}
                            </span>
                          </div>
                          {job.jobType && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.jobType}</span>
                            </div>
                          )}
                          {job.category && (
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              <span>{job.category.name}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>
                              Đăng: {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                          {job.expiredAt && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>
                                Hết hạn: {new Date(job.expiredAt).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{job.applicationsCount} ứng viên</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span>{job.viewsCount} lượt xem</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <Link href={`/dashboard/hr/jobs/post?id=${job.id}`}>
                          <Button size="sm" variant="outline" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </Button>
                        </Link>
                        <Link href={`/dashboard/hr/applications?jobId=${job.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-[#f26b38] text-[#f26b38]"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Xem ứng viên
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-4">
                    Bạn chưa có tin tuyển dụng nào
                  </p>
                  <Link href="/dashboard/hr/jobs/post">
                    <Button className="bg-[#f26b38] hover:bg-[#e05a27]">
                      <Plus className="h-4 w-4 mr-2" />
                      Đăng tin tuyển dụng đầu tiên
                    </Button>
                  </Link>
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={
                        page === currentPage
                          ? "bg-[#f26b38] hover:bg-[#e05a27]"
                          : ""
                      }
                    >
                      {page}
                    </Button>
                  ),
                )}

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