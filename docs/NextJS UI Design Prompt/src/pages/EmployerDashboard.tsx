import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Briefcase, 
  Users, 
  Eye, 
  CheckCircle,
  Plus,
  Calendar,
  TrendingUp
} from "lucide-react";

export function EmployerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl">Dashboard Nhà tuyển dụng</h1>
            <Button className="bg-[#f26b38] hover:bg-[#e05a27]" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Đăng tin tuyển dụng
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-[#f26b38]" />
                </div>
                <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
              </div>
              <div className="text-2xl mb-1">12</div>
              <div className="text-sm text-gray-600">Tin tuyển dụng</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl mb-1">284</div>
              <div className="text-sm text-gray-600">Ứng viên mới</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl mb-1">2,456</div>
              <div className="text-sm text-gray-600">Lượt xem tin</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl mb-1">18</div>
              <div className="text-sm text-gray-600">Đã tuyển</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Jobs */}
              <Card className="p-6">
                <h2 className="text-xl mb-6">Tin tuyển dụng đang hoạt động</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="mb-1">Senior Frontend Developer</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Đăng 5 ngày trước</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>248 lượt xem</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>18 ứng viên</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">ReactJS</Badge>
                            <Badge variant="secondary">TypeScript</Badge>
                            <Badge variant="secondary">Senior</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline">
                            Chỉnh sửa
                          </Button>
                          <Button size="sm" variant="outline" className="border-[#f26b38] text-[#f26b38]">
                            Xem ứng viên
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Applicants */}
              <Card className="p-6">
                <h2 className="text-xl mb-6">Ứng viên mới nhất</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-[#f26b38]" />
                        </div>
                        <div>
                          <h4 className="mb-1">Nguyễn Văn A</h4>
                          <p className="text-sm text-gray-600">Ứng tuyển: Frontend Developer</p>
                          <p className="text-xs text-gray-500">2 giờ trước</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#f26b38] hover:bg-[#e05a27]">
                        Xem CV
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Performance */}
              <Card className="p-6">
                <h3 className="mb-4">Hiệu suất tuyển dụng</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Tỷ lệ phản hồi</span>
                      <span className="text-[#f26b38]">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#f26b38] h-2 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Thời gian tuyển dụng TB</span>
                      <span className="text-[#f26b38]">21 ngày</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Ứng viên chất lượng</span>
                      <span className="text-green-600">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="mb-4">Thống kê nhanh</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tin hết hạn</span>
                    <span>3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Đang chờ duyệt</span>
                    <Badge className="bg-yellow-100 text-yellow-700">5</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">CV chưa xem</span>
                    <Badge className="bg-blue-100 text-blue-700">24</Badge>
                  </div>
                </div>
              </Card>

              {/* Upgrade */}
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
                <TrendingUp className="h-8 w-8 text-[#f26b38] mb-3" />
                <h3 className="mb-2">Nâng cấp gói Premium</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Đăng tin không giới hạn, ưu tiên hiển thị và nhiều tính năng khác
                </p>
                <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27]">
                  Nâng cấp ngay
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
