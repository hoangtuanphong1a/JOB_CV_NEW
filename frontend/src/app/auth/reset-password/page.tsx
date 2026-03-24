"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle, Globe, ChevronDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (!token) {
      setErrors({ general: "Link đặt lại mật khẩu không hợp lệ" });
    }
  }, [token]);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrors({ general: "Link đặt lại mật khẩu không hợp lệ" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || "Có lỗi xảy ra. Vui lòng thử lại." });
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Reset password failed:", error);
      setErrors({ general: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ffece6] to-[#fff5f2] relative overflow-hidden">
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
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Link không hợp lệ
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.
                </p>
                <Button
                  onClick={() => router.push("/auth/forgot-password")}
                  className="w-full h-12 bg-[#f26b38] hover:bg-[#e05a27] text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Yêu cầu link mới
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ffece6] to-[#fff5f2] relative overflow-hidden">
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
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Đặt lại mật khẩu thành công
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới.
                </p>
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full h-12 bg-[#f26b38] hover:bg-[#e05a27] text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Đăng nhập ngay
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
              Tạo mật khẩu mới
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-700 mb-12 leading-relaxed"
            >
              Tạo mật khẩu mới cho tài khoản của bạn. Đảm bảo mật khẩu đủ mạnh và dễ nhớ.
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

        {/* Right Side - Form */}
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
                  Đặt lại mật khẩu
                </h2>
                <p className="text-gray-600">
                  Nhập mật khẩu mới của bạn
                </p>
              </motion.div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-5"
              >
                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm">{errors.general}</p>
                  </div>
                )}

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu mới"
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
                    <p className="text-red-500 text-sm ml-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 pr-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm ml-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#f26b38] hover:bg-[#e05a27] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                  </Button>
                </motion.div>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Yêu cầu mật khẩu:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className={`flex items-center ${password.length >= 6 ? 'text-green-600' : ''}`}>
                      <span className="mr-2">{password.length >= 6 ? '✓' : '•'}</span>
                      Ít nhất 6 ký tự
                    </li>
                    <li className={`flex items-center ${password === confirmPassword && confirmPassword ? 'text-green-600' : ''}`}>
                      <span className="mr-2">{password === confirmPassword && confirmPassword ? '✓' : '•'}</span>
                      Mật khẩu xác nhận khớp
                    </li>
                  </ul>
                </div>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#ffece6] to-[#fff5f2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}