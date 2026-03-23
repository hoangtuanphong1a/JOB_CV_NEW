"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  ArrowLeft,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  Download,
  Star,
  StarOff,
} from "lucide-react";

interface Applicant {
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
  skills?: string[];
  rating?: number;
  lastActivity?: string;
}

export default function EmployerApplicantsPage() {
  const router = useRouter();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    filterAndSortApplicants();
  }, [applicants, searchQuery, statusFilter, jobFilter, sortBy]);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

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
        const applicantsData = data.data || [];
        // Transform applications to applicant format
        const transformedApplicants = applicantsData.map((app: any) => ({
          id: app.jobSeekerProfile?.user?.id || app.id,
          name:
            `${app.jobSeekerProfile?.user?.firstName || ""} ${
              app.jobSeekerProfile?.user?.lastName || ""
            }`.trim() || "Unknown",
          email: app.jobSeekerProfile?.email || "",
          phone: app.jobSeekerProfile?.phone || "",
          jobTitle: app.job?.title || "Unknown Job",
          jobId: app.jobId,
          appliedDate: new Date(app.createdAt).toLocaleDateString("vi-VN"),
          status: app.status,
          avatar: app.jobSeekerProfile?.user?.avatar,
          coverLetter: app.coverLetter,
          resumeUrl: app.resumeUrl,
          experience: app.jobSeekerProfile?.experience,
          skills: app.jobSeekerProfile?.skills?.map((s: any) => s.name) || [],
          rating: app.rating || 0,
          lastActivity: app.updatedAt
            ? new Date(app.updatedAt).toLocaleDateString("vi-VN")
            : null,
        }));
        setApplicants(transformedApplicants);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortApplicants = () => {
    let filtered = [...applicants];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(query) ||
          applicant.jobTitle.toLowerCase().includes(query) ||
          applicant.email.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (applicant) => applicant.status === statusFilter
      );
    }

    // Job filter
    if (jobFilter !== "all") {
      filtered = filtered.filter((applicant) => applicant.jobId === jobFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.appliedDate).getTime() -
            new Date(a.appliedDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.appliedDate).getTime() -
            new Date(b.appliedDate).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredApplicants(filtered);
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

  const getUniqueJobs = () => {
    const jobs = [
      ...new Set(applicants.map((a) => `${a.jobId}:${a.jobTitle}`)),
    ];
    return jobs.map((job) => {
      const [id, title] = job.split(":");
      return { id, title };
    });
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách ứng viên...</p>
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/employer">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Quản lý ứng viên</h1>
                <p className="text-gray-600 mt-1">
                  Xem và quản lý tất cả ứng viên đã ứng tuyển
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{applicants.length}</div>
                  <div className="text-sm text-gray-600">Tổng ứng viên</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {applicants.filter((a) => a.status === "pending").length}
                  </div>
                  <div className="text-sm text-gray-600">Chờ duyệt</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {
                      applicants.filter((a) => a.status === "shortlisted")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">
                    Ứng viên tiềm năng
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {applicants.filter((a) => a.status === "accepted").length}
                  </div>
                  <div className="text-sm text-gray-600">Đã chấp nhận</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm ứng viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="reviewing">Đang xem xét</SelectItem>
                  <SelectItem value="shortlisted">
                    Ứng viên tiềm năng
                  </SelectItem>
                  <SelectItem value="interviewed">Đã phỏng vấn</SelectItem>
                  <SelectItem value="accepted">Đã chấp nhận</SelectItem>
                  <SelectItem value="rejected">Đã từ chối</SelectItem>
                </SelectContent>
              </Select>
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Vị trí công việc" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vị trí</SelectItem>
                  {getUniqueJobs().map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value: any) => setSortBy(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="name">Theo tên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Applicants List */}
          <div className="space-y-4">
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((applicant) => (
                <Card
                  key={applicant.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-sm font-medium text-[#f26b38]">
                        {applicant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {applicant.name}
                          </h3>
                          {getStatusBadge(applicant.status)}
                        </div>
                        <p className="text-gray-600 mb-2">
                          Ứng tuyển:{" "}
                          <span className="font-medium">
                            {applicant.jobTitle}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{applicant.email}</span>
                          </div>
                          {applicant.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{applicant.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Ứng tuyển: {applicant.appliedDate}</span>
                          </div>
                        </div>
                        {applicant.skills && applicant.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {applicant.skills
                              .slice(0, 3)
                              .map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {applicant.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{applicant.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        {applicant.coverLetter && (
                          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                            {applicant.coverLetter}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/employer/applicants/${applicant.id}`}
                      >
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy ứng viên nào
                </h3>
                <p className="text-gray-600">
                  Thử điều chỉnh bộ lọc hoặc kiểm tra lại sau.
                </p>
              </div>
            )}
          </div>

          {/* Pagination would go here */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
