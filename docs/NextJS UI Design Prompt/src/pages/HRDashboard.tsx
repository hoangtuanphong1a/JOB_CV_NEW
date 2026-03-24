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
  TrendingUp,
  FileText,
  Target
} from "lucide-react";

export function HRDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl mb-2">HR Manager Dashboard</h1>
              <p className="text-gray-600">Quản lý tuyển dụng và nhân sự toàn diện</p>
            </div>
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
                <Badge className="bg-green-100 text-green-700">+8%</Badge>
              </div>
              <div className="text-2xl mb-1">24</div>
              <div className="text-sm text-gray-600">Vị trí đang tuyển</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+15%</Badge>
              </div>
              <div className="text-2xl mb-1">456</div>
              <div className="text-sm text-gray-600">Ứng viên mới</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl mb-1">85%</div>
              <div className="text-sm text-gray-600">Tỷ lệ hoàn thành KPI</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl mb-1">32</div>
              <div className="text-sm text-gray-600">Đã tuyển tháng này</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recruitment Pipeline */}
              <Card className="p-6">
                <h2 className="text-xl mb-6">Recruitment Pipeline</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <div className="mb-1">Đang xét duyệt CV</div>
                      <div className="text-2xl">124</div>
                    </div>
                    <Button size="sm" variant="outline" className="border-blue-600 text-blue-600">
                      Xem
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="mb-1">Chờ phỏng vấn</div>
                      <div className="text-2xl">45</div>
                    </div>
                    <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-600">
                      Xem
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                      <div className="mb-1">Đang offer</div>
                      <div className="text-2xl">18</div>
                    </div>
                    <Button size="sm" variant="outline" className="border-purple-600 text-purple-600">
                      Xem
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="mb-1">Chấp nhận offer</div>
                      <div className="text-2xl">12</div>
                    </div>
                    <Button size="sm" variant="outline" className="border-green-600 text-green-600">
                      Xem
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Active Jobs */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl">Tin tuyển dụng hoạt động</h2>
                  <Button variant="ghost" size="sm" className="text-[#f26b38]">
                    Xem tất cả
                  </Button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="mb-1">Senior Frontend Developer</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Đăng 5 ngày trước</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>248 views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>18 ứng viên</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div className="bg-[#f26b38] h-2 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                          <div className="text-xs text-gray-600">65% tiến độ tuyển dụng</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Interview Schedule */}
              <Card className="p-6">
                <h2 className="text-xl mb-6">Lịch phỏng vấn hôm nay</h2>
                <div className="space-y-4">
                  {[
                    { time: "09:00", name: "Nguyễn Văn A", position: "Frontend Developer" },
                    { time: "10:30", name: "Trần Thị B", position: "Backend Engineer" },
                    { time: "14:00", name: "Lê Văn C", position: "Product Manager" },
                  ].map((interview, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl text-[#f26b38]">{interview.time}</div>
                        </div>
                        <div>
                          <div className="mb-1">{interview.name}</div>
                          <div className="text-sm text-gray-600">{interview.position}</div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#f26b38] hover:bg-[#e05a27]">
                        Chi tiết
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recruitment KPIs */}
              <Card className="p-6">
                <h3 className="mb-4">KPIs tháng này</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Mục tiêu tuyển dụng</span>
                      <span className="text-[#f26b38]">32/40</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#f26b38] h-2 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Time to hire (TB)</span>
                      <span className="text-green-600">18 ngày</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Tỷ lệ offer accepted</span>
                      <span className="text-green-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Chất lượng ứng viên</span>
                      <span className="text-blue-600">4.2/5</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Department Stats */}
              <Card className="p-6">
                <h3 className="mb-4">Tuyển dụng theo phòng ban</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Engineering</span>
                    <Badge>12 vị trí</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sales</span>
                    <Badge>8 vị trí</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Marketing</span>
                    <Badge>4 vị trí</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Design</span>
                    <Badge>3 vị trí</Badge>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="mb-4">Hành động nhanh</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27]" size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Đăng tin mới
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <FileText className="h-5 w-5 mr-2" />
                    Báo cáo tháng
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Phân tích
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
