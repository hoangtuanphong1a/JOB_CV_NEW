import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Building2, MapPin, Users, Calendar, Globe, Briefcase } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function CompanyDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Company Header */}
          <Card className="p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#f26b38] to-[#e05a27] flex items-center justify-center flex-shrink-0">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl mb-2">TechViet Solutions</h1>
                <p className="text-lg text-gray-600 mb-4">Công ty công nghệ hàng đầu Việt Nam</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>500-1000 nhân viên</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Hà Nội, Việt Nam</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Thành lập 2015</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href="#" className="hover:text-[#f26b38]">www.techviet.com</a>
                  </div>
                </div>
              </div>
              <Button size="lg" className="bg-[#f26b38] hover:bg-[#e05a27]">
                Theo dõi
              </Button>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-6">
                <h2 className="text-xl mb-4">Về công ty</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    TechViet Solutions là một trong những công ty công nghệ hàng đầu tại Việt Nam, 
                    chuyên cung cấp các giải pháp phần mềm và dịch vụ CNTT cho khách hàng trong và ngoài nước.
                  </p>
                  <p>
                    Với đội ngũ hơn 500 chuyên gia giàu kinh nghiệm, chúng tôi cam kết mang đến những sản phẩm 
                    và dịch vụ chất lượng cao nhất, đồng thời tạo môi trường làm việc chuyên nghiệp và năng động.
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl mb-6">Vị trí tuyển dụng ({12})</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-[#f26b38] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg mb-2">Senior Frontend Developer</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>Hà Nội</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>Full-time</span>
                            </div>
                            <span>30-45 triệu</span>
                          </div>
                        </div>
                        <Button variant="outline" className="border-[#f26b38] text-[#f26b38] hover:bg-orange-50">
                          Ứng tuyển
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Xem tất cả {12} vị trí
                </Button>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-4">Thông tin liên hệ</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">Địa chỉ</div>
                    <div>Tòa nhà ABC, Đường XYZ, Hà Nội</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Email</div>
                    <div>hr@techviet.com</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Điện thoại</div>
                    <div>(024) 1234 5678</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Lĩnh vực</h3>
                <div className="flex flex-wrap gap-2">
                  {["Công nghệ", "Phần mềm", "AI", "Cloud"].map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
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
