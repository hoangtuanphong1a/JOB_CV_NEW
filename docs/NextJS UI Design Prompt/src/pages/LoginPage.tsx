import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Briefcase, AlertCircle, Loader2 } from "lucide-react";
import { useAuth, UserRole } from "../contexts/AuthContext";
import { Alert, AlertDescription } from "../components/ui/alert";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("job-seeker");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password, selectedRole);
      // Navigation will be handled automatically by App.tsx
    } catch (err) {
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle(selectedRole);
    } catch (err) {
      setError("Đăng nhập với Google thất bại");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions: { value: UserRole; label: string; description: string }[] = [
    {
      value: "job-seeker",
      label: "Ứng viên",
      description: "Tìm kiếm và ứng tuyển việc làm",
    },
    {
      value: "employer",
      label: "Nhà tuyển dụng",
      description: "Đăng tin và tìm ứng viên",
    },
    {
      value: "hr",
      label: "HR Manager",
      description: "Quản lý tuyển dụng công ty",
    },
    {
      value: "admin",
      label: "Quản trị viên",
      description: "Quản lý hệ thống",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f26b38] to-[#e05a27] mx-auto mb-4">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl mb-2">Đăng nhập CVKing</h1>
          <p className="text-gray-600">Chào mừng bạn trở lại!</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Role Selection */}
        <div className="mb-6">
          <Label className="mb-3 block">Đăng nhập với vai trò</Label>
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedRole === role.value
                    ? "border-[#f26b38] bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-sm mb-1">{role.label}</div>
                <div className="text-xs text-gray-500">{role.description}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Mật khẩu</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={loading}
              />
              <span className="text-sm">Ghi nhớ đăng nhập</span>
            </label>
            <button
              type="button"
              className="text-sm text-[#f26b38] hover:underline"
              disabled={loading}
            >
              Quên mật khẩu?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#f26b38] hover:bg-[#e05a27]"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Hoặc đăng nhập với</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Đăng nhập với Google
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => window.navigateTo("register")}
            className="text-[#f26b38] hover:underline"
            disabled={loading}
          >
            Đăng ký ngay
          </button>
        </p>

        {/* Demo Accounts Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">💡 Demo accounts (dùng bất kỳ email/password):</p>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• <strong>Job Seeker:</strong> Xem dashboard ứng viên</div>
            <div>• <strong>Employer:</strong> Đăng tin, quản lý tuyển dụng</div>
            <div>• <strong>HR Manager:</strong> Quản lý tuyển dụng nâng cao</div>
            <div>• <strong>Admin:</strong> Quản trị toàn hệ thống</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
