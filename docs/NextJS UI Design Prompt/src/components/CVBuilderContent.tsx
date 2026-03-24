import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
} from "lucide-react";

export function CVBuilderContent() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2">
            Tạo CV chuyên nghiệp
          </h1>
          <p className="text-lg text-gray-600">
            Xây dựng CV ấn tượng để tăng cơ hội nhận việc
          </p>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Editor Sidebar */}
          <div className="space-y-6">
            {/* Template Selector */}
            <Card className="p-6">
              <h3 className="mb-4">Mẫu CV</h3>
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
              <h3 className="mb-4">Nội dung CV</h3>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              <Button size="lg" className="bg-[#f26b38] hover:bg-[#e05a27]">
                <Download className="h-5 w-5 mr-2" />
                Tải xuống CV
              </Button>
              <Button size="lg" variant="outline">
                <Eye className="h-5 w-5 mr-2" />
                Xem trước
              </Button>
            </div>
          </div>

          {/* Editor Content */}
          <Card className="p-6 lg:p-8">
            <Tabs value={activeTab} className="w-full">
              {/* Personal Info */}
              <TabsContent value="personal" className="space-y-6">
                <div>
                  <h2 className="text-xl mb-6">Thông tin cá nhân</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Họ và tên</Label>
                      <Input placeholder="Nguyễn Văn A" />
                    </div>
                    <div className="space-y-2">
                      <Label>Vị trí ứng tuyển</Label>
                      <Input placeholder="Frontend Developer" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Số điện thoại</Label>
                      <Input placeholder="0987654321" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Địa chỉ</Label>
                      <Input placeholder="Hà Nội, Việt Nam" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Mục tiêu nghề nghiệp</Label>
                      <Textarea
                        placeholder="Mô tả mục tiêu và định hướng nghề nghiệp của bạn..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Experience */}
              <TabsContent value="experience" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl">Kinh nghiệm làm việc</h2>
                  <Button size="sm" variant="outline" className="border-[#f26b38] text-[#f26b38]">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm
                  </Button>
                </div>

                <Card className="p-6 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg">Kinh nghiệm 1</h3>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Vị trí</Label>
                      <Input placeholder="Senior Developer" />
                    </div>
                    <div className="space-y-2">
                      <Label>Công ty</Label>
                      <Input placeholder="Tech Company" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Từ</Label>
                        <Input type="month" />
                      </div>
                      <div className="space-y-2">
                        <Label>Đến</Label>
                        <Input type="month" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Mô tả công việc</Label>
                      <Textarea
                        placeholder="Mô tả trách nhiệm và thành tích..."
                        rows={4}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Education */}
              <TabsContent value="education" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl">Học vấn</h2>
                  <Button size="sm" variant="outline" className="border-[#f26b38] text-[#f26b38]">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm
                  </Button>
                </div>

                <Card className="p-6 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg">Học vấn 1</h3>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Trường</Label>
                      <Input placeholder="Đại học ABC" />
                    </div>
                    <div className="space-y-2">
                      <Label>Chuyên ngành</Label>
                      <Input placeholder="Công nghệ thông tin" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Từ</Label>
                        <Input type="month" />
                      </div>
                      <div className="space-y-2">
                        <Label>Đến</Label>
                        <Input type="month" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Mô tả</Label>
                      <Textarea
                        placeholder="GPA, thành tích, hoạt động..."
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Skills */}
              <TabsContent value="skills" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl">Kỹ năng</h2>
                  <Button size="sm" variant="outline" className="border-[#f26b38] text-[#f26b38]">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm kỹ năng
                  </Button>
                </div>

                <div className="space-y-4">
                  {["ReactJS", "NodeJS", "TypeScript"].map((skill, idx) => (
                    <Card key={idx} className="p-4 bg-gray-50">
                      <div className="flex items-center gap-4">
                        <Input
                          defaultValue={skill}
                          className="flex-1"
                        />
                        <select className="border border-gray-300 rounded-lg px-3 py-2">
                          <option>Chuyên nghiệp</option>
                          <option>Khá</option>
                          <option>Trung bình</option>
                        </select>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
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
  );
}
