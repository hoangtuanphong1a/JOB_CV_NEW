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
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Briefcase,
  Building,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Download,
  MessageSquare
} from "lucide-react";
import { adminService } from "@/services/adminService";

interface Application {
  id: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  appliedDate: string;
  notes?: string;
  job: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
    };
  };
  applicant: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
    resume?: {
      id: string;
      filename: string;
      url: string;
    };
  };
  interviewDate?: string;
  feedback?: string;
}

interface ApplicationFilters {
  status?: string;
  jobId?: string;
  userId?: string;
  search?: string;
}

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ApplicationFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApplications();
  }, [filters, currentPage]);

  const fetchApplications = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 20,
        ...filters
      };

      const response = await adminService.getAllApplications(params);

      // Transform the data to match our local interface
      const transformedApplications: Application[] = response.data.map(app => ({
        id: app.id,
        status: app.status.toLowerCase() as Application['status'],
        appliedDate: app.createdAt,
        notes: app.notes,
        job: {
          id: app.job.id,
          title: app.job.title,
          company: {
            id: app.job.company.id,
            name: app.job.company.name
          }
        },
        applicant: {
          id: app.jobSeekerProfile.user.id,
          fullName: `${app.jobSeekerProfile.user.firstName || ''} ${app.jobSeekerProfile.user.lastName || ''}`.trim() || app.jobSeekerProfile.user.email,
          email: app.jobSeekerProfile.user.email,
          phone: undefined, // Not available in admin service
          avatar: undefined, // Not available in admin service
          resume: undefined // Not available in admin service
        },
        interviewDate: undefined, // Not available in admin service
        feedback: undefined // Not available in admin service
      }));

      setApplications(transformedApplications);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string, notes?: string) => {
    try {
      await adminService.updateApplicationStatus(applicationId, newStatus, notes);
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      reviewing: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-700', icon: Eye },
      shortlisted: { label: 'Ứng viên tiềm năng', color: 'bg-purple-100 text-purple-700', icon: CheckCircle },
      interviewed: { label: 'Đã phỏng vấn', color: 'bg-indigo-100 text-indigo-700', icon: MessageSquare },
      offered: { label: 'Đã đề nghị', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      hired: { label: 'Đã tuyển', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
      rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-700', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getStatusOptions = () => [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'reviewing', label: 'Đang xem xét' },
    { value: 'shortlisted', label: 'Ứng viên tiềm năng' },
    { value: 'interviewed', label: 'Đã phỏng vấn' },
    { value: 'offered', label: 'Đã đề nghị' },
    { value: 'hired', label: 'Đã tuyển' },
    { value: 'rejected', label: 'Đã từ chối' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách đơn ứng tuyển...</p>
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
                <h1 className="text-3xl font-bold">Quản lý đơn ứng tuyển</h1>
                <p className="text-gray-600 mt-1">Xem và xử lý tất cả đơn ứng tuyển trên hệ thống.</p>
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
                    placeholder="Tìm kiếm theo tên ứng viên hoặc vị trí..."
                    className="pl-10"
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>

              <Select value={filters.status || 'all'} onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {getStatusOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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

          {/* Applications List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Danh sách đơn ứng tuyển ({applications.length})</h2>
            </div>

            <div className="space-y-4">
              {applications.length > 0 ? applications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-6 hover:border-[#f26b38] transition-colors">
                  <div className="flex items-start gap-6">
                    {/* Applicant Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                      {application.applicant.avatar ? (
                        <img src={application.applicant.avatar} alt={application.applicant.fullName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="h-8 w-8 text-[#f26b38]" />
                      )}
                    </div>

                    {/* Application Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{application.applicant.fullName}</h3>
                            {getStatusBadge(application.status)}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span className="font-medium text-[#f26b38]">{application.job.title}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              <span>{application.job.company.name}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{application.applicant.email}</span>
                            {application.applicant.phone && <span>{application.applicant.phone}</span>}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Ứng tuyển: {new Date(application.appliedDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Xem CV
                          </Button>
                          {application.applicant.resume && (
                            <Button size="sm" variant="outline" className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              Tải CV
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Xem hồ sơ
                          </Button>
                        </div>
                      </div>

                      {/* Notes */}
                      {application.notes && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Ghi chú:</strong> {application.notes}
                          </p>
                        </div>
                      )}

                      {/* Interview Info */}
                      {application.interviewDate && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700">
                            <strong>Phỏng vấn:</strong> {new Date(application.interviewDate).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      )}

                      {/* Feedback */}
                      {application.feedback && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Phản hồi:</strong> {application.feedback}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status Management */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <div className="text-sm font-medium mb-2">Cập nhật trạng thái:</div>
                      <Select onValueChange={(value) => handleStatusChange(application.id, value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          {getStatusOptions().map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Quick Actions */}
                      <div className="flex gap-1 mt-2">
                        {application.status === 'pending' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 flex-1"
                            onClick={() => handleStatusChange(application.id, 'reviewing')}
                          >
                            Bắt đầu xem xét
                          </Button>
                        )}

                        {application.status === 'reviewing' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 flex-1"
                              onClick={() => handleStatusChange(application.id, 'shortlisted')}
                            >
                              Chọn
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 flex-1"
                              onClick={() => handleStatusChange(application.id, 'rejected')}
                            >
                              Từ chối
                            </Button>
                          </>
                        )}

                        {application.status === 'shortlisted' && (
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 flex-1"
                            onClick={() => handleStatusChange(application.id, 'interviewed')}
                          >
                            Đã phỏng vấn
                          </Button>
                        )}

                        {application.status === 'interviewed' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 flex-1"
                              onClick={() => handleStatusChange(application.id, 'offered')}
                            >
                              Đề nghị
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 flex-1"
                              onClick={() => handleStatusChange(application.id, 'rejected')}
                            >
                              Từ chối
                            </Button>
                          </>
                        )}

                        {application.status === 'offered' && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                            onClick={() => handleStatusChange(application.id, 'hired')}
                          >
                            Đã tuyển
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Không tìm thấy đơn ứng tuyển nào</p>
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
