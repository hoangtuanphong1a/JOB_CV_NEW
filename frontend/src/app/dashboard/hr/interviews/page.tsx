"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  Building,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  MapPin,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobTitle: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: "phone" | "video" | "in-person";
  status: "scheduled" | "completed" | "cancelled" | "pending";
  interviewer: string;
  location?: string;
  notes?: string;
  meetingLink?: string;
}

interface InterviewFilters {
  status?: string;
  type?: string;
  search?: string;
  date?: string;
}

export default function HRInterviewsPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<InterviewFilters>({});
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    fetchInterviews();
  }, [filters]);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // Mock data for demonstration
      const mockInterviews: Interview[] = [
        {
          id: "1",
          candidateName: "Nguyễn Văn A",
          candidateEmail: "nguyenvana@email.com",
          candidatePhone: "0901234567",
          jobTitle: "Senior Frontend Developer",
          interviewDate: "2026-03-26",
          interviewTime: "09:00",
          interviewType: "video",
          status: "scheduled",
          interviewer: "HR Manager",
          meetingLink: "https://meet.google.com/abc-def-ghi",
          notes: "Phỏng vấn vòng 1 - Technical",
        },
        {
          id: "2",
          candidateName: "Trần Thị B",
          candidateEmail: "tranthib@email.com",
          candidatePhone: "0907654321",
          jobTitle: "Product Manager",
          interviewDate: "2026-03-26",
          interviewTime: "14:00",
          interviewType: "in-person",
          status: "scheduled",
          interviewer: "CEO",
          location: "Văn phòng công ty - Tầng 5",
          notes: "Phỏng vấn vòng cuối",
        },
        {
          id: "3",
          candidateName: "Lê Văn C",
          candidateEmail: "levanc@email.com",
          jobTitle: "DevOps Engineer",
          interviewDate: "2026-03-25",
          interviewTime: "10:30",
          interviewType: "phone",
          status: "completed",
          interviewer: "Tech Lead",
          notes: "Đã hoàn thành, đánh giá tốt",
        },
        {
          id: "4",
          candidateName: "Phạm Thị D",
          candidateEmail: "phamthid@email.com",
          jobTitle: "UI/UX Designer",
          interviewDate: "2026-03-27",
          interviewTime: "15:00",
          interviewType: "video",
          status: "pending",
          interviewer: "Design Lead",
          meetingLink: "https://zoom.us/j/123456789",
          notes: "Cần xác nhận lịch phỏng vấn",
        },
      ];

      setInterviews(mockInterviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (interviewId: string, newStatus: string) => {
    setInterviews(
      interviews.map((interview) =>
        interview.id === interviewId
          ? { ...interview, status: newStatus as Interview["status"] }
          : interview
      )
    );
  };

  const handleDeleteInterview = async (interviewId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch phỏng vấn này?")) {
      return;
    }
    setInterviews(interviews.filter((interview) => interview.id !== interviewId));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "Đã lên lịch", color: "bg-blue-100 text-blue-700" },
      completed: { label: "Đã hoàn thành", color: "bg-green-100 text-green-700" },
      cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
      pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case "phone":
        return <Phone className="h-5 w-5 text-blue-600" />;
      case "video":
        return <Video className="h-5 w-5 text-purple-600" />;
      case "in-person":
        return <Building className="h-5 w-5 text-green-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInterviewTypeLabel = (type: string) => {
    switch (type) {
      case "phone":
        return "Phỏng vấn qua điện thoại";
      case "video":
        return "Phỏng vấn video";
      case "in-person":
        return "Phỏng vấn trực tiếp";
      default:
        return "Khác";
    }
  };

  const filteredInterviews = interviews.filter((interview) => {
    if (filters.status && interview.status !== filters.status) return false;
    if (filters.type && interview.interviewType !== filters.type) return false;
    if (
      filters.search &&
      !interview.candidateName.toLowerCase().includes(filters.search.toLowerCase()) &&
      !interview.jobTitle.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    if (selectedDate && interview.interviewDate !== selectedDate) return false;
    return true;
  });

  const todayInterviews = interviews.filter(
    (i) => i.interviewDate === new Date().toISOString().split("T")[0]
  );
  const upcomingInterviews = interviews.filter(
    (i) =>
      new Date(i.interviewDate) > new Date() && i.status === "scheduled"
  );
  const pendingInterviews = interviews.filter((i) => i.status === "pending");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải lịch phỏng vấn...</p>
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
                <h1 className="text-3xl font-bold">Quản lý lịch phỏng vấn</h1>
                <p className="text-gray-600 mt-1">
                  Quản lý và theo dõi các lịch phỏng vấn với ứng viên.
                </p>
              </div>
            </div>
            <Button className="bg-[#f26b38] hover:bg-[#e05a27]">
              <Plus className="h-4 w-4 mr-2" />
              Tạo lịch phỏng vấn
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {todayInterviews.length}
              </div>
              <div className="text-sm text-gray-600">Phỏng vấn hôm nay</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {upcomingInterviews.length}
              </div>
              <div className="text-sm text-gray-600">Sắp tới</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {pendingInterviews.length}
              </div>
              <div className="text-sm text-gray-600">Chờ xác nhận</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {interviews.filter((i) => i.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600">Đã hoàn thành</div>
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
                    value={filters.search || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>

              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[180px]"
              />

              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                  <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.type || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả hình thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hình thức</SelectItem>
                  <SelectItem value="phone">Điện thoại</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="in-person">Trực tiếp</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setFilters({});
                  setSelectedDate("");
                }}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Xóa bộ lọc
              </Button>
            </div>
          </Card>

          {/* Interviews List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Danh sách phỏng vấn ({filteredInterviews.length})
              </h2>
            </div>

            <div className="space-y-4">
              {filteredInterviews.length > 0 ? (
                filteredInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-[#f26b38] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Interview Type Icon */}
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {getInterviewTypeIcon(interview.interviewType)}
                        </div>

                        {/* Interview Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {interview.candidateName}
                            </h3>
                            {getStatusBadge(interview.status)}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span className="font-medium text-[#f26b38]">
                                {interview.jobTitle}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(interview.interviewDate).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{interview.interviewTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getInterviewTypeIcon(interview.interviewType)}
                              <span>{getInterviewTypeLabel(interview.interviewType)}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span>{interview.candidateEmail}</span>
                            </div>
                            {interview.candidatePhone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{interview.candidatePhone}</span>
                              </div>
                            )}
                          </div>

                          {interview.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4" />
                              <span>{interview.location}</span>
                            </div>
                          )}

                          {interview.meetingLink && (
                            <div className="flex items-center gap-1 text-sm text-blue-600 mb-2">
                              <Video className="h-4 w-4" />
                              <a
                                href={interview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                Tham gia cuộc họp
                              </a>
                            </div>
                          )}

                          {interview.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <strong>Ghi chú:</strong> {interview.notes}
                              </p>
                            </div>
                          )}

                          <div className="mt-3 text-sm text-gray-500">
                            Người phỏng vấn: {interview.interviewer}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </Button>
                        {interview.status === "scheduled" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500 text-green-600"
                              onClick={() => handleStatusChange(interview.id, "completed")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Hoàn thành
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-600"
                              onClick={() => handleStatusChange(interview.id, "cancelled")}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Hủy
                            </Button>
                          </>
                        )}
                        {interview.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500 text-blue-600"
                            onClick={() => handleStatusChange(interview.id, "scheduled")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Xác nhận
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteInterview(interview.id)}
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
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    Không tìm thấy lịch phỏng vấn nào
                  </p>
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