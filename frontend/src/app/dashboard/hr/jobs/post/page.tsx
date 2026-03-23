"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api } from "@/services/api";
import { Card } from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Send,
  X,
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  industry: string;
}

interface Skill {
  id: string;
  name: string;
}

interface JobTag {
  id: string;
  name: string;
}

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  jobType: string;
  experienceLevel: string;
  salaryType: string;
  minSalary: string;
  maxSalary: string;
  currency: string;
  city: string;
  state: string;
  country: string;
  remoteWork: boolean;
  companyId: string;
  skillIds: string[];
  tagIds: string[];
  expiresAt: string;
}

const jobTypes = [
  { value: "full_time", label: "Toàn thời gian" },
  { value: "part_time", label: "Bán thời gian" },
  { value: "contract", label: "Hợp đồng" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Thực tập" },
];

const experienceLevels = [
  { value: "entry_level", label: "Mới tốt nghiệp (0-2 năm)" },
  { value: "junior", label: "Junior (2-4 năm)" },
  { value: "mid_level", label: "Middle (4-7 năm)" },
  { value: "senior", label: "Senior (7-10 năm)" },
  { value: "lead", label: "Lead (10+ năm)" },
  { value: "executive", label: "Executive/C-level" },
];

const salaryTypes = [
  { value: "monthly", label: "Theo tháng" },
  { value: "yearly", label: "Theo năm" },
  { value: "hourly", label: "Theo giờ" },
  { value: "negotiable", label: "Thương lượng" },
];

const currencies = [
  { value: "VND", label: "VNĐ" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

export default function PostJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [tags, setTags] = useState<JobTag[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedTags, setSelectedTags] = useState<JobTag[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    jobType: "",
    experienceLevel: "",
    salaryType: "monthly",
    minSalary: "",
    maxSalary: "",
    currency: "VND",
    city: "",
    state: "",
    country: "Việt Nam",
    remoteWork: false,
    companyId: "",
    skillIds: [],
    tagIds: [],
    expiresAt: "",
  });

  const [errors, setErrors] = useState<Partial<JobFormData>>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log("No access token found, redirecting to login");
        router.push("/auth/login");
        return;
      }

      console.log("Fetching companies with token:", token.substring(0, 20) + "...");

      // Fetch user's companies (for HR users, use HR endpoint)
      let companiesResponse;
      try {
        // Try HR endpoint first
        companiesResponse = await api.get("/hr/companies");
      } catch (hrError) {
        // Fallback to regular companies endpoint
        console.log("HR companies endpoint failed, trying regular endpoint");
        companiesResponse = await api.get("/companies/user/my-companies");
      }
      console.log("Companies response:", companiesResponse);
      const companiesData = companiesResponse.data;
      console.log("Companies data:", companiesData);
      setCompanies(companiesData);

      if (companiesData.length > 0) {
        console.log("Setting first company as default:", companiesData[0].name);
        setFormData((prev) => ({ ...prev, companyId: companiesData[0].id }));
      } else {
        console.log("No companies found for user");
      }

      // Fetch skills
      console.log("Fetching skills...");
      const skillsResponse = await api.get("/skills");
      const skillsData = skillsResponse.data;
      console.log("Skills data:", skillsData);
      setSkills(skillsData);

      // Fetch tags (assuming there's a tags endpoint, if not we'll create one later)
      // For now, we'll use mock data
      setTags([
        { id: "1", name: "ReactJS" },
        { id: "2", name: "NodeJS" },
        { id: "3", name: "Python" },
        { id: "4", name: "Java" },
        { id: "5", name: "AWS" },
        { id: "6", name: "Docker" },
        { id: "7", name: "UI/UX" },
        { id: "8", name: "DevOps" },
        { id: "9", name: "Mobile" },
        { id: "10", name: "AI/ML" },
      ]);

      console.log("Initial data loaded successfully");
    } catch (error) {
      console.error("Error fetching initial data:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorResponse = error as any;
      console.error("Error response:", errorResponse?.response);

      // If user is not authenticated, redirect to login
      if (errorResponse?.response?.status === 401) {
        console.error("User not authenticated, redirecting to login");
        router.push("/auth/login");
      } else {
        // Show error message to user
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại.", {
          duration: 5000,
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<JobFormData> = {};

    if (!formData.title.trim())
      newErrors.title = "Tiêu đề công việc là bắt buộc";
    if (!formData.description.trim())
      newErrors.description = "Mô tả công việc là bắt buộc";
    if (!formData.companyId) newErrors.companyId = "Vui lòng chọn công ty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof JobFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSkillToggle = (skill: Skill) => {
    setSelectedSkills((prev) => {
      const isSelected = prev.some((s) => s.id === skill.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== skill.id);
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleTagToggle = (tag: JobTag) => {
    setSelectedTags((prev) => {
      const isSelected = prev.some((t) => t.id === tag.id);
      if (isSelected) {
        return prev.filter((t) => t.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const handleSubmit = async (publish: boolean = false) => {
    if (!validateForm()) return;

    const loadingToast = toast.loading("Đang xử lý...", {
      duration: 2000,
    });

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        skillIds: selectedSkills.map((s) => s.id),
        tagIds: selectedTags.map((t) => t.id),
        minSalary: formData.minSalary
          ? parseFloat(formData.minSalary)
          : undefined,
        maxSalary: formData.maxSalary
          ? parseFloat(formData.maxSalary)
          : undefined,
        expiresAt: formData.expiresAt
          ? new Date(formData.expiresAt).toISOString()
          : undefined,
      };

      toast.dismiss(loadingToast);
      toast.success("Đã tạo job thành công!");

      const createToast = toast.loading("Đang tạo job...", {
        duration: 2000,
      });

      const response = await api.post("/jobs", submitData);
      const job = response.data;

      toast.dismiss(createToast);
      toast.success(`Job "${job.title}" đã được tạo!`, {
        duration: 3000,
        icon: "✅",
      });

      if (publish) {
        // Publish the job immediately
        const publishToast = toast.loading("Đang đăng tin...", {
          duration: 2000,
        });

        await api.post(`/jobs/${job.id}/publish`);

        toast.dismiss(publishToast);
        toast.success("Đăng tin tuyển dụng thành công! 🎉", {
          duration: 4000,
          icon: "🚀",
        });
      } else {
        toast.success("Đã lưu nháp thành công! 📝", {
          duration: 3000,
        });
      }

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/jobs");
      }, 2000);
    } catch (error) {
      console.error("Error creating job:", error);
      toast.dismiss(loadingToast);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.response?.data?.message ||
        "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(`Lỗi: ${errorMessage}`, {
        duration: 5000,
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkJobsOnPage = () => {
    // Open jobs page in new tab to check if job was created
    window.open("/jobs", "_blank");
    toast("Đã mở trang jobs để kiểm tra!", {
      icon: "🔍",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link href="/dashboard/hr">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold">Đăng tin tuyển dụng</h1>
                  <p className="text-gray-600 mt-1">
                    Tạo tin tuyển dụng mới cho công ty của bạn
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Thông tin cơ bản
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company">Công ty *</Label>
                      <Select
                        value={formData.companyId}
                        onValueChange={(value) =>
                          handleInputChange("companyId", value)
                        }
                      >
                        <SelectTrigger>
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
                      {errors.companyId && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.companyId}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="title">Tiêu đề công việc *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Ví dụ: Senior Frontend Developer"
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Mô tả công việc *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Mô tả chi tiết về công việc, trách nhiệm và yêu cầu..."
                        rows={6}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="jobType">Loại công việc</Label>
                        <Select
                          value={formData.jobType}
                          onValueChange={(value) =>
                            handleInputChange("jobType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại công việc" />
                          </SelectTrigger>
                          <SelectContent>
                            {jobTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="experienceLevel">
                          Cấp bậc kinh nghiệm
                        </Label>
                        <Select
                          value={formData.experienceLevel}
                          onValueChange={(value) =>
                            handleInputChange("experienceLevel", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn cấp bậc" />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Requirements and Benefits */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Yêu cầu và quyền lợi
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="requirements">Yêu cầu công việc</Label>
                      <Textarea
                        id="requirements"
                        value={formData.requirements}
                        onChange={(e) =>
                          handleInputChange("requirements", e.target.value)
                        }
                        placeholder="Liệt kê các yêu cầu, kỹ năng cần thiết..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="benefits">Quyền lợi</Label>
                      <Textarea
                        id="benefits"
                        value={formData.benefits}
                        onChange={(e) =>
                          handleInputChange("benefits", e.target.value)
                        }
                        placeholder="Mô tả các quyền lợi, đãi ngộ..."
                        rows={4}
                      />
                    </div>
                  </div>
                </Card>

                {/* Salary Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Thông tin lương bổng
                  </h2>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="salaryType">Loại lương</Label>
                        <Select
                          value={formData.salaryType}
                          onValueChange={(value) =>
                            handleInputChange("salaryType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {salaryTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="currency">Tiền tệ</Label>
                        <Select
                          value={formData.currency}
                          onValueChange={(value) =>
                            handleInputChange("currency", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem
                                key={currency.value}
                                value={currency.value}
                              >
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="expiresAt">Hạn nộp hồ sơ</Label>
                        <Input
                          id="expiresAt"
                          type="date"
                          value={formData.expiresAt}
                          onChange={(e) =>
                            handleInputChange("expiresAt", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {formData.salaryType !== "negotiable" && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minSalary">Lương tối thiểu</Label>
                          <Input
                            id="minSalary"
                            type="number"
                            value={formData.minSalary}
                            onChange={(e) =>
                              handleInputChange("minSalary", e.target.value)
                            }
                            placeholder="Ví dụ: 15000000"
                          />
                        </div>

                        <div>
                          <Label htmlFor="maxSalary">Lương tối đa</Label>
                          <Input
                            id="maxSalary"
                            type="number"
                            value={formData.maxSalary}
                            onChange={(e) =>
                              handleInputChange("maxSalary", e.target.value)
                            }
                            placeholder="Ví dụ: 25000000"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Location */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Địa điểm làm việc
                  </h2>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Thành phố</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          placeholder="Ví dụ: Hà Nội"
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">Quận/Huyện</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                          placeholder="Ví dụ: Cầu Giấy"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Quốc gia</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                        placeholder="Ví dụ: Việt Nam"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remoteWork"
                        checked={formData.remoteWork}
                        onCheckedChange={(checked) =>
                          handleInputChange("remoteWork", checked)
                        }
                      />
                      <Label htmlFor="remoteWork">
                        Cho phép làm việc từ xa
                      </Label>
                    </div>
                  </div>
                </Card>

                {/* Skills and Tags */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Kỹ năng và thẻ tag
                  </h2>

                  <div className="space-y-6">
                    {/* Skills */}
                    <div>
                      <Label>Kỹ năng cần thiết</Label>
                      <div className="mt-2">
                        <Input
                          placeholder="Tìm kiếm kỹ năng..."
                          value={skillSearch}
                          onChange={(e) => setSkillSearch(e.target.value)}
                          className="mb-3"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                          {filteredSkills.slice(0, 20).map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`skill-${skill.id}`}
                                checked={selectedSkills.some(
                                  (s) => s.id === skill.id
                                )}
                                onCheckedChange={() => handleSkillToggle(skill)}
                              />
                              <Label
                                htmlFor={`skill-${skill.id}`}
                                className="text-sm"
                              >
                                {skill.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {selectedSkills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedSkills.map((skill) => (
                              <Badge
                                key={skill.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {skill.name}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => handleSkillToggle(skill)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <Label>Thẻ tag</Label>
                      <div className="mt-2">
                        <Input
                          placeholder="Tìm kiếm thẻ tag..."
                          value={tagSearch}
                          onChange={(e) => setTagSearch(e.target.value)}
                          className="mb-3"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                          {filteredTags.slice(0, 20).map((tag) => (
                            <div
                              key={tag.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`tag-${tag.id}`}
                                checked={selectedTags.some(
                                  (t) => t.id === tag.id
                                )}
                                onCheckedChange={() => handleTagToggle(tag)}
                              />
                              <Label
                                htmlFor={`tag-${tag.id}`}
                                className="text-sm"
                              >
                                {tag.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {selectedTags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedTags.map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {tag.name}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => handleTagToggle(tag)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Actions */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Hành động</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleSubmit(false)}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Đang lưu..." : "Lưu nháp"}
                    </Button>
                    <Button
                      onClick={() => handleSubmit(true)}
                      disabled={isLoading}
                      className="w-full bg-[#f26b38] hover:bg-[#e05a27]"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isLoading ? "Đang đăng..." : "Đăng tin ngay"}
                    </Button>
                    <Button
                      onClick={checkJobsOnPage}
                      variant="ghost"
                      className="w-full border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#f26b38] hover:text-[#f26b38]"
                    >
                      🔍 Kiểm tra jobs đã tạo
                    </Button>
                    <Button
                      onClick={() => {
                        console.log("Current companies state:", companies);
                        console.log("Current token:", localStorage.getItem("access_token"));
                        toast(`Có ${companies.length} công ty. Token: ${localStorage.getItem("access_token") ? "Có" : "Không có"}`);
                      }}
                      variant="ghost"
                      className="w-full border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-500 hover:text-blue-700"
                    >
                      🔧 Debug API
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Tin tuyển dụng sẽ được kiểm duyệt trước khi hiển thị công
                    khai.
                  </p>
                </Card>

                {/* Job Preview */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Xem trước</h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>Tiêu đề:</strong> {formData.title || "Chưa nhập"}
                    </div>
                    <div className="text-sm">
                      <strong>Công ty:</strong>{" "}
                      {companies.find((c) => c.id === formData.companyId)
                        ?.name || "Chưa chọn"}
                    </div>
                    <div className="text-sm">
                      <strong>Loại:</strong>{" "}
                      {jobTypes.find((t) => t.value === formData.jobType)
                        ?.label || "Chưa chọn"}
                    </div>
                    <div className="text-sm">
                      <strong>Địa điểm:</strong>{" "}
                      {[formData.city, formData.state, formData.country]
                        .filter(Boolean)
                        .join(", ") || "Chưa nhập"}
                    </div>
                    <div className="text-sm">
                      <strong>Kỹ năng:</strong>{" "}
                      {selectedSkills.map((s) => s.name).join(", ") ||
                        "Chưa chọn"}
                    </div>
                  </div>
                </Card>

                {/* Tips */}
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <h3 className="font-semibold mb-4 text-blue-900">
                    Mẹo viết tin tuyển dụng hiệu quả
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Sử dụng tiêu đề rõ ràng và hấp dẫn</li>
                    <li>• Mô tả chi tiết trách nhiệm và yêu cầu</li>
                    <li>• Liệt kê quyền lợi cụ thể</li>
                    <li>• Chọn kỹ năng phù hợp với vị trí</li>
                    <li>• Đặt mức lương cạnh tranh</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}
