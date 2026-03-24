"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email không được để trống");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Forgot password failed:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
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
                  Kiểm tra email của bạn
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến{" "}
                  <span className="font-semibold text-gray-800">{email}</span>.
                  Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Không nhận được email? Kiểm tra thư mục spam hoặc thử lại sau vài phút.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/auth/login")}
                    className="w-full h-12 bg-[#f26b38] hover:bg-[#e05a27] text-white font-semibold rounded-xl transition-all duration-300"
                  >
                    Quay lại đăng nhập
                  </Button>
                  <Button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-xl"
                  >
                    Thử email khác
                  </Button>
                </div>
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
              Đặt lại mật khẩu
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-700 mb-12 leading-relaxed"
            >
              Đừng lo lắng! Chúng tôi sẽ giúp bạn đặt lại mật khẩu một cách nhanh chóng và an toàn.
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
                  Quên mật khẩu?
                </h2>
                <p className="text-gray-600">
                  Nhập email để nhận link đặt lại mật khẩu
                </p>
              </motion.div>

              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-6"
              >
                <button
                  onClick={() => router.push("/auth/login")}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Quay lại đăng nhập</span>
                </button>
              </motion.div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
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
                        error
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm ml-1">{error}</p>
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
                    {isLoading ? "Đang gửi..." : "Gửi link đặt lại"}
                  </Button>
                </motion.div>

                {/* Help Text */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Nhớ mật khẩu rồi?{" "}
                    <button
                      type="button"
                      onClick={() => router.push("/auth/login")}
                      className="text-orange-500 hover:underline font-medium"
                    >
                      Đăng nhập ngay
                    </button>
                  </p>
                </div>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}