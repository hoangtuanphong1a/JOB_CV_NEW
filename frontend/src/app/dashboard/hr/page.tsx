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
  ArrowLeft,
  Download,
  MessageSquare,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

interface Application {
  id: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  appliedDate: string;
  notes?: string;
  job: {
    id: string;
    title: string;
    salary?: {
      min: number;
      max: number;
      currency: string;
    };
  };
  candidate: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
    location?: string;
    experience?: string;
    skills?: string[];
    resume?: {
      id: string;
      filename: string;
      url: string;
    };
    rating?: number;
  };
  interviewDate?: string;
  feedback?: string;
  jobSeekerProfile: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    experience?: string;
    skills: Array<{
      id: string;
      name: string;
    }>;
  };
  reviewedBy?: {
    id: string;
    fullName: string;
  };
  createdAt: string;
}

interface ApplicationFilters {
  status?: string;
  jobId?: string;
  search?: string;
}

export default function HRApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ApplicationFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [filters, currentPage]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...filters
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/applications?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.data || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string, notes?: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/applications/${applicationId}/status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus, notes })
      });

      if (response.ok) {
        fetchApplications(); // Refresh the list
        // Send notification to applicant about status change
        await sendStatusChangeNotification(applicationId, newStatus, notes);
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.message || 'Không thể cập nhật trạng thái'}`);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const sendStatusChangeNotification = async (applicationId: string, newStatus: string, notes?: string) => {
    try {
      const token = localStorage.getItem('access_token');
      // This would be a separate API call to send notification to applicant
      // For now, we'll just log it
      console.log('Sending status change notification:', { applicationId, newStatus, notes });
    } catch (error) {
      console.error('Error sending notification:', error);
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

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary) return 'Thỏa thuận';
    if (salary.min && salary.max) {
      return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${salary.currency}`;
    }
    return `${salary.min?.toLocaleString() || salary.max?.toLocaleString()} ${salary.currency}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

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
                onClick={() => router.push('/dashboard/hr')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Đơn ứng tuyển</h1>
                <p className="text-gray-600 mt-1">Quản lý và xem xét các đơn ứng tuyển cho công ty của bạn.</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Chờ xử lý</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {applications.filter(app => app.status === 'reviewing').length}
              </div>
              <div className="text-sm text-gray-600">Đang xem xét</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {applications.filter(app => app.status === 'shortlisted').length}
              </div>
              <div className="text-sm text-gray-600">Ứng viên tiềm năng</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {applications.filter(app => app.status === 'interviewed').length}
              </div>
              <div className="text-sm text-gray-600">Đã phỏng vấn</div>
            </Card>
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

              <Select value={filters.status || ''} onValueChange={(value) => setFilters({ ...filters, status: value || undefined })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  {getStatusOptions().map(option => (
                    <SelectItem key={option.value} value={option.label}>
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Applications List */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Danh sách ứng viên ({applications.length})</h2>
                </div>

                <div className="space-y-4">
                  {applications.length > 0 ? applications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-6 hover:border-[#f26b38] transition-colors cursor-pointer"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <div className="flex items-start gap-6">
                        {/* Candidate Avatar */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                          {application.candidate.avatar ? (
                            <img src={application.candidate.avatar} alt={application.candidate.fullName} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="h-8 w-8 text-[#f26b38]" />
                          )}
                        </div>

                        {/* Application Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{application.jobSeekerProfile.fullName}</h3>
                                {getStatusBadge(application.status)}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4" />
                                  <span className="font-medium text-[#f26b38]">{application.job.title}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-green-600">{formatSalary(application.job.salary)}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <span>{application.jobSeekerProfile.email}</span>
                                {application.jobSeekerProfile.phone && <span>{application.jobSeekerProfile.phone}</span>}
                                {application.jobSeekerProfile.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{application.jobSeekerProfile.location}</span>
                                  </div>
                                )}
                              </div>

                              {application.jobSeekerProfile.experience && (
                                <div className="text-sm text-gray-600 mb-2">
                                  <span className="font-medium">Kinh nghiệm:</span> {application.jobSeekerProfile.experience}
                                </div>
                              )}

                              {application.jobSeekerProfile.skills && application.jobSeekerProfile.skills.length > 0 && (
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-sm font-medium text-gray-600">Kỹ năng:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {application.jobSeekerProfile.skills.slice(0, 3).map((skill, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {skill.name}
                                      </Badge>
                                    ))}
                                    {application.jobSeekerProfile.skills.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{application.jobSeekerProfile.skills.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Ứng tuyển: {new Date(application.createdAt).toLocaleDateString('vi-VN')}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                              <Button size="sm" variant="outline" className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Xem CV
                              </Button>
                              {application.candidate.resume && (
                                <Button size="sm" variant="outline" className="flex items-center gap-2">
                                  <Download className="h-4 w-4" />
                                  Tải CV
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Liên hệ
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

                          {/* Quick Status Update */}
                          <div className="flex items-center gap-2 pt-4 border-t">
                            <span className="text-sm font-medium">Cập nhật trạng thái:</span>
                            <Select onValueChange={(value) => handleStatusChange(application.id, value)}>
                              <SelectTrigger className="w-[150px]">
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

            {/* Application Details Sidebar */}
            <div className="space-y-6">
              {selectedApplication ? (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Chi tiết ứng viên</h3>

                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mx-auto mb-4">
                        <User className="h-10 w-10 text-[#f26b38]" />
                      </div>
                      <h4 className="font-semibold text-lg">{selectedApplication.jobSeekerProfile.fullName}</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedApplication.jobSeekerProfile.email}</span>
                      </div>

                      {selectedApplication.jobSeekerProfile.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{selectedApplication.jobSeekerProfile.phone}</span>
                        </div>
                      )}

                      {selectedApplication.jobSeekerProfile.location && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{selectedApplication.jobSeekerProfile.location}</span>
                        </div>
                      )}

                      {selectedApplication.jobSeekerProfile.experience && (
                        <div className="text-sm">
                          <span className="font-medium">Kinh nghiệm:</span> {selectedApplication.jobSeekerProfile.experience}
                        </div>
                      )}
                    </div>

                    {selectedApplication.jobSeekerProfile.skills && selectedApplication.jobSeekerProfile.skills.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Kỹ năng</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedApplication.jobSeekerProfile.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Vị trí ứng tuyển:</span>
                        <span className="font-medium">{selectedApplication.job.title}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Mức lương:</span>
                        <span className="font-medium text-green-600">{formatSalary(selectedApplication.job.salary)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Ngày ứng tuyển:</span>
                        <span>{new Date(selectedApplication.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Trạng thái:</span>
                        {getStatusBadge(selectedApplication.status)}
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6">
                  <div className="text-center py-12">
                    <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Chọn một ứng viên để xem chi tiết</p>
                  </div>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Hành động nhanh</h3>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Lên lịch phỏng vấn
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Gửi đề nghị
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Gửi phản hồi
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <XCircle className="h-4 w-4 mr-2" />
                    Từ chối ứng viên
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
