"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Plus,
  Edit,
  Download,
  Trash2,
  Eye,
  Star,
  Calendar,
  Home,
  Upload,
  CheckCircle,
  AlertCircle,
  Copy,
  Share
} from "lucide-react";
import Link from "next/link";

interface CV {
  id: string;
  title: string;
  template: string;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  status: 'draft' | 'published' | 'archived';
  views: number;
  downloads: number;
  completion: number;
}

export default function CVManagementPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cvs, setCvs] = useState<CV[]>([]);

  // Mock CV data
  const mockCVs: CV[] = [
    {
      id: "1",
      title: "CV Frontend Developer",
      template: "Modern Tech",
      createdAt: "2024-11-20",
      updatedAt: "2024-11-25",
      isDefault: true,
      status: "published",
      views: 45,
      downloads: 12,
      completion: 95
    },
    {
      id: "2",
      title: "CV Fullstack Developer",
      template: "Professional Blue",
      createdAt: "2024-11-15",
      updatedAt: "2024-11-22",
      isDefault: false,
      status: "published",
      views: 28,
      downloads: 8,
      completion: 88
    },
    {
      id: "3",
      title: "CV Fresher IT",
      template: "Clean Minimal",
      createdAt: "2024-11-10",
      updatedAt: "2024-11-18",
      isDefault: false,
      status: "draft",
      views: 0,
      downloads: 0,
      completion: 65
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
      setCvs(mockCVs);
    } catch (error) {
      console.error('Error loading CVs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCV = () => {
    router.push('/cv-builder');
  };

  const handleEditCV = (cvId: string) => {
    router.push(`/cv-builder?id=${cvId}`);
  };

  const handleViewCV = (cvId: string) => {
    router.push(`/cv-preview?id=${cvId}`);
  };

  const handleDownloadCV = (cvId: string) => {
    // In a real app, this would trigger download
    console.log('Downloading CV:', cvId);
    alert('CV đã được tải xuống!');
  };

  const handleDeleteCV = (cvId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa CV này?')) {
      setCvs(prev => prev.filter(cv => cv.id !== cvId));
      console.log('Deleted CV:', cvId);
    }
  };

  const handleSetDefault = (cvId: string) => {
    setCvs(prev =>
      prev.map(cv => ({
        ...cv,
        isDefault: cv.id === cvId
      }))
    );
    console.log('Set as default CV:', cvId);
  };

  const handleDuplicateCV = (cvId: string) => {
    const originalCV = cvs.find(cv => cv.id === cvId);
    if (originalCV) {
      const newCV: CV = {
        ...originalCV,
        id: Date.now().toString(),
        title: `${originalCV.title} (Copy)`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        isDefault: false,
        status: 'draft',
        views: 0,
        downloads: 0
      };
      setCvs(prev => [newCV, ...prev]);
      console.log('Duplicated CV:', cvId);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Đã xuất bản', color: 'bg-green-100 text-green-700' },
      draft: { label: 'Bản nháp', color: 'bg-yellow-100 text-yellow-700' },
      archived: { label: 'Đã lưu trữ', color: 'bg-gray-100 text-gray-700' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const publishedCount = cvs.filter(cv => cv.status === 'published').length;
  const totalViews = cvs.reduce((sum, cv) => sum + cv.views, 0);
  const totalDownloads = cvs.reduce((sum, cv) => sum + cv.downloads, 0);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách CV...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Quản lý CV</h1>
              <p className="text-gray-600 mt-1">Tạo và quản lý hồ sơ CV chuyên nghiệp của bạn</p>
            </div>
            <Button onClick={handleCreateCV} className="bg-[#f26b38] hover:bg-[#e05a27]">
              <Plus className="h-4 w-4 mr-2" />
              Tạo CV mới
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-[#f26b38]">{cvs.length}</div>
              <div className="text-sm text-gray-600">Tổng CV</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
              <div className="text-sm text-gray-600">Đã xuất bản</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalViews}</div>
              <div className="text-sm text-gray-600">Lượt xem</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{totalDownloads}</div>
              <div className="text-sm text-gray-600">Lượt tải</div>
            </Card>
          </div>

          {/* CV List */}
          {cvs.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có CV nào</h3>
              <p className="text-gray-600 mb-6">Hãy tạo CV đầu tiên để bắt đầu hành trình tìm việc của bạn.</p>
              <Button onClick={handleCreateCV} className="bg-[#f26b38] hover:bg-[#e05a27]">
                <Plus className="h-4 w-4 mr-2" />
                Tạo CV đầu tiên
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <Card key={cv.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <FileText className="h-6 w-6 text-[#f26b38]" />
                      </div>
                      <div>
                        {cv.isDefault && (
                          <Badge className="bg-green-100 text-green-700 text-xs mb-1">
                            <Star className="h-3 w-3 mr-1" />
                            Mặc định
                          </Badge>
                        )}
                        <h3 className="font-semibold text-gray-900">{cv.title}</h3>
                        <p className="text-sm text-gray-600">{cv.template}</p>
                      </div>
                    </div>
                    {getStatusBadge(cv.status)}
                  </div>

                  {/* Completion Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Độ hoàn thiện</span>
                      <span className="text-[#f26b38] font-medium">{cv.completion}%</span>
                    </div>
                    <Progress value={cv.completion} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{cv.views} lượt xem</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{cv.downloads} lượt tải</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-500 mb-4">
                    <div>Tạo: {cv.createdAt}</div>
                    <div>Cập nhật: {cv.updatedAt}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCV(cv.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCV(cv.id)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadCV(cv.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* More Actions */}
                  <div className="flex gap-2 mt-2">
                    {!cv.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(cv.id)}
                        className="text-blue-600 hover:text-blue-700 flex-1"
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Đặt mặc định
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateCV(cv.id)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCV(cv.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Tips Section */}
          <Card className="p-6 mt-8 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Mẹo quản lý CV hiệu quả</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Tạo CV riêng cho từng loại công việc để tăng tỷ lệ thành công</li>
              <li>• Đặt CV mặc định là phiên bản tốt nhất để ứng tuyển nhanh</li>
              <li>• Cập nhật CV thường xuyên với kinh nghiệm và kỹ năng mới</li>
              <li>• Sử dụng template phù hợp với ngành nghề bạn ứng tuyển</li>
              <li>• Đặt tiêu đề CV rõ ràng và thu hút nhà tuyển dụng</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
