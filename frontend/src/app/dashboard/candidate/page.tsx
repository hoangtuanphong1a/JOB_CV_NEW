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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Download,
  MessageSquare,
  Calendar,
  Building,
  MapPin,
  User,
  Send,
  Trash2,
  Edit
} from "lucide-react";
import { ApplicationService } from "@/services/applicationService";

interface Application {
  id: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected' | 'withdrawn';
  appliedAt: string;
  notes?: string;
  job: {
    id: string;
    title: string;
    description?: string;
    company: {
      id: string;
      name: string;
      logo?: string;
    };
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    city?: string;
    country?: string;
  };
  interviewDate?: string;
  feedback?: string;
}

interface ApplicationFilters {
  status?: string;
  search?: string;
}

export default function CandidateApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ApplicationFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

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

      const response = await ApplicationService.getMyApplications();

      // Transform the data to match our local interface
      const transformedApplications: Application[] = response.map(app => ({
        id: app.id,
        status: app.status.toLowerCase() as Application['status'],
        appliedAt: app.appliedAt,
        notes: app.coverLetter, // Using cover letter as notes
        job: {
          id: app.jobId,
          title: app.job?.title || 'Vị trí không xác định',
          description: '', // Not available in service
          company: {
            id: app.job?.company?.id || '',
            name: app.job?.company?.name || 'Công ty không xác định',
            logo: app.job?.company?.logo
          },
          salaryMin: undefined, // Not available in service
          salaryMax: undefined, // Not available in service
          currency: 'VNĐ',
          city: '', // Not available in service
          country: '' // Not available in service
        },
        interviewDate: undefined, // Not available in service
        feedback: undefined // Not available in service
      }));

      setApplications(transformedApplications);
      setTotalPages(1); // For now, assuming single page
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    if (!confirm('Bạn có chắc chắn muốn rút đơn ứng tuyển này?')) return;

    try {
      await ApplicationService.withdrawApplication(applicationId);
      fetchApplications(); // Refresh the list
      alert('Đã rút đơn ứng tuyển thành công');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Có lỗi xảy ra khi rút đơn ứng tuyển. Vui lòng thử lại.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Đã gửi', color: 'bg-blue-100 text-blue-700', icon: Send },
      reviewing: { label: 'Đang xem xét', color: 'bg-yellow-100 text-yellow-700', icon: Eye },
      shortlisted: { label: 'Ứng viên tiềm năng', color: 'bg-purple-100 text-purple-700', icon: CheckCircle },
      interviewed: { label: 'Đã phỏng vấn', color: 'bg-indigo-100 text-indigo-700', icon: MessageSquare },
      offered: { label: 'Đã đề nghị', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      hired: { label: 'Đã tuyển', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
      rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-700', icon: XCircle },
      withdrawn: { label: 'Đã rút', color: 'bg-gray-100 text-gray-700', icon: AlertTriangle }
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
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Đã gửi' },
    { value: 'reviewing', label: 'Đang xem xét' },
    { value: 'shortlisted', label: 'Ứng viên tiềm năng' },
    { value: 'interviewed', label: 'Đã phỏng vấn' },
    { value: 'offered', label: 'Đã đề nghị' },
    { value: 'hired', label: 'Đã tuyển' },
    { value: 'rejected', label: 'Đã từ chối' },
    { value: 'withdrawn', label: 'Đã rút' }
  ];

  const formatSalary = (job: Application['job']) => {
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.currency || 'VNĐ'}`;
    }
    return 'Thương lượng';
  };

  const filteredApplications = applications.filter(app => {
    if (filters.status && filters.status !== 'all') {
      return app.status === filters.status;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        app.job.title.toLowerCase().includes(searchLower) ||
        app.job.company.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

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
                onClick={() => router.push('/dashboard/candidate')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Quản lý đơn ứng tuyển</h1>
                <p className="text-gray-600 mt-1">Theo dõi và quản lý tất cả đơn ứng tuyển của bạn.</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{applications.length}</div>
              <div className="text-sm text-gray-600">Tổng đơn ứng tuyển</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Đang chờ</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {applications.filter(app => app.status === 'interviewed').length}
              </div>
              <div className="text-sm text-gray-600">Đã phỏng vấn</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {applications.filter(app => ['offered', 'hired'].includes(app.status)).length}
              </div>
              <div className="text-sm text-gray-600">Thành công</div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên công việc hoặc công ty..."
                    className="pl-10"
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>

              <Select value={filters.status || 'all'} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
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
              <h2 className="text-xl font-semibold">Danh sách đơn ứng tuyển ({filteredApplications.length})</h2>
            </div>

            <div className="space-y-4">
              {filteredApplications.length > 0 ? filteredApplications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-6 hover:border-[#f26b38] transition-colors">
                  <div className="flex items-start gap-6">
                    {/* Company Logo */}
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                      {application.job.company.logo ? (
                        <img src={application.job.company.logo} alt={application.job.company.name} className="w-full h-full rounded-lg object-cover" />
                      ) : (
                        <Building className="h-8 w-8 text-[#f26b38]" />
                      )}
                    </div>

                    {/* Application Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-[#f26b38]">{application.job.title}</h3>
                            {getStatusBadge(application.status)}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              <span className="font-medium">{application.job.company.name}</span>
                            </div>
                            {(application.job.city || application.job.country) && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{[application.job.city, application.job.country].filter(Boolean).join(', ')}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Ứng tuyển {new Date(application.appliedAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-3">
                            <span className="font-medium text-green-600">{formatSalary(application.job)}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <Link href={`/jobs/${application.job.id}`}>
                            <Button size="sm" variant="outline" className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Xem công việc
                            </Button>
                          </Link>
                          {application.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
                              onClick={() => handleWithdrawApplication(application.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Rút đơn
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Job Description Preview */}
                      {application.job.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {application.job.description}
                          </p>
                        </div>
                      )}

                      {/* Interview Info */}
                      {application.interviewDate && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-700">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Phỏng vấn: {new Date(application.interviewDate).toLocaleString('vi-VN')}
                            </span>
                          </div>
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

                      {/* Notes */}
                      {application.notes && (
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-700">
                            <strong>Ghi chú của bạn:</strong> {application.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-4">Không tìm thấy đơn ứng tuyển nào</p>
                  <Link href="/jobs">
                    <Button className="bg-[#f26b38] hover:bg-[#e05a27]">
                      Tìm việc làm ngay
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
