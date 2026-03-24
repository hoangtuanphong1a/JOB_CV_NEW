"use client";

import React, { useState, useEffect } from "react";
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
  FileText,
  Plus,
  Trash2,
  Save,
  User,
  Building,
  Book,
  Code,
  Globe,
  Users,
} from "lucide-react";
import Link from "next/link";

interface CVTemplate {
  id: string;
  name: string;
  category: "professional" | "modern" | "creative";
  rating: number;
  thumbnail: string;
  isFree: boolean;
  previewUrl: string;
  downloadUrl: string;
}

interface CVData {
  id: string;
  title: string;
  templateId: string;
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

function CVTemplatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");

  const [template, setTemplate] = useState<CVTemplate | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock template data
  const mockTemplate: CVTemplate = {
    id: templateId || "1",
    name: "Mẫu CV Chuyên Nghiệp #1",
    category: "professional",
    rating: 4.8,
    thumbnail:
      "https://www.topcv.vn/cv/snapshot/template-cv/mau-cv-an-tuong-6-_VlJVBQcNCQgBBVdWAgMCVQFTUAYPVgBUCVNRAQb0f5.webp?t=1756435041&color=574040&template_name=impressive_6_v2&lang=vi",
    isFree: true,
    previewUrl: `/cv-preview?id=${templateId}`,
    downloadUrl: `/download/cv-template-${templateId}`,
  };

  // Mock CV data with templateId
  const mockCVData: CVData = {
    id: "new-cv",
    title: "CV Mới Tạo",
    templateId: templateId || "1",
    personalInfo: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "+84 123 456 789",
      location: "Hà Nội, Việt Nam",
      bio: "Chuyên viên phát triển phần mềm với 3+ năm kinh nghiệm...",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    experience: [
      {
        id: "1",
        position: "Frontend Developer",
        company: "Tech Company",
        location: "Hà Nội",
        startDate: "2022-01",
        endDate: "2024-11",
        description: "Phát triển ứng dụng web sử dụng React và TypeScript...",
        current: true,
      },
    ],
    education: [
      {
        id: "1",
        degree: "Kỹ sư Công nghệ Thông tin",
        school: "Đại học Bách khoa Hà Nội",
        location: "Hà Nội",
        startDate: "2016-09",
        endDate: "2020-06",
        description: "Tốt nghiệp loại Giỏi",
      },
    ],
    skills: [
      { id: "1", name: "React", level: 5 },
      { id: "2", name: "TypeScript", level: 4 },
      { id: "3", name: "JavaScript", level: 5 },
    ],
    projects: [
      {
        id: "1",
        name: "E-commerce Platform",
        description: "Nền tảng thương mại điện tử...",
        technologies: ["React", "TypeScript", "Node.js"],
        link: "https://example.com",
      },
    ],
    languages: [
      { id: "1", name: "Tiếng Việt", level: "Native" },
      { id: "2", name: "Tiếng Anh", level: "Fluent" },
    ],
    certifications: [
      {
        id: "1",
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023-05",
        expiryDate: "2026-05",
      },
    ],
  };

  useEffect(() => {
    checkAuthAndLoadData();
  }, [templateId]);

