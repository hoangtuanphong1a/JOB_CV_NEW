"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, Send, AlertCircle, ArrowLeft, Briefcase, Sparkles } from "lucide-react";
import {
  jobService,
  JobFormData,
  Company,
  JobCategory,
} from "@/services/jobService";
import toast, { Toaster } from "react-hot-toast";

export default function PostJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    industry: "",
    level: "",
    type: "",
    quantity: "1",
    salaryMin: "",
    salaryMax: "",
    location: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: [],
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    deadline: "",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      console.log("Loading initial data for job posting...");
      const [companiesData, categoriesData] = await Promise.all([
        jobService.getUserCompanies(),
        jobService.getJobCategories(),
      ]);

      console.log("Companies loaded:", companiesData);
      console.log("Categories loaded:", categoriesData);

      setCompanies(companiesData);
      setCategories(categoriesData);

      // Auto-select first company if available
      if (companiesData.length > 0) {
        setSelectedCompanyId(companiesData[0].id);
        console.log("Auto-selected company:", companiesData[0].name);
      } else {
        console.warn("No companies found for user");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error loading initial data:", error);
      // If user is not authenticated, redirect to login
      if (error?.response?.status === 401) {
        console.error("User not authenticated, redirecting to login");
        router.push("/auth/login");
      } else {
        // Set error for companies
        setErrors((prev) => ({
          ...prev,
          companies: "Không thể tải danh sách công ty. Vui lòng thử lại.",
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Check if user has companies
    if (companies.length === 0) {
      newErrors.company = "Bạn cần tạo công ty trước khi đăng tin tuyển dụng";
      setErrors(newErrors);
      return false;
    }

    // Validate required fields
    if (!formData.title.trim())
      newErrors.title = "Tiêu đề công việc là bắt buộc";
    if (!formData.industry) newErrors.industry = "Ngành nghề là bắt buộc";
    if (!formData.level) newErrors.level = "Cấp bậc là bắt buộc";
    if (!formData.type) newErrors.type = "Hình thức làm việc là bắt buộc";
    if (!formData.location.trim())
      newErrors.location = "Địa điểm là bắt buộc";
    if (!formData.description.trim())
      newErrors.description = "Mô tả công việc là bắt buộc";
    if (!formData.requirements.trim())
      newErrors.requirements = "Yêu cầu ứng viên là bắt buộc";
    if (!formData.contactName.trim())
      newErrors.contactName = "Tên người liên hệ là bắt buộc";
    if (!formData.contactEmail.trim())
      newErrors.contactEmail = "Email liên hệ là bắt buộc";
    if (!formData.deadline) newErrors.deadline = "Hạn nộp hồ sơ là bắt buộc";

    if (!selectedCompanyId) newErrors.company = "Vui lòng chọn công ty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapFormToJobData = async () => {
    // Map frontend values to backend enums
    const jobTypeMap: { [key: string]: string } = {
      fulltime: "full_time",
      parttime: "part_time",
      remote: "contract", // Map remote to contract for now
      contract: "contract",
      internship: "internship",
    };

    const experienceLevelMap: { [key: string]: string } = {
      intern: "entry_level",
      junior: "junior",
      middle: "mid_level",
      senior: "senior",
      lead: "lead",
      manager: "executive",
    };

    // Find category ID from selected industry
    const selectedCategory = categories.find((cat) =>
      cat.name.toLowerCase().includes(formData.industry.toLowerCase())
    );
    const categoryId = selectedCategory?.id;

    // Convert skill names to skill IDs
    let skillIds: string[] | undefined = undefined;
    if (formData.skills.length > 0) {
      skillIds = await jobService.convertSkillNamesToIds(formData.skills);
    }

    return {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements || undefined,
      benefits: formData.benefits || undefined,
      jobType: jobTypeMap[formData.type] || "full_time",
      experienceLevel: experienceLevelMap[formData.level] || "mid_level",
      minSalary: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
      maxSalary: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
      city: formData.location,
      country: "Vietnam", // Default for now
      categoryId,
      companyId: selectedCompanyId,
      expiresAt: formData.deadline || undefined,
      skillIds,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsLoading(true);

    const loadingToast = toast.loading('Đang đăng tin tuyển dụng...');

    try {
      console.log('🚀 Starting job posting process...');
      const jobData = await mapFormToJobData();
      console.log('📝 Mapped job data:', jobData);

      console.log('📡 Calling jobService.createJob()...');
      const createdJob = await jobService.createJob(jobData);
      console.log('✅ Job creation API call completed');
      console.log('📋 Returned job data:', createdJob);
      console.log('🆔 Job ID:', createdJob?.id);
      console.log('📄 Job Title:', createdJob?.title);
      console.log('🏢 Company:', createdJob?.company?.name);
      console.log('📊 Job Status:', createdJob?.status);

      toast.dismiss(loadingToast);

      console.log('🎉 JOB POSTING SUCCESSFUL!');
      console.log('✅ Đăng tin tuyển dụng thành công!');
      console.log('📍 Job details:', {
        id: createdJob?.id,
        title: createdJob?.title,
        company: createdJob?.company?.name,
        status: createdJob?.status,
        createdAt: createdJob?.createdAt
      });

      toast.success('🎉 Đăng tin tuyển dụng thành công!', {
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold'
        }
      });

      console.log('🔄 Redirecting to jobs page in 2 seconds...');
      setTimeout(() => {
        console.log('🚀 Executing redirect to jobs page...');
        const timestamp = Date.now();
        const redirectUrl = `/jobs?refresh=${timestamp}&success=true&jobId=${createdJob?.id}`;
        console.log('📍 Redirect URL:', redirectUrl);
        router.push(redirectUrl);
        console.log('✅ Redirect completed!');
      }, 2000);
    } catch (error: unknown) {
      console.error('Error posting job:', error);
      toast.dismiss(loadingToast);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        router.push('/auth/login');
      } else {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.response?.data?.message ||
          'Có lỗi xảy ra. Vui lòng thử lại.';
        toast.error(errorMessage);
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[300px] lg:min-h-[400px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&q=80"
            alt="Post job background"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 h-full">
          <div className="flex items-center min-h-[300px] lg:min-h-[400px]">
            <div className="max-w-2xl">
              {/* Back Button */}
              <Link href="/jobs" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Quay lại danh sách việc làm</span>
              </Link>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Đăng tin tuyển dụng ngay hôm nay</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Tìm kiếm
                <br />
                <span className="text-[#f26b38]">nhân tài xuất sắc</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-200 leading-relaxed">
                Tiếp cận hàng nghìn ứng viên tiềm năng và tìm kiếm nhân tài phù hợp nhất cho doanh nghiệp của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{errors.general}</p>
              </div>
            )}

            {/* Company Selector */}
            <Card className="p-6 mb-6 border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#f26b38] to-[#e05a27] rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Chọn công ty</h2>
                  <p className="text-sm text-gray-600">Chọn công ty để đăng tin tuyển dụng</p>
                </div>
              </div>

              <div className="space-y-2">
                {companies.length > 0 ? (
                  <>
                    <Select
                      value={selectedCompanyId}
                      onValueChange={setSelectedCompanyId}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Chọn công ty" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.company && (
                      <p className="text-red-500 text-sm">{errors.company}</p>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    {errors.companies ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-700 text-sm">
                          {errors.companies}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={loadInitialData}
                        >
                          Thử lại
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-yellow-700 text-sm">
                          Bạn chưa có công ty nào. Vui lòng tạo công ty trước
                          khi đăng tin tuyển dụng.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => router.push("/dashboard/employer")}
                        >
                          Đến trang quản lý công ty
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Basic Info */}
              <Card className="p-6 border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
                    <p className="text-sm text-gray-600">Điền thông tin chi tiết về vị trí tuyển dụng</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">Tiêu đề công việc *</Label>
                    <Input
                      id="title"
                      placeholder="Ví dụ: Senior Frontend Developer"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-sm font-medium">Ngành nghề *</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value: string) =>
                          setFormData({ ...formData, industry: value })
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Chọn ngành nghề" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">
                            Công nghệ thông tin
                          </SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="design">Thiết kế</SelectItem>
                          <SelectItem value="sales">Kinh doanh</SelectItem>
                          <SelectItem value="finance">Tài chính</SelectItem>
                          <SelectItem value="hr">Nhân sự</SelectItem>
                          <SelectItem value="education">Giáo dục</SelectItem>
                          <SelectItem value="healthcare">Y tế</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-sm font-medium">Cấp bậc *</Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value: string) =>
                          setFormData({ ...formData, level: value })
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Chọn cấp bậc" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intern">
                            Thực tập sinh
                          </SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-medium">Hình thức làm việc *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: string) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Chọn hình thức" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fulltime">
                            Toàn thời gian
                          </SelectItem>
                          <SelectItem value="parttime">
                            Bán thời gian
                          </SelectItem>
                          <SelectItem value="remote">
                            Làm việc từ xa
                          </SelectItem>
                          <SelectItem value="contract">Hợp đồng</SelectItem>
                          <SelectItem value="internship">Thực tập</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-sm font-medium">Số lượng tuyển</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="1"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantity: e.target.value,
                          })
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Mức lương (triệu VNĐ)</Label>
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="Từ"
                            type="number"
                            min="0"
                            value={formData.salaryMin}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                salaryMin: e.target.value,
                              })
                            }
                            className="h-12 bg-white"
                          />
                          <Input
                            placeholder="Đến"
                            type="number"
                            min="0"
                            value={formData.salaryMax}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                salaryMax: e.target.value,
                              })
                            }
                            className="h-12 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium">Địa điểm làm việc *</Label>
                      <Input
                        id="location"
                        placeholder="Ví dụ: Hà Nội, TP.HCM"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: e.target.value,
                          })
                        }
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Job Description */}
              <Card className="p-6 border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Mô tả công việc</h2>
                    <p className="text-sm text-gray-600">Mô tả chi tiết về vị trí tuyển dụng</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">Mô tả công việc *</Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả chi tiết về công việc, trách nhiệm và mục tiêu cần đạt được..."
                      rows={8}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-sm font-medium">Yêu cầu ứng viên *</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Liệt kê các yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
                      rows={6}
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: e.target.value,
                        })
                      }
                      required
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits" className="text-sm font-medium">Quyền lợi</Label>
                    <Textarea
                      id="benefits"
                      placeholder="Mô tả các quyền lợi, phúc lợi mà ứng viên sẽ nhận được..."
                      rows={6}
                      value={formData.benefits}
                      onChange={(e) =>
                        setFormData({ ...formData, benefits: e.target.value })
                      }
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Kỹ năng yêu cầu</Label>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nhập kỹ năng và nhấn Enter"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={handleSkillKeyPress}
                            className="h-12 bg-white"
                          />
                          <Button
                            type="button"
                            onClick={addSkill}
                            variant="outline"
                            className="h-12 px-4"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {formData.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="px-3 py-1 bg-white"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="ml-2 hover:text-red-500"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Info */}
              <Card className="p-6 border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Thông tin liên hệ</h2>
                    <p className="text-sm text-gray-600">Thông tin để ứng viên liên hệ</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-sm font-medium">Người liên hệ *</Label>
                      <Input
                        id="contactName"
                        placeholder="Tên người liên hệ"
                        value={formData.contactName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactName: e.target.value,
                          })
                        }
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="text-sm font-medium">Email nhận hồ sơ *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="hr@company.com"
                        value={formData.contactEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactEmail: e.target.value,
                          })
                        }
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone" className="text-sm font-medium">Số điện thoại</Label>
                      <Input
                        id="contactPhone"
                        placeholder="0987654321"
                        value={formData.contactPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactPhone: e.target.value,
                          })
                        }
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-sm font-medium">Hạn nộp hồ sơ *</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) =>
                          setFormData({ ...formData, deadline: e.target.value })
                        }
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#f26b38] to-[#e05a27] hover:from-[#e05a27] hover:to-[#d04f1e] text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isLoading ? "Đang đăng..." : "Đăng tin tuyển dụng"}
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500 bg-white rounded-xl p-4 shadow-sm">
                <p className="font-medium mb-1">* Các trường bắt buộc</p>
                <p>Tin tuyển dụng sẽ được duyệt trong vòng 24 giờ</p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}