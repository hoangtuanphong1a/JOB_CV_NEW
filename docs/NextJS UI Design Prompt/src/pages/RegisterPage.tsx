import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Briefcase } from "lucide-react";

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f26b38] to-[#e05a27] mx-auto mb-4">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl mb-2">Đăng ký CVKing</h1>
          <p className="text-gray-600">Tạo tài khoản để bắt đầu</p>
        </div>

        <Tabs defaultValue="candidate" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="candidate">Ứng viên</TabsTrigger>
            <TabsTrigger value="employer">Nhà tuyển dụng</TabsTrigger>
          </TabsList>

          <TabsContent value="candidate" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input placeholder="Nguyễn Văn A" />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="your@email.com" />
            </div>

            <div className="space-y-2">
              <Label>Mật khẩu</Label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <div className="space-y-2">
              <Label>Xác nhận mật khẩu</Label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox className="mt-1" />
              <span className="text-sm text-gray-600">
                Tôi đồng ý với{" "}
                <a href="#" className="text-[#f26b38] hover:underline">
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a href="#" className="text-[#f26b38] hover:underline">
                  Chính sách bảo mật
                </a>
              </span>
            </label>

            <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27]" size="lg">
              Đăng ký
            </Button>
          </TabsContent>

          <TabsContent value="employer" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label>Tên công ty</Label>
              <Input placeholder="Công ty ABC" />
            </div>

            <div className="space-y-2">
              <Label>Email công ty</Label>
              <Input type="email" placeholder="hr@company.com" />
            </div>

            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input placeholder="0987654321" />
            </div>

            <div className="space-y-2">
              <Label>Mật khẩu</Label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox className="mt-1" />
              <span className="text-sm text-gray-600">
                Tôi đồng ý với{" "}
                <a href="#" className="text-[#f26b38] hover:underline">
                  Điều khoản dịch vụ
                </a>
              </span>
            </label>

            <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27]" size="lg">
              Đăng ký
            </Button>
          </TabsContent>
        </Tabs>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Hoặc đăng ký với</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" size="lg">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Đăng ký với Google
        </Button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Đã có tài khoản?{" "}
          <a href="#" className="text-[#f26b38] hover:underline">
            Đăng nhập
          </a>
        </p>
      </Card>
    </div>
  );
}
