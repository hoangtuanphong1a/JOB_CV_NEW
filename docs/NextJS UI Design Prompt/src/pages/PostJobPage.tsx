import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export function PostJobPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl mb-2">Đăng tin tuyển dụng</h1>
            <p className="text-gray-600 mb-8">
              Điền thông tin chi tiết để tìm kiếm ứng viên phù hợp
            </p>

            <form className="space-y-6">
              {/* Basic Info */}
              <Card className="p-6">
                <h2 className="text-xl mb-6">Thông tin cơ bản</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Tiêu đề công việc *</Label>
                    <Input placeholder="Ví dụ: Senior Frontend Developer" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Ngành nghề *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn ngành nghề" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="it">Công nghệ thông tin</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="design">Thiết kế</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Cấp bậc *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn cấp bậc" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intern">Intern</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="lead">Lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Hình thức làm việc *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn hình thức" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fulltime">Full-time</SelectItem>
                          <SelectItem value="parttime">Part-time</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Số lượng tuyển</Label>
                      <Input type="number" placeholder="1" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Mức lương (triệu VNĐ)</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Từ" type="number" />
                        <Input placeholder="Đến" type="number" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Địa điểm làm việc *</Label>
                      <Input placeholder="Ví dụ: Hà Nội" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Job Description */}
              <Card className="p-6">
                <h2 className="text-xl mb-6">Mô tả công việc</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Mô tả công việc *</Label>
                    <Textarea
                      placeholder="Mô tả chi tiết về công việc, trách nhiệm và yêu cầu..."
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Yêu cầu ứng viên *</Label>
                    <Textarea
                      placeholder="Liệt kê các yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quyền lợi</Label>
                    <Textarea
                      placeholder="Mô tả các quyền lợi, phúc lợi mà ứng viên sẽ nhận được..."
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Kỹ năng yêu cầu</Label>
                    <Input placeholder="Ví dụ: ReactJS, NodeJS, TypeScript (cách nhau bởi dấu phẩy)" />
                  </div>
                </div>
              </Card>

              {/* Contact Info */}
              <Card className="p-6">
                <h2 className="text-xl mb-6">Thông tin liên hệ</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Người liên hệ *</Label>
                      <Input placeholder="Tên người liên hệ" />
                    </div>

                    <div className="space-y-2">
                      <Label>Email nhận hồ sơ *</Label>
                      <Input type="email" placeholder="hr@company.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    <Input placeholder="0987654321" />
                  </div>

                  <div className="space-y-2">
                    <Label>Hạn nộp hồ sơ *</Label>
                    <Input type="date" />
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1">
                  Lưu nháp
                </Button>
                <Button type="submit" className="flex-1 bg-[#f26b38] hover:bg-[#e05a27]">
                  Đăng tin tuyển dụng
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
