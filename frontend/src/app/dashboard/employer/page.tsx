"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Eye,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
} from "lucide-react";

interface ApplicantDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle: string;
  jobId: string;
  appliedDate: string;
  status:
    | "pending"
    | "reviewing"
    | "shortlisted"
    | "interviewed"
    | "accepted"
    | "rejected";
  avatar?: string;
  coverLetter?: string;
  resumeUrl?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  rating?: number;
  lastActivity?: string;
  // Additional profile information
  bio?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  languages?: string[];
  certifications?: string[];
}

export default function ApplicantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const applicantId = params.id as string;

  const [applicant, setApplicant] = useState<ApplicantDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateNotes, setStatusUpdateNotes] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  useEffect(() => {
    fetchApplicantDetail();
  }, [applicantId]);

  const fetchApplicantDetail = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // First get all applications to find the specific one
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const applications = data.data || [];
        const application = applications.find(
          (app: any) => app.jobSeekerProfile?.user?.id === applicantId
        );

        if (application) {
          const applicantDetail: ApplicantDetail = {
            id: application.jobSeekerProfile?.user?.id || application.id,
            name:
              `${application.jobSeekerProfile?.user?.firstName || ""} ${
                application.jobSeekerProfile?.user?.lastName || ""
              }`.trim() || "Unknown",
            email: application.jobSeekerProfile?.email || "",
            phone: application.jobSeekerProfile?.phone || "",
            jobTitle: application.job?.title || "Unknown Job",
            jobId: application.jobId,
            appliedDate: new Date(application.createdAt).toLocaleDateString(
              "vi-VN"
            ),
            status: application.status,
            avatar: application.jobSeekerProfile?.user?.avatar,
            coverLetter: application.coverLetter,
            resumeUrl: application.resumeUrl,
            experience: application.jobSeekerProfile?.experience,
            education: application.jobSeekerProfile?.education,
            skills:
              application.jobSeekerProfile?.skills?.map((s: any) => s.name) ||
              [],
            rating: application.rating || 0,
            lastActivity: application.updatedAt
              ? new Date(application.updatedAt).toLocaleDateString("vi-VN")
              : undefined,
            bio: application.jobSeekerProfile?.bio,
            location: application.jobSeekerProfile?.location,
            linkedin: application.jobSeekerProfile?.linkedin,
            github: application.jobSeekerProfile?.github,
            portfolio: application.jobSeekerProfile?.portfolio,
            languages: application.jobSeekerProfile?.languages || [],
            certifications: application.jobSeekerProfile?.certifications || [],
          };
          setApplicant(applicantDetail);
        }
      }
    } catch (error) {
      console.error("Error fetching applicant detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async () => {
    if (!newStatus || !applicant) return;

    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // Find the application ID first
      const appsResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (appsResponse.ok) {
        const data = await appsResponse.json();
        const applications = data.data || [];
        const application = applications.find(
          (app: any) => app.jobSeekerProfile?.user?.id === applicantId
        );

        if (application) {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
            }/applications/${application.id}/status`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: newStatus,
                notes: statusUpdateNotes,
              }),
            }
          );

          if (response.ok) {
            setApplicant({ ...applicant, status: newStatus as any });
            setNewStatus("");
            setStatusUpdateNotes("");
          }
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const scheduleInterview = async () => {
    if (!interviewDate || !applicant) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // Find the application ID first
      const appsResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (appsResponse.ok) {
        const data = await appsResponse.json();
        const applications = data.data || [];
        const application = applications.find(
          (app: any) => app.jobSeekerProfile?.user?.id === applicantId
        );

        if (application) {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
            }/applications/${application.id}/interview`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                interviewDate: interviewDate,
                notes: interviewNotes,
              }),
            }
          );

          if (response.ok) {
            setApplicant({ ...applicant, status: "interviewed" });
            setShowInterviewDialog(false);
            setInterviewDate("");
            setInterviewNotes("");
          }
        }
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Chờ duyệt",
        color: "bg-yellow-100 text-yellow-700",
        icon: Clock,
      },
      reviewing: {
        label: "Đang xem xét",
        color: "bg-blue-100 text-blue-700",
        icon: Eye,
      },
      shortlisted: {
        label: "Ứng viên tiềm năng",
        color: "bg-purple-100 text-purple-700",
        icon: Star,
      },
      interviewed: {
        label: "Đã phỏng vấn",
        color: "bg-indigo-100 text-indigo-700",
        icon: MessageSquare,
      },
      accepted: {
        label: "Đã chấp nhận",
        color: "bg-green-100 text-green-700",
        icon: CheckCircle,
      },
      rejected: {
        label: "Đã từ chối",
        color: "bg-red-100 text-red-700",
        icon: XCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin ứng viên...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy thông tin ứng viên
            </h3>
            <Link href="/dashboard/employer/applicants">
              <Button className="mt-4 bg-[#f26b38] hover:bg-[#e05a27]">
                Quay lại danh sách
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/employer/applicants">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Chi tiết ứng viên</h1>
              <p className="text-gray-600 mt-1">
                Xem hồ sơ và quản lý trạng thái ứng tuyển
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card className="p-6">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-xl font-bold text-[#f26b38]">
                    {applicant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{applicant.name}</h2>
                      {getStatusBadge(applicant.status)}
                    </div>
                    <p className="text-gray-600 mb-3">
                      Ứng tuyển vị trí:{" "}
                      <span className="font-medium">{applicant.jobTitle}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{applicant.email}</span>
                      </div>
                      {applicant.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{applicant.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Ứng tuyển: {applicant.appliedDate}</span>
                      </div>
                      {applicant.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{applicant.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Cover Letter */}
              {applicant.coverLetter && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Thư xin việc
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {applicant.coverLetter}
                    </p>
                  </div>
                </Card>
              )}

              {/* Experience */}
              {applicant.experience && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Kinh nghiệm
                  </h3>
                  <p className="text-gray-700">{applicant.experience}</p>
                </Card>
              )}

              {/* Education */}
              {applicant.education && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Học vấn
                  </h3>
                  <p className="text-gray-700">{applicant.education}</p>
                </Card>
              )}

              {/* Skills */}
              {applicant.skills && applicant.skills.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Kỹ năng</h3>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Languages */}
              {applicant.languages && applicant.languages.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Ngôn ngữ</h3>
                  <div className="flex flex-wrap gap-2">
                    {applicant.languages.map((language, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1"
                      >
                        {language}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Certifications */}
              {applicant.certifications &&
                applicant.certifications.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Chứng chỉ
                    </h3>
                    <ul className="space-y-2">
                      {applicant.certifications.map((cert, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <Award className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Hành động</h3>
                <div className="space-y-3">
                  {/* Quick Status Actions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Cập nhật trạng thái nhanh
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewStatus("reviewing")}
                        className="text-xs"
                      >
                        Đang xem xét
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewStatus("shortlisted")}
                        className="text-xs"
                      >
                        Ứng viên tiềm năng
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewStatus("accepted")}
                        className="text-xs text-green-600 border-green-600"
                      >
                        Chấp nhận
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewStatus("rejected")}
                        className="text-xs text-red-600 border-red-600"
                      >
                        Từ chối
                      </Button>
                    </div>
                  </div>

                  {newStatus && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Ghi chú (tùy chọn)"
                        value={statusUpdateNotes}
                        onChange={(e) => setStatusUpdateNotes(e.target.value)}
                        className="text-sm"
                        rows={3}
                      />
                      <Button
                        onClick={updateApplicationStatus}
                        disabled={isUpdatingStatus}
                        className="w-full bg-[#f26b38] hover:bg-[#e05a27] text-sm"
                      >
                        {isUpdatingStatus
                          ? "Đang cập nhật..."
                          : `Cập nhật thành ${newStatus}`}
                      </Button>
                    </div>
                  )}

                  {/* Other Actions */}
                  <div className="pt-4 border-t space-y-2">
                    <Button variant="outline" className="w-full text-sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Gửi tin nhắn
                    </Button>

                    {applicant.resumeUrl && (
                      <Button variant="outline" className="w-full text-sm">
                        <Download className="h-4 w-4 mr-2" />
                        Tải CV
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              {(applicant.linkedin ||
                applicant.github ||
                applicant.portfolio) && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
                  <div className="space-y-3">
                    {applicant.linkedin && (
                      <a
                        href={applicant.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                    {applicant.github && (
                      <a
                        href={applicant.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                      >
                        <ExternalLink className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                    {applicant.portfolio && (
                      <a
                        href={applicant.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Portfolio
                      </a>
                    )}
                  </div>
                </Card>
              )}

              {/* Application Timeline */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Lịch sử ứng tuyển
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã ứng tuyển</p>
                      <p className="text-gray-600">{applicant.appliedDate}</p>
                    </div>
                  </div>
                  {applicant.lastActivity && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-medium">Hoạt động cuối</p>
                        <p className="text-gray-600">
                          {applicant.lastActivity}
                        </p>
                      </div>
                    </div>
                  )}
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
