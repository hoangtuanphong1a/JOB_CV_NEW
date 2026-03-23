"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Building2,
  Trash2,
  Home,
  Search
} from "lucide-react";
import Link from "next/link";

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  level: string;
  tags: string[];
  posted: string;
  savedDate: string;
  description: string;
}

export default function SavedJobsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  // Mock saved jobs data
  const mockSavedJobs: SavedJob[] = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "Tech Solutions Vietnam",
      location: "Hà Nội",
      salary: "25-35 triệu",
      type: "Full-time",
      level: "Senior",
      tags: ["ReactJS", "TypeScript", "TailwindCSS"],
      posted: "2 giờ trước",
      savedDate: "2024-11-25",
      description: "Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm với ReactJS và TypeScript để tham gia vào dự án thương mại điện tử lớn."
    },
    {
      id: "2",
      title: "UI/UX Designer",
      company: "Creative Studio",
      location: "Hồ Chí Minh",
      salary: "15-25 triệu",
      type: "Full-time",
      level: "Middle",
      tags: ["Figma", "Adobe XD", "Sketch"],
      posted: "5 giờ trước",
      savedDate: "2024-11-24",
      description: "Vị trí UI/UX Designer với 2+ năm kinh nghiệm, thành thạo các công cụ thiết kế hiện đại."
    },
    {
      id: "3",
      title: "Product Manager",
      company: "E-commerce Giant",
      location: "Hà Nội",
      salary: "30-45 triệu",
      type: "Full-time",
      level: "Senior",
      tags: ["Agile", "Scrum", "Product Strategy"],
      posted: "1 ngày trước",
      savedDate: "2024-11-23",
      description: "Product Manager với kinh nghiệm quản lý sản phẩm trong lĩnh vực thương mại điện tử."
    }
  ];

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      // In a real app, this would fetch from API
      // For now, use mock data
      setSavedJobs(mockSavedJobs);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSavedJob = (jobId: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    // In a real app, this would make an API call to remove from saved jobs
    console.log('Removed job from saved:', jobId);
  };

  const handleApplyToJob = (jobId: string) => {
    router.push(`/jobs/jobdetail?id=${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách việc làm đã lưu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Việc làm đã lưu</h1>
              <p className="text-gray-600 mt-1">Danh sách các công việc bạn đã đánh dấu để ứng tuyển sau</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-[#f26b38]">{savedJobs.length}</div>
              <div className="text-sm text-gray-600">Việc làm đã lưu</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">Đã ứng tuyển</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{savedJobs.length - 2}</div>
              <div className="text-sm text-gray-600">Chưa ứng tuyển</div>
            </Card>
          </div>

          {/* Saved Jobs List */}
          {savedJobs.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có việc làm nào được lưu</h3>
              <p className="text-gray-600 mb-6">Hãy khám phá và lưu các công việc bạn quan tâm để ứng tuyển sau.</p>
              <Link href="/jobs">
                <Button className="bg-[#f26b38] hover:bg-[#e05a27]">
                  <Search className="h-4 w-4 mr-2" />
                  Tìm việc làm ngay
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-orange-600" />
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-[#f26b38] cursor-pointer transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSavedJob(job.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Job Meta */}
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>Đã lưu {job.savedDate}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApplyToJob(job.id)}
                          >
                            Ứng tuyển ngay
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Tips Section */}
          {savedJobs.length > 0 && (
            <Card className="p-6 mt-8 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Mẹo quản lý việc làm đã lưu</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Ứng tuyển sớm để tăng cơ hội thành công</li>
                <li>• Theo dõi trạng thái đơn ứng tuyển thường xuyên</li>
                <li>• Chuẩn bị CV và thư xin việc cho từng vị trí</li>
                <li>• Liên hệ nhà tuyển dụng nếu cần thêm thông tin</li>
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
