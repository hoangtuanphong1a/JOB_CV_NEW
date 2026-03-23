"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Download,
  Eye,
  Plus,
  Trash2,
  Save,
  Upload,
} from "lucide-react";

interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
}

interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrent: boolean;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export default function CVBuilderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // CV Data State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false,
    },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: "1", name: "ReactJS", level: "advanced" },
    { id: "2", name: "TypeScript", level: "intermediate" },
    { id: "3", name: "Node.js", level: "intermediate" },
  ]);

  useEffect(() => {
    loadSavedCV();
  }, []);

  const loadSavedCV = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/cv/my-cv", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const cvData = await response.json();
        // Load saved data
        setPersonalInfo(cvData.personalInfo || personalInfo);
        setExperiences(cvData.experiences || experiences);
        setEducations(cvData.educations || educations);
        setSkills(cvData.skills || skills);
      }
    } catch (error) {
      console.error("Error loading saved CV:", error);
    }
  };

  const saveCV = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const cvData = {
        personalInfo,
        experiences,
        educations,
        skills,
      };

      const response = await fetch("/api/cv/save", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cvData),
      });

      if (response.ok) {
        alert("CV đã được lưu thành công!");
      } else {
        alert("Có lỗi xảy ra khi lưu CV");
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadCV = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch("/api/cv/download", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalInfo,
          experiences,
          educations,
          skills,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${personalInfo.fullName || "CV"}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert("Có lỗi xảy ra khi tải CV");
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrent: false,
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: any
  ) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        id: Date.now().toString(),
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    setEducations(
      educations.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const addSkill = () => {
    setSkills([
      ...skills,
      {
        id: Date.now().toString(),
        name: "",
        level: "beginner",
      },
    ]);
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setSkills(
      skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const getSkillLevelLabel = (level: string) => {
    const labels = {
      beginner: "Sơ cấp",
      intermediate: "Trung cấp",
      advanced: "Nâng cao",
      expert: "Chuyên gia",
    };
    return labels[level as keyof typeof labels] || level;
  };

  if (isPreviewMode) {
    return (
      <div className="bg-gray-50">
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl">Xem trước CV</h1>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewMode(false)}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  onClick={downloadCV}
                  className="bg-[#f26b38] hover:bg-[#e05a27]"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
              </div>
            </div>

            {/* CV Preview */}
            <Card className="max-w-4xl mx-auto p-8 bg-white shadow-lg">
              {/* Personal Info */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {personalInfo.fullName || "Họ và tên"}
                </h1>
                <p className="text-xl text-[#f26b38] mb-4">
                  {personalInfo.jobTitle || "Vị trí ứng tuyển"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>📧 {personalInfo.email || "email@example.com"}</div>
                  <div>📱 {personalInfo.phone || "0987654321"}</div>
                  <div className="md:col-span-2">
                    📍 {personalInfo.address || "Địa chỉ"}
                  </div>
                </div>
                {personalInfo.summary && (
                  <p className="mt-4 text-gray-700">{personalInfo.summary}</p>
                )}
              </div>

              {/* Experience */}
              {experiences.some((exp) => exp.position || exp.company) && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                    Kinh nghiệm làm việc
                  </h2>
                  <div className="space-y-4">
                    {experiences
                      .filter((exp) => exp.position || exp.company)
                      .map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {exp.position || "Vị trí"}
                              </h3>
                              <p className="text-[#f26b38]">
                                {exp.company || "Công ty"}
                              </p>
                            </div>
                            <span className="text-sm text-gray-600">
                              {exp.startDate || "Tháng/Năm"} -{" "}
                              {exp.isCurrent
                                ? "Hiện tại"
                                : exp.endDate || "Tháng/Năm"}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 text-sm">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {educations.some((edu) => edu.school || edu.degree) && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                    Học vấn
                  </h2>
                  <div className="space-y-4">
                    {educations
                      .filter((edu) => edu.school || edu.degree)
                      .map((edu) => (
                        <div key={edu.id}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {edu.degree || "Bằng cấp"} -{" "}
                                {edu.field || "Chuyên ngành"}
                              </h3>
                              <p className="text-[#f26b38]">
                                {edu.school || "Trường học"}
                              </p>
                            </div>
                            <span className="text-sm text-gray-600">
                              {edu.startDate || "Tháng/Năm"} -{" "}
                              {edu.endDate || "Tháng/Năm"}
                            </span>
                          </div>
                          {edu.description && (
                            <p className="text-gray-700 text-sm">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.some((skill) => skill.name) && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                    Kỹ năng
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter((skill) => skill.name)
                      .map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {skill.name} - {getSkillLevelLabel(skill.level)}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl mb-2">Tạo CV chuyên nghiệp</h1>
            <p className="text-lg text-gray-600">
              Xây dựng CV ấn tượng để tăng cơ hội nhận việc
            </p>
          </div>

          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* Editor Sidebar */}
            <div className="space-y-6">
              {/* Template Selector */}
              <Card className="p-6">
                <h3 className="mb-4 font-semibold">Mẫu CV</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((template) => (
                    <button
                      key={template}
                      className="aspect-[3/4] rounded-lg border-2 border-gray-200 hover:border-[#f26b38] transition-colors bg-gray-50 flex items-center justify-center"
                    >
                      <FileText className="h-8 w-8 text-gray-400" />
                    </button>
                  ))}
                </div>
              </Card>

              {/* Sections Navigation */}
              <Card className="p-6">
                <h3 className="mb-4 font-semibold">Nội dung CV</h3>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-1 h-auto gap-2">
                    <TabsTrigger
                      value="personal"
                      className="justify-start data-[state=active]:bg-[#f26b38] data-[state=active]:text-white"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Thông tin cá nhân
                    </TabsTrigger>
                    <TabsTrigger
                      value="experience"
                      className="justify-start data-[state=active]:bg-[#f26b38] data-[state=active]:text-white"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Kinh nghiệm
                    </TabsTrigger>
                    <TabsTrigger
                      value="education"
                      className="justify-start data-[state=active]:bg-[#f26b38] data-[state=active]:text-white"
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Học vấn
                    </TabsTrigger>
                    <TabsTrigger
                      value="skills"
                      className="justify-start data-[state=active]:bg-[#f26b38] data-[state=active]:text-white"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Kỹ năng
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </Card>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="bg-[#f26b38] hover:bg-[#e05a27]"
                  onClick={downloadCV}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Tải xuống CV
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsPreviewMode(true)}
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Xem trước
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={saveCV}
                  disabled={isSaving}
                >
                  <Save className="h-5 w-5 mr-2" />
                  {isSaving ? "Đang lưu..." : "Lưu CV"}
                </Button>
              </div>
            </div>

            {/* Editor Content */}
            <Card className="p-6 lg:p-8">
              <Tabs value={activeTab} className="w-full">
                {/* Personal Info */}
                <TabsContent value="personal" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-6">
                      Thông tin cá nhân
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input
                          id="fullName"
                          placeholder="Nguyễn Văn A"
                          value={personalInfo.fullName}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              fullName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Vị trí ứng tuyển</Label>
                        <Input
                          id="jobTitle"
                          placeholder="Frontend Developer"
                          value={personalInfo.jobTitle}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              jobTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={personalInfo.email}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          placeholder="0987654321"
                          value={personalInfo.phone}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                          id="address"
                          placeholder="Hà Nội, Việt Nam"
                          value={personalInfo.address}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="summary">Mục tiêu nghề nghiệp</Label>
                        <Textarea
                          id="summary"
                          placeholder="Mô tả mục tiêu và định hướng nghề nghiệp của bạn..."
                          rows={4}
                          value={personalInfo.summary}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              summary: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Experience */}
                <TabsContent value="experience" className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      Kinh nghiệm làm việc
                    </h2>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#f26b38] text-[#f26b38]"
                      onClick={addExperience}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm
                    </Button>
                  </div>

                  {experiences.map((exp, index) => (
                    <Card key={exp.id} className="p-6 bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-medium">
                          Kinh nghiệm {index + 1}
                        </h3>
                        {experiences.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => removeExperience(exp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Vị trí</Label>
                            <Input
                              placeholder="Senior Developer"
                              value={exp.position}
                              onChange={(e) =>
                                updateExperience(
                                  exp.id,
                                  "position",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Công ty</Label>
                            <Input
                              placeholder="Tech Company"
                              value={exp.company}
                              onChange={(e) =>
                                updateExperience(
                                  exp.id,
                                  "company",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Từ</Label>
                            <Input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) =>
                                updateExperience(
                                  exp.id,
                                  "startDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Đến</Label>
                            <Input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) =>
                                updateExperience(
                                  exp.id,
                                  "endDate",
                                  e.target.value
                                )
                              }
                              disabled={exp.isCurrent}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.isCurrent}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "isCurrent",
                                e.target.checked
                              )
                            }
                            className="rounded"
                          />
                          <Label
                            htmlFor={`current-${exp.id}`}
                            className="text-sm"
                          >
                            Tôi đang làm việc ở đây
                          </Label>
                        </div>
                        <div className="space-y-2">
                          <Label>Mô tả công việc</Label>
                          <Textarea
                            placeholder="Mô tả trách nhiệm và thành tích..."
                            rows={4}
                            value={exp.description}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                {/* Education */}
                <TabsContent value="education" className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Học vấn</h2>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#f26b38] text-[#f26b38]"
                      onClick={addEducation}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm
                    </Button>
                  </div>

                  {educations.map((edu, index) => (
                    <Card key={edu.id} className="p-6 bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-medium">
                          Học vấn {index + 1}
                        </h3>
                        {educations.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => removeEducation(edu.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Trường</Label>
                            <Input
                              placeholder="Đại học ABC"
                              value={edu.school}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "school",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Bằng cấp</Label>
                            <Input
                              placeholder="Cử nhân"
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "degree",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Chuyên ngành</Label>
                          <Input
                            placeholder="Công nghệ thông tin"
                            value={edu.field}
                            onChange={(e) =>
                              updateEducation(edu.id, "field", e.target.value)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Từ</Label>
                            <Input
                              type="month"
                              value={edu.startDate}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "startDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Đến</Label>
                            <Input
                              type="month"
                              value={edu.endDate}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "endDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Mô tả</Label>
                          <Textarea
                            placeholder="GPA, thành tích, hoạt động..."
                            rows={3}
                            value={edu.description}
                            onChange={(e) =>
                              updateEducation(
                                edu.id,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                {/* Skills */}
                <TabsContent value="skills" className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Kỹ năng</h2>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#f26b38] text-[#f26b38]"
                      onClick={addSkill}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm kỹ năng
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <Card key={skill.id} className="p-4 bg-gray-50">
                        <div className="flex items-center gap-4">
                          <Input
                            placeholder="Tên kỹ năng"
                            value={skill.name}
                            onChange={(e) =>
                              updateSkill(skill.id, "name", e.target.value)
                            }
                            className="flex-1"
                          />
                          <select
                            value={skill.level}
                            onChange={(e) =>
                              updateSkill(skill.id, "level", e.target.value)
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                          >
                            <option value="beginner">Sơ cấp</option>
                            <option value="intermediate">Trung cấp</option>
                            <option value="advanced">Nâng cao</option>
                            <option value="expert">Chuyên gia</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => removeSkill(skill.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
