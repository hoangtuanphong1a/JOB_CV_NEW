"use client";

import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  Send,
  Building2,
  MapPin,
  DollarSign,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface JobDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function JobApplyPage({ params }: JobDetailPageProps) {
  const router = useRouter();
  const unwrappedParams = use(params); // Unwrap the params Promise
  const urlParams = useParams(); // Get params for client component
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [jobData, setJobData] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  interface Job {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
      logo?: string;
    };
    salary?: {
      min: number;
      max: number;
      currency: string;
    };
    location: string;
    type: string;
  }

  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    resume: null as File | null,
    source: "website"
  });

  // Mock job data - in real app, fetch from API based on slug
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        // Try to get job data from API
        const token = localStorage.getItem('access_token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/jobs/${urlParams.slug}`, {
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          setJobData(data);
        } else {
          // Fallback to mock data
          setJobData({
            id: unwrappedParams.slug,
            title: "Senior Frontend Developer",
            company: {
              id: "1",
              name: "TechCorp Vietnam",
              logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=80&h=80&fit=crop&crop=center",
            },
            salary: {
              min: 25000000,
              max: 40000000,
              currency: "VNĐ"
            },
            location: "TP.HCM",
            type: "Toàn thời gian"
          });
        }
      } catch (error) {
        // Fallback to mock data
        setJobData({
          id: unwrappedParams.slug,
          title: "Senior Frontend Developer",
          company: {
            id: "1",
            name: "TechCorp Vietnam",
            logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=80&h=80&fit=crop&crop=center",
          },
          salary: {
            min: 25000000,
            max: 40000000,
            currency: "VNĐ"
          },
          location: "TP.HCM",
          type: "Toàn thời gian"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [urlParams.slug]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file PDF, DOC, hoặc DOCX');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File không được vượt quá 5MB');
        return;
      }

      setApplicationData({ ...applicationData, resume: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate that we have a job ID
      const jobId = jobData?.id || urlParams.slug;
      if (!jobId || jobId === 'undefined') {
        alert('Không thể xác định vị trí công việc. Vui lòng thử lại.');
        return;
      }

      // Get token for authentication
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Vui lòng đăng nhập để ứng tuyển');
        router.push('/auth/login');
        return;
      }

      // Prepare JSON data (backend doesn't handle FormData for applications)
      const applicationPayload = {
        jobId: jobId,
        coverLetter: applicationData.coverLetter,
        source: applicationData.source,
        // resumeUrl will be handled separately if needed
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationPayload),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || 'Không thể gửi đơn ứng tuyển'}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Ứng tuyển thành công!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Đơn ứng tuyển của bạn đã được gửi đến <strong>{jobData?.company?.name}</strong> cho vị trí <strong>{jobData?.title}</strong>.
            </p>
            <div className="space-y-4">
              <p className="text-gray-600">
                Nhà tuyển dụng sẽ xem xét hồ sơ của bạn và liên hệ nếu bạn phù hợp với vị trí.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push('/jobs')}>
                  Tìm việc làm khác
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  Xem dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </div>

          {/* Job Summary */}
          <div className="flex items-start gap-4">
            <img
              src={jobData?.company?.logo || "https://images.unsplash.com/photo-1549924231-f129b911e442?w=60&h=60&fit=crop&crop=center"}
              alt={jobData?.company?.name}
              className="w-12 h-12 rounded-lg border flex-shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Ứng tuyển: {jobData?.title || "Vị trí công việc"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {jobData?.company?.name || "Công ty"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {jobData?.location || "Vị trí"}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {jobData?.salary ? `${(jobData.salary.min / 1000000).toFixed(0)}-${(jobData.salary.max / 1000000).toFixed(0)} triệu` : "Lương thương lượng"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {jobData?.type || "Loại công việc"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Thông tin ứng tuyển
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thư xin việc *
                    </label>
                    <Textarea
                      required
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                      placeholder="Giới thiệu về bản thân, kinh nghiệm, kỹ năng và lý do bạn muốn ứng tuyển vị trí này..."
                      rows={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Viết một lá thư xin việc hấp dẫn sẽ tăng cơ hội được nhà tuyển dụng chú ý
                    </p>
                  </div>

                  {/* Note about profile information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Thông tin cá nhân từ hồ sơ của bạn</p>
                        <p>Thông tin cá nhân (tên, email, số điện thoại) sẽ được lấy từ hồ sơ job seeker của bạn. Bạn có thể cập nhật thông tin này trong phần cài đặt tài khoản.</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={isSubmitting || loading || !jobData}
                      className="w-full bg-[#f26b38] hover:bg-[#e05a27] h-12 text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Gửi đơn ứng tuyển
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Bằng việc gửi đơn ứng tuyển, bạn đồng ý với{" "}
                      <Link href="/terms" className="text-[#f26b38] hover:underline">
                        Điều khoản sử dụng
                      </Link>{" "}
                      và{" "}
                      <Link href="/privacy" className="text-[#f26b38] hover:underline">
                        Chính sách bảo mật
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt công việc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vị trí:</span>
                  <span className="font-medium">{jobData?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Công ty:</span>
                  <span className="font-medium">{jobData?.company?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa điểm:</span>
                  <span className="font-medium">{jobData?.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mức lương:</span>
                  <span className="font-medium text-green-600">
                    {jobData?.salary ? `${(jobData.salary.min / 1000000).toFixed(0)}-${(jobData.salary.max / 1000000).toFixed(0)} triệu` : "Thương lượng"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Application Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Mẹo ứng tuyển</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">
                    CV nên được tối ưu hóa cho vị trí ứng tuyển
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">
                    Thư xin việc nên nêu bật kinh nghiệm liên quan
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">
                    Kiểm tra lại thông tin trước khi gửi
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Câu hỏi thường gặp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Tôi có thể ứng tuyển nhiều vị trí không?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Có, bạn có thể ứng tuyển nhiều vị trí khác nhau.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Khi nào tôi sẽ nhận được phản hồi?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Thông thường trong vòng 1-2 tuần làm việc.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
