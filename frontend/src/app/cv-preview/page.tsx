"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Edit,
  Share,
  ArrowLeft,
  Home,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Eye,
  FileText
} from "lucide-react";
import Link from "next/link";

interface CVData {
  id: string;
  title: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    avatar?: string;
  };
  experience: Array<{
    id: string;
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number; // 1-5
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    level: string; // Native, Fluent, Intermediate, Basic
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
}

function CVPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cvId = searchParams.get('id');

  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock CV data
  const mockCVData: CVData = {
    id: "1",
    title: "Frontend Developer CV",
    personalInfo: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "+84 123 456 789",
      location: "Hà Nội, Việt Nam",
      bio: "Frontend Developer với 3+ năm kinh nghiệm phát triển ứng dụng web hiện đại. Thành thạo React, TypeScript và các công nghệ frontend tiên tiến.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    experience: [
      {
        id: "1",
        position: "Senior Frontend Developer",
        company: "Tech Solutions Vietnam",
        location: "Hà Nội",
        startDate: "2022-01",
        endDate: "2024-11",
        description: "Phát triển và duy trì các ứng dụng web lớn sử dụng React, TypeScript. Lãnh đạo team 5 developers, implement CI/CD pipeline.",
        current: true
      },
      {
        id: "2",
        position: "Frontend Developer",
        company: "Digital Agency Pro",
        location: "Hồ Chí Minh",
        startDate: "2020-06",
        endDate: "2021-12",
        description: "Xây dựng giao diện responsive cho các dự án e-commerce. Tối ưu performance và SEO.",
        current: false
      }
    ],
    education: [
      {
        id: "1",
        degree: "Kỹ sư Công nghệ Thông tin",
        school: "Đại học Bách khoa Hà Nội",
        location: "Hà Nội",
        startDate: "2016-09",
        endDate: "2020-06",
        description: "Tốt nghiệp loại Giỏi. Chuyên ngành Kỹ thuật Phần mềm."
      }
    ],
    skills: [
      { id: "1", name: "React", level: 5 },
      { id: "2", name: "TypeScript", level: 5 },
      { id: "3", name: "JavaScript", level: 5 },
      { id: "4", name: "Next.js", level: 4 },
      { id: "5", name: "Node.js", level: 4 },
      { id: "6", name: "CSS/SCSS", level: 4 },
      { id: "7", name: "Git", level: 4 },
      { id: "8", name: "AWS", level: 3 }
    ],
    projects: [
      {
        id: "1",
        name: "E-commerce Platform",
        description: "Nền tảng thương mại điện tử với hàng triệu người dùng. Phát triển frontend sử dụng React và TypeScript.",
        technologies: ["React", "TypeScript", "Redux", "Styled Components"],
        link: "https://example.com"
      },
      {
        id: "2",
        name: "Task Management App",
        description: "Ứng dụng quản lý công việc với real-time collaboration. Sử dụng WebSocket và React.",
        technologies: ["React", "Socket.io", "Express", "MongoDB"],
        link: "https://example.com"
      }
    ],
    languages: [
      { id: "1", name: "Tiếng Việt", level: "Native" },
      { id: "2", name: "Tiếng Anh", level: "Fluent" },
      { id: "3", name: "Tiếng Nhật", level: "Intermediate" }
    ],
    certifications: [
      {
        id: "1",
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023-05",
        expiryDate: "2026-05"
      },
      {
        id: "2",
        name: "React Developer Certification",
        issuer: "Meta",
        date: "2022-08",
        expiryDate: "2025-08"
      }
    ]
  };

  useEffect(() => {
    checkAuthAndLoadCV();
  }, [cvId]);

  const checkAuthAndLoadCV = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      // In a real app, fetch CV data from API
      // For now, use mock data
      setCvData(mockCVData);
    } catch (error) {
      console.error('Error loading CV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    // In a real app, this would generate and download PDF
    alert('CV đã được tải xuống dưới dạng PDF!');
  };

  const handleEdit = () => {
    router.push(`/cv-builder?id=${cvId}`);
  };

  const handleShare = () => {
    // In a real app, this would generate a shareable link
    const shareUrl = `${window.location.origin}/cv-public?id=${cvId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link chia sẻ đã được sao chép vào clipboard!');
  };

  const getSkillLevelLabel = (level: number) => {
    const labels = ['Cơ bản', 'Trung cấp', 'Khá', 'Giỏi', 'Chuyên gia'];
    return labels[level - 1] || 'Không xác định';
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải CV...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <Card className="p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy CV</h3>
            <p className="text-gray-600 mb-6">CV này có thể đã bị xóa hoặc bạn không có quyền truy cập.</p>
            <Link href="/cv-management">
              <Button className="bg-[#f26b38] hover:bg-[#e05a27]">
                Quay lại quản lý CV
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="text-[#f26b38] border-[#f26b38] hover:bg-[#f26b38] hover:text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Trang chủ
                </Button>
              </Link>
              <Link href="/cv-management">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Button onClick={handleDownload} className="bg-[#f26b38] hover:bg-[#e05a27]">
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* CV Preview */}
          <Card className="p-8 bg-white shadow-lg">
            {/* Personal Information */}
            <div className="border-b pb-8 mb-8">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                  {cvData.personalInfo.avatar ? (
                    <img
                      src={cvData.personalInfo.avatar}
                      alt={cvData.personalInfo.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-[#f26b38]">
                      {cvData.personalInfo.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{cvData.personalInfo.name}</h1>
                  <h2 className="text-xl text-[#f26b38] font-semibold mb-4">{cvData.title}</h2>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{cvData.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{cvData.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{cvData.personalInfo.location}</span>
                    </div>
                  </div>
                  {cvData.personalInfo.bio && (
                    <p className="mt-4 text-gray-700 leading-relaxed">{cvData.personalInfo.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Experience */}
            {cvData.experience.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#f26b38]" />
                  Kinh nghiệm làm việc
                </h3>
                <div className="space-y-6">
                  {cvData.experience.map((exp) => (
                    <div key={exp.id} className="border-l-4 border-[#f26b38] pl-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                          <p className="text-[#f26b38] font-medium">{exp.company}</p>
                          <p className="text-gray-600 text-sm">{exp.location}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {exp.startDate} - {exp.current ? 'Hiện tại' : exp.endDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cvData.education.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-[#f26b38]" />
                  Học vấn
                </h3>
                <div className="space-y-4">
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="border-l-4 border-green-500 pl-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                          <p className="text-green-600 font-medium">{edu.school}</p>
                          <p className="text-gray-600 text-sm">{edu.location}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          {edu.startDate} - {edu.endDate}
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Kỹ năng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cvData.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-3 h-3 rounded-full ${
                                level <= skill.level ? 'bg-[#f26b38]' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{getSkillLevelLabel(skill.level)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {cvData.projects.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#f26b38]" />
                  Dự án
                </h3>
                <div className="grid gap-6">
                  {cvData.projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h4>
                      <p className="text-gray-700 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f26b38] hover:underline text-sm"
                        >
                          Xem dự án →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages & Certifications */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Languages */}
              {cvData.languages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ngôn ngữ</h3>
                  <div className="space-y-3">
                    {cvData.languages.map((lang) => (
                      <div key={lang.id} className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{lang.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {lang.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {cvData.certifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#f26b38]" />
                    Chứng chỉ
                  </h3>
                  <div className="space-y-4">
                    {cvData.certifications.map((cert) => (
                      <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{cert.name}</h4>
                        <p className="text-[#f26b38] text-sm mb-2">{cert.issuer}</p>
                        <div className="text-xs text-gray-600">
                          <div>Ngày cấp: {cert.date}</div>
                          {cert.expiryDate && <div>Hết hạn: {cert.expiryDate}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CVPreviewPage() {
  return (
    <Suspense fallback={
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    }>
      <CVPreviewContent />
    </Suspense>
  );
}
