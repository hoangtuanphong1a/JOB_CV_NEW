"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Check,
  ChevronDown,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseBackendErrors = (message: string) => {
    const errorMap: { email?: string; password?: string; general?: string } =
      {};

    if (message.includes("email should not be empty")) {
      errorMap.email = "Email không được để trống";
    }
    if (message.includes("email must be an email")) {
      errorMap.email = "Email không hợp lệ";
    }
    if (message.includes("password should not be empty")) {
      errorMap.password = "Mật khẩu không được để trống";
    }

    // If no specific errors were parsed, show general error
    if (Object.keys(errorMap).length === 0) {
      errorMap.general = message;
    }

    return errorMap;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Parse backend validation errors
        const backendErrors = parseBackendErrors(
          data.message || "Đăng nhập thất bại"
        );
        setErrors(backendErrors);

        // If it's a general error, show alert
        if (backendErrors.general) {
          alert(backendErrors.general);
        }
        return;
      }

      // Store access token
      localStorage.setItem("access_token", data.access_token);

      // Store user info if needed
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent("userLogin"));

      // Redirect based on user role with proper priority
      // Priority: admin > hr > employer > job_seeker
      const userRoles = data.user?.roles || [];

      if (userRoles.includes("admin")) {
        router.push("/dashboard/admin");
      } else if (userRoles.includes("hr")) {
        router.push("/dashboard/hr");
      } else if (userRoles.includes("employer")) {
        router.push("/dashboard/employer");
      } else if (userRoles.includes("job_seeker")) {
        router.push("/jobs");
      } else {
        // Default fallback for any other roles
        router.push("/jobs");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ general: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Google login attempt");

      // TODO: Implement Google OAuth with real client ID
      // For demo purposes, simulate successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On success, redirect to jobs page for candidates
      router.push("/jobs");
    } catch (error) {
      console.error("Google login failed:", error);
      // TODO: Show error message
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffece6] to-[#fff5f2] relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-200/15 rounded-full blur-2xl"
        />
      </div>

      {/* Animated Gradient Waves */}
      <div className="absolute inset-0 opacity-40">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(242, 107, 56, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 193, 77, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 236, 230, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255, 193, 77, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(242, 107, 56, 0.2) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(255, 236, 230, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 80%, rgba(242, 107, 56, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(255, 193, 77, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(255, 236, 230, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(242, 107, 56, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 193, 77, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 236, 230, 0.4) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Marketing */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20"
        >
          <div className="max-w-lg">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl xl:text-6xl font-bold text-gray-800 mb-6 leading-tight"
            >
              Nhanh chóng, Hiệu quả và Sản xuất
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-700 mb-12 leading-relaxed"
            >
              Tham gia cùng hàng nghìn chuyên gia và nhà tuyển dụng tin tưởng
              nền tảng của chúng tôi để tìm việc mơ ước hoặc tìm kiếm nhân tài
              xuất sắc.
            </motion.p>

            {/* Language Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center space-x-2 mb-8"
            >
              <Globe className="w-5 h-5 text-gray-800" />
              <span className="text-gray-800 text-sm font-medium">
                Tiếng Việt
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </motion.div>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex space-x-8 text-sm text-gray-600"
            >
              <motion.a
                href="#"
                className="hover:text-gray-800 transition-colors hover:scale-105 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Điều khoản
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-gray-800 transition-colors hover:scale-105 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Gói dịch vụ
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-gray-800 transition-colors hover:scale-105 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Liên hệ
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-md"
          >
            {/* Form Card with Glassmorphism */}
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Đăng nhập
                </h2>
                <p className="text-gray-600">Chào mừng bạn trở lại</p>
              </motion.div>

              {/* Social Login Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-3 mb-6"
              >
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-xl"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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

                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-xl"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Đăng nhập với Apple
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Form Fields */}
              <motion.form
                onSubmit={handleLogin}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-5"
              >
                {/* Email Field */}
                <div className="space-y-1">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm ml-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 pr-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm ml-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                      className="border-2 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-orange-500 hover:underline font-medium"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                {/* Sign In Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#f26b38] hover:bg-[#e05a27] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </motion.div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <button
                    onClick={() => router.push("/auth/register")}
                    className="text-orange-500 hover:underline font-medium text-sm"
                  >
                    Chưa có tài khoản? Đăng ký ngay
                  </button>
                </div>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
