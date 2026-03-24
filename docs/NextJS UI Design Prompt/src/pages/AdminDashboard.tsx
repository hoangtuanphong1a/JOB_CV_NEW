import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Eye
} from "lucide-react";

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Quản trị và giám sát toàn bộ hệ thống</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+12%</Badge>
              </div>
              <div className="text-2xl mb-1">15,234</div>
              <div className="text-sm text-gray-600">Tổng người dùng</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+8%</Badge>
              </div>
              <div className="text-2xl mb-1">1,245</div>
              <div className="text-sm text-gray-600">Công ty</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-[#f26b38]" />
                </div>
                <Badge className="bg-green-100 text-green-700">+25%</Badge>
              </div>
              <div className="text-2xl mb-1">8,456</div>
              <div className="text-sm text-gray-600">Tin tuyển dụng</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+18%</Badge>
              </div>
              <div className="text-2xl mb-1">$45,678</div>
              <div className="text-sm text-gray-600">Doanh thu tháng</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* System Health */}
              <Card className="p-6">
                <h2 className="text-xl mb-6">Tình trạng hệ thống</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="mb-1">Database</div>
                        <div className="text-sm text-gray-600">Hoạt động bình thường</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="mb-1">API Server</div>
                        <div className="text-sm text-gray-600">Uptime: 99.9%</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="mb-1">Email Service</div>
                        <div className="text-sm text-gray-600">Queue: 145 pending</div>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>
                  </div>
                </div>
              </Card>

              {/* Pending Approvals */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl">Chờ duyệt</h2>
                  <Badge className="bg-orange-100 text-orange-700">24 items</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="mb-1">Công ty mới đăng ký</div>
                      <div className="text-sm text-gray-600">12 công ty chờ xác minh</div>
                    </div>
                    <Button size="sm" className="bg-[#f26b38] hover:bg-[#e05a27]">
                      Xem
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="mb-1">Tin tuyển dụng</div>
                      <div className="text-sm text-gray-600">8 tin chờ kiểm duyệt</div>
                    </div>
                    <Button size="sm" className="bg-[#f26b38] hover:bg-[#e05a27]">
                      Xem
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="mb-1">Báo cáo vi phạm</div>
                      <div className="text-sm text-gray-600">4 báo cáo cần xử lý</div>
                    </div>
                    <Button size="sm" className="bg-[#f26b38] hover:bg-[#e05a27]">
                      Xem
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Recent Activities */}
              <Card className="p-6">
                <h2 className="text-xl mb-6">Hoạt động gần đây</h2>
                <div className="space-y-4">
                  {[
                    { action: "Công ty mới đăng ký", user: "ABC Tech Company", time: "5 phút trước", type: "success" },
                    { action: "Tin tuyển dụng mới", user: "XYZ Solutions", time: "15 phút trước", type: "info" },
                    { action: "Người dùng mới", user: "user@example.com", time: "30 phút trước", type: "success" },
                    { action: "Báo cáo vi phạm", user: "Job ID #12345", time: "1 giờ trước", type: "warning" },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`p-2 rounded-lg ${
                        activity.type === "success" ? "bg-green-100" :
                        activity.type === "warning" ? "bg-yellow-100" :
                        "bg-blue-100"
                      }`}>
                        {activity.type === "success" ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                         activity.type === "warning" ? <AlertCircle className="h-4 w-4 text-yellow-600" /> :
                         <Clock className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm mb-1">{activity.action}</div>
                        <div className="text-xs text-gray-600">{activity.user}</div>
                      </div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Statistics */}
              <Card className="p-6">
                <h3 className="mb-4">Thống kê người dùng</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Ứng viên</span>
                    <div className="flex items-center gap-2">
                      <span>12,456</span>
                      <Badge className="bg-green-100 text-green-700 text-xs">+15%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Nhà tuyển dụng</span>
                    <div className="flex items-center gap-2">
                      <span>1,245</span>
                      <Badge className="bg-green-100 text-green-700 text-xs">+8%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">HR Managers</span>
                    <div className="flex items-center gap-2">
                      <span>456</span>
                      <Badge className="bg-green-100 text-green-700 text-xs">+12%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Admins</span>
                    <span>23</span>
                  </div>
                </div>
              </Card>

              {/* Traffic Stats */}
              <Card className="p-6">
                <h3 className="mb-4">Lưu lượng truy cập</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Hôm nay</span>
                      <span className="text-[#f26b38]">12,345</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Eye className="h-3 w-3" />
                      <span>pageviews</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Tuần này</span>
                      <span className="text-[#f26b38]">89,234</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Tháng này</span>
                      <span className="text-[#f26b38]">345,678</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="mb-4">Quản lý nhanh</h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.navigateTo("manage-users")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Quản lý users
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.navigateTo("manage-companies")}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Quản lý công ty
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.navigateTo("manage-jobs")}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Quản lý tin tuyển dụng
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Báo cáo & phân tích
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
