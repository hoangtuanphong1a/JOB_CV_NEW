import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  FileText, 
  Bookmark, 
  Send, 
  Eye, 
  TrendingUp, 
  Calendar,
  MapPin,
  Briefcase 
} from "lucide-react";

export function CandidateDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl mb-8">Dashboard Ứng viên</h1>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Send className="h-6 w-6 text-[#f26b38]" />
                </div>
                <Badge className="bg-green-100 text-green-700">+12%</Badge>
              </div>
              <div className="text-2xl mb-1">24</div>
              <div className="text-sm text-gray-600">Đơn ứng tuyển</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl mb-1">156</div>
              <div className="text-sm text-gray-600">Lượt xem CV</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Bookmark className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl mb-1">12</div>
              <div className="text-sm text-gray-600">Việc làm đã lưu</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl mb-1">3</div>
              <div className="text-sm text-gray-600">CV đã tạo</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Applications */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl">Đơn ứng tuyển gần đây</h2>
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
                          <p className="text-sm text-gray-600 mb-2">TechViet Solutions</p>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>Hà Nội</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Ứng tuyển 2 ngày trước</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={i === 1 ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}>
                          {i === 1 ? "Đang xét duyệt" : "Đã gửi"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recommended Jobs */}
              <Card className="p-6">
                <h2 className="text-xl mb-6">Việc làm phù hợp</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-[#f26b38] transition-colors cursor-pointer">
                      <h3 className="mb-2">Backend Engineer</h3>
                      <p className="text-sm text-gray-600 mb-3">Innovation Tech</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">NodeJS</Badge>
                          <Badge variant="secondary" className="text-xs">AWS</Badge>
                        </div>
                        <span className="text-sm text-gray-600">20-30 triệu</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <Card className="p-6">
                <h3 className="mb-4">Hoàn thiện hồ sơ</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Độ hoàn thiện</span>
                    <span className="text-[#f26b38]">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#f26b38] h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Thêm ảnh đại diện</span>
                  </li>
                  <li className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Tạo CV</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Thêm kỹ năng</span>
                  </li>
                </ul>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="mb-4">Hành động nhanh</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27]" size="lg">
                    <FileText className="h-5 w-5 mr-2" />
                    Tạo CV mới
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Tìm việc làm
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
