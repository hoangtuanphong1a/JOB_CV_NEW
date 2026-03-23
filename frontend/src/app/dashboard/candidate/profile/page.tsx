"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Camera,
  Home,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  bio?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Experience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  location?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  gpa?: number;
  description?: string;
}

export default function CandidateProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Form states
  const [editProfile, setEditProfile] = useState<UserProfile | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    isCurrent: false,
  });
  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    isCurrent: false,
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);

      // Check authentication
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // Mock profile data for now
      const mockProfile: UserProfile = {
        id: "1",
        email: "candidate@example.com",
        firstName: "Nguyễn",
        lastName: "Văn A",
        phone: "+84 123 456 789",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        dateOfBirth: "1990-01-01",
        gender: "male",
        address: "TP.HCM, Việt Nam",
        bio: "Tôi là một lập trình viên frontend với 5 năm kinh nghiệm, chuyên về React và TypeScript.",
        linkedinUrl: "https://linkedin.com/in/nguyenvana",
        portfolioUrl: "https://portfolio.com",
      };

      const mockSkills: Skill[] = [
        { id: "1", name: "React", level: 90 },
        { id: "2", name: "TypeScript", level: 85 },
        { id: "3", name: "Node.js", level: 75 },
        { id: "4", name: "Python", level: 70 },
      ];

      const mockExperiences: Experience[] = [
        {
          id: "1",
          companyName: "TechCorp Vietnam",
          position: "Senior Frontend Developer",
          startDate: "2022-01-01",
          isCurrent: true,
          description:
            "Phát triển và duy trì các ứng dụng web sử dụng React, TypeScript và Next.js. Lãnh đạo team 5 người.",
          location: "TP.HCM",
        },
        {
          id: "2",
          companyName: "StartupTech",
          position: "Frontend Developer",
          startDate: "2020-06-01",
          endDate: "2021-12-31",
          isCurrent: false,
          description:
            "Phát triển giao diện người dùng responsive, tối ưu performance và trải nghiệm người dùng.",
          location: "Hà Nội",
        },
      ];

      const mockEducations: Education[] = [
        {
          id: "1",
          institution: "Đại học Công nghệ Thông tin",
          degree: "Cử nhân",
          fieldOfStudy: "Kỹ thuật Phần mềm",
          startDate: "2016-09-01",
          endDate: "2020-06-30",
          isCurrent: false,
          gpa: 3.8,
          description: "Tốt nghiệp loại Giỏi, tham gia nhiều dự án thực tế.",
        },
      ];

      setProfile(mockProfile);
      setSkills(mockSkills);
      setExperiences(mockExperiences);
      setEducations(mockEducations);
      setEditProfile(mockProfile);
      calculateProfileCompletion(
        mockProfile,
        mockSkills,
        mockExperiences,
        mockEducations
      );
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Không thể tải thông tin hồ sơ");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProfileCompletion = (
    profile: UserProfile,
    skills: Skill[],
    experiences: Experience[],
    educations: Education[]
  ) => {
    let completion = 0;
    const maxCompletion = 100;

    // Basic info (30%)
    if (profile.firstName && profile.lastName) completion += 10;
    if (profile.phone) completion += 5;
    if (profile.dateOfBirth) completion += 5;
    if (profile.address) completion += 5;
    if (profile.bio) completion += 5;

    // Skills (20%)
    if (skills.length > 0) completion += Math.min(skills.length * 5, 20);

    // Experience (25%)
    if (experiences.length > 0)
      completion += Math.min(experiences.length * 8, 25);

    // Education (15%)
    if (educations.length > 0) completion += 15;

    // Social links (10%)
    if (profile.linkedinUrl) completion += 5;
    if (profile.portfolioUrl) completion += 5;

    setProfileCompletion(Math.min(completion, maxCompletion));
  };

  const handleSaveProfile = async () => {
    if (!editProfile) return;

    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfile(editProfile);
      setIsEditing(false);
      calculateProfileCompletion(editProfile, skills, experiences, educations);
      toast.success("Hồ sơ đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Có lỗi xảy ra khi lưu hồ sơ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.trim(),
      level: 50,
    };

    setSkills([...skills, skill]);
    setNewSkill("");
    calculateProfileCompletion(
      profile!,
      [...skills, skill],
      experiences,
      educations
    );
  };

  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = skills.filter((s) => s.id !== skillId);
    setSkills(updatedSkills);
    calculateProfileCompletion(
      profile!,
      updatedSkills,
      experiences,
      educations
    );
  };

  const handleAddExperience = () => {
    if (
      !newExperience.companyName ||
      !newExperience.position ||
      !newExperience.startDate
    )
      return;

    const experience: Experience = {
      id: Date.now().toString(),
      companyName: newExperience.companyName,
      position: newExperience.position,
      startDate: newExperience.startDate,
      endDate: newExperience.endDate,
      isCurrent: newExperience.isCurrent || false,
      description: newExperience.description || "",
      location: newExperience.location,
    };

    setExperiences([...experiences, experience]);
    setNewExperience({ isCurrent: false });
    calculateProfileCompletion(
      profile!,
      skills,
      [...experiences, experience],
      educations
    );
  };

  const handleAddEducation = () => {
    if (
      !newEducation.institution ||
      !newEducation.degree ||
      !newEducation.fieldOfStudy ||
      !newEducation.startDate
    )
      return;

    const education: Education = {
      id: Date.now().toString(),
      institution: newEducation.institution,
      degree: newEducation.degree,
      fieldOfStudy: newEducation.fieldOfStudy,
      startDate: newEducation.startDate,
      endDate: newEducation.endDate,
      isCurrent: newEducation.isCurrent || false,
      gpa: newEducation.gpa,
      description: newEducation.description,
    };

    setEducations([...educations, education]);
    setNewEducation({ isCurrent: false });
    calculateProfileCompletion(profile!, skills, experiences, [
      ...educations,
      education,
    ]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#f26b38] mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy hồ sơ
          </h1>
          <p className="text-gray-600">
            Có lỗi xảy ra khi tải thông tin hồ sơ của bạn.
          </p>
          <Button
            onClick={() => router.push("/dashboard/candidate")}
            className="mt-4"
          >
            Quay lại Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/candidate">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hồ sơ cá nhân
                </h1>
                <p className="text-gray-600">
                  Quản lý thông tin cá nhân và kỹ năng của bạn
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Trang chủ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-red-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-600">
                        {profile.firstName?.charAt(0)}
                        {profile.lastName?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-[#f26b38] text-white p-2 rounded-full hover:bg-[#e05a27] transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 mb-4">{profile.email}</p>

                {/* Profile Completion */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Hoàn thiện hồ sơ</span>
                    <span className="text-[#f26b38] font-medium">
                      {profileCompletion}%
                    </span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-[#f26b38] hover:bg-[#e05a27]"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa hồ sơ
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Lưu
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{profile.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                {isEditing && editProfile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ
                        </label>
                        <Input
                          value={editProfile.firstName || ""}
                          onChange={(e) =>
                            setEditProfile({
                              ...editProfile,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="Họ"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên
                        </label>
                        <Input
                          value={editProfile.lastName || ""}
                          onChange={(e) =>
                            setEditProfile({
                              ...editProfile,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Tên"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <Input
                        value={editProfile.phone || ""}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Số điện thoại"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                      </label>
                      <Input
                        value={editProfile.address || ""}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            address: e.target.value,
                          })
                        }
                        placeholder="Địa chỉ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới thiệu bản thân
                      </label>
                      <Textarea
                        value={editProfile.bio || ""}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            bio: e.target.value,
                          })
                        }
                        placeholder="Giới thiệu ngắn gọn về bản thân"
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Họ và tên
                        </label>
                        <p className="text-gray-900">
                          {profile.firstName} {profile.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Email
                        </label>
                        <p className="text-gray-900">{profile.email}</p>
                      </div>
                    </div>
                    {profile.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Số điện thoại
                        </label>
                        <p className="text-gray-900">{profile.phone}</p>
                      </div>
                    )}
                    {profile.address && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Địa chỉ
                        </label>
                        <p className="text-gray-900">{profile.address}</p>
                      </div>
                    )}
                    {profile.bio && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Giới thiệu
                        </label>
                        <p className="text-gray-700">{profile.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Kỹ năng
                  </span>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddSkill}
                      disabled={!newSkill.trim()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                {isEditing && (
                  <div className="mb-4">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Nhập tên kỹ năng"
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-full"
                    >
                      <span className="text-sm font-medium text-orange-700">
                        {skill.name}
                      </span>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  {skills.length === 0 && !isEditing && (
                    <p className="text-gray-500 text-sm">Chưa có kỹ năng nào</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Kinh nghiệm làm việc
                  </span>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Open modal or expand form
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="border-l-4 border-orange-200 pl-4"
                    >
                      <h4 className="font-semibold text-gray-900">
                        {exp.position}
                      </h4>
                      <p className="text-orange-600 font-medium">
                        {exp.companyName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(exp.startDate).getFullYear()} -{" "}
                          {exp.isCurrent
                            ? "Hiện tại"
                            : exp.endDate
                            ? new Date(exp.endDate).getFullYear()
                            : "N/A"}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm">{exp.description}</p>
                    </div>
                  ))}
                  {experiences.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      Chưa có kinh nghiệm làm việc
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Học vấn
                  </span>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Open modal or expand form
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div
                      key={edu.id}
                      className="border-l-4 border-green-200 pl-4"
                    >
                      <h4 className="font-semibold text-gray-900">
                        {edu.degree} - {edu.fieldOfStudy}
                      </h4>
                      <p className="text-green-600 font-medium">
                        {edu.institution}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(edu.startDate).getFullYear()} -{" "}
                          {edu.isCurrent
                            ? "Hiện tại"
                            : edu.endDate
                            ? new Date(edu.endDate).getFullYear()
                            : "N/A"}
                        </span>
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>
                      {edu.description && (
                        <p className="text-gray-700 text-sm">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                  {educations.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      Chưa có thông tin học vấn
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