  const checkAuthAndLoadData = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      setTemplate(mockTemplate);
      setCvData(mockCVData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real app, save to database
    setIsEditing(false);
    alert("CV đã được lưu thành công!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setCvData(mockCVData);
  };

  const handleDownload = () => {
    // In a real app, generate and download PDF
    alert("CV đã được tải xuống dưới dạng PDF!");
  };

  const handlePreview = () => {
    router.push(`/cv-preview?id=${cvData?.id}`);
  };

  const handleInputChange = (
    section: keyof CVData,
    field: string,
    value: string | boolean,
  ) => {
    if (!cvData) return;

    setCvData({
      ...cvData,
      [section]: {
        ...(cvData[section] as any),
        [field]: value,
      },
    });
  };

  const handleArrayItemChange = (
    section: keyof CVData,
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    if (!cvData) return;

    const currentArray = cvData[section] as any[];
    const newArray = [...currentArray];
    newArray[index] = {
      ...newArray[index],
      [field]: value,
    };

    setCvData({
      ...cvData,
      [section]: newArray,
    });
  };

  const handleAddItem = (section: keyof CVData) => {
    if (!cvData) return;

    const newItem = getEmptyItem(section);
    const currentArray = cvData[section] as any[];
    setCvData({
      ...cvData,
      [section]: [...currentArray, newItem],
    });
  };

  const handleRemoveItem = (section: keyof CVData, index: number) => {
    if (!cvData) return;

    const currentArray = cvData[section] as any[];
    const newArray = [...currentArray];
    newArray.splice(index, 1);

    setCvData({
      ...cvData,
      [section]: newArray,
    });
  };

  const getEmptyItem = (section: string) => {
    switch (section) {
      case "experience":
        return {
          id: Date.now().toString(),
          position: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
          current: false,
        };
      case "education":
        return {
          id: Date.now().toString(),
          degree: "",
          school: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        };
      case "skills":
        return {
          id: Date.now().toString(),
          name: "",
          level: 3,
        };
      case "projects":
        return {
          id: Date.now().toString(),
          name: "",
          description: "",
          technologies: [],
          link: "",
        };
      case "languages":
        return {
          id: Date.now().toString(),
          name: "",
          level: "Intermediate",
        };
      case "certifications":
        return {
          id: Date.now().toString(),
          name: "",
          issuer: "",
          date: "",
          expiryDate: "",
        };
      default:
        return {};
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "professional":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "modern":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "creative":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "professional":
        return "Chuyên nghiệp";
      case "modern":
        return "Hiện đại";
      case "creative":
        return "Sáng tạo";
      default:
        return "Khác";
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!template || !cvData) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <Card className="p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy mẫu CV
            </h3>
            <p className="text-gray-600 mb-6">
              Mẫu CV này có thể đã bị xóa hoặc không tồn tại.
            </p>
            <Link href="/cv-builder">
              <Button className="bg-[#f26b38] hover:bg-[#e05a27]">
                Quay lại danh sách mẫu
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
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#f26b38] border-[#f26b38] hover:bg-[#f26b38] hover:text-white"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Trang chủ
                </Button>
              </Link>
              <Link href="/cv-builder">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={`${getCategoryColor(template.category)} text-xs font-medium px-2 py-1`}
              >
                {getCategoryLabel(template.category)}
              </Badge>
              {template.isFree && (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium px-2 py-1">
                  Miễn phí
                </Badge>
              )}
              <span className="text-sm text-gray-600">
                Đánh giá: {template.rating}/5
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Xem trước CV
                </h2>
                <div className="flex items-center gap-2">
                  <Button onClick={handlePreview} variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="bg-[#f26b38] hover:bg-[#e05a27]"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống
                  </Button>
                </div>
              </div>

              {/* Template Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="aspect-[3/4] bg-white rounded shadow-sm overflow-hidden">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-center text-gray-500 text-sm mt-2">
                  Đây là giao diện mẫu CV. Nội dung sẽ được điền theo thông tin
                  bạn nhập bên phải.
                </p>
              </div>
            </Card>
          </div>

          {/* Editor Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chỉnh sửa CV
                </h2>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Lưu
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Hủy
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                )}
              </div>

              {/* Personal Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#f26b38]" />
                  Thông tin cá nhân
                </h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={cvData.personalInfo.name}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "name",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                      placeholder="Họ và tên"
                    />
                    <input
                      type="email"
                      value={cvData.personalInfo.email}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "email",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                      placeholder="Email"
                    />
                    <input
                      type="tel"
                      value={cvData.personalInfo.phone}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "phone",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                      placeholder="Số điện thoại"
                    />
                    <input
                      type="text"
                      value={cvData.personalInfo.location}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "location",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                      placeholder="Địa chỉ"
                    />
                    <textarea
                      value={cvData.personalInfo.bio}
                      onChange={(e) =>
                        handleInputChange("personalInfo", "bio", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                      placeholder="Mô tả bản thân"
                      rows={4}
                    />
                  </div>
                ) : (
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Họ tên:</strong> {cvData.personalInfo.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {cvData.personalInfo.email}
                    </p>
                    <p>
                      <strong>Điện thoại:</strong> {cvData.personalInfo.phone}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {cvData.personalInfo.location}
                    </p>
                    <p>
                      <strong>Giới thiệu:</strong> {cvData.personalInfo.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#f26b38]" />
                  Kinh nghiệm làm việc
                </h3>
                {cvData.experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="border-l-4 border-[#f26b38] pl-4 mb-4"
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) =>
                            handleArrayItemChange(
                              "experience",
                              index,
                              "position",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                          placeholder="Chức danh"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            handleArrayItemChange(
                              "experience",
                              index,
                              "company",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                          placeholder="Công ty"
                        />
                        <input
                          type="text"
                          value={exp.description}
                          onChange={(e) =>
                            handleArrayItemChange(
                              "experience",
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                          placeholder="Mô tả công việc"
                        />
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) =>
                              handleArrayItemChange(
                                "experience",
                                index,
                                "startDate",
                                e.target.value,
                              )
                            }
                            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                          />
                          <input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) =>
                              handleArrayItemChange(
                                "experience",
                                index,
                                "endDate",
                                e.target.value,
                              )
                            }
                            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                          />
                        </div>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveItem("experience", index)
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-[#f26b38]">{exp.company}</p>
                        <p className="text-sm text-gray-600">
                          {exp.startDate} -{" "}
                          {exp.current ? "Hiện tại" : exp.endDate}
                        </p>
                        <p className="text-gray-700 mt-1">{exp.description}</p>
                      </div>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <Button
                    onClick={() => handleAddItem("experience")}
                    variant="outline"
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm kinh nghiệm
                  </Button>
                )}
              </div>

              {/* Education */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-[#f26b38]" />
                  Học vấn
                </h3>
                {cvData.education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="border-l-4 border-green-500 pl-4 mb-4"
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            handleArrayItemChange(
                              "education",
                              index,
                              "degree",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                          placeholder="Bằng cấp"
                        />
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) =>
                            handleArrayItemChange(
                              "education",
                              index,
                              "school",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                          placeholder="Trường học"
                        />
                        <input
                          type="text"
                          value={edu.description}
                          onChange={(e) =>
                            handleArrayItemChange(
                              "education",
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                          placeholder="Mô tả"
                        />
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) =>
                              handleArrayItemChange(
                                "education",
                                index,
                                "startDate",
                                e.target.value,
                              )
                            }
                            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                          />
                          <input
                            type="date"
                            value={edu.endDate}
                            onChange={(e) =>
                              handleArrayItemChange(
                                "education",
                                index,
                                "endDate",
                                e.target.value,
                              )
                            }
                            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f26b38]"
                          />
                        </div>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem("education", index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-green-600">{edu.school}</p>
                        <p className="text-sm text-gray-600">
                          {edu.startDate} - {edu.endDate}
                        </p>
                        <p className="text-gray-700 mt-1">{edu.description}</p>
                      </div>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <Button
                    onClick={() => handleAddItem("education")}
                    variant="outline"
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm học vấn
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CVTemplatePageWrapper() {
  return <CVTemplatePage />;
}
