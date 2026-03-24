"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Mail, Globe, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const hasVerified = React.useRef(false);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: verificationToken }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.message || "Xác minh email thất bại");
        return;
      }

      setStatus("success");
    } catch (error) {
      console.error("Email verification failed:", error);
      setStatus("error");
      setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    if (token && !hasVerified.current) {
      hasVerified.current = true;
      // Use setTimeout to avoid calling setState synchronously
      setTimeout(() => {
        verifyEmail(token);
      }, 0);
    }
  }, [token]);

  const handleResendEmail = async () => {
    // TODO: Implement resend verification email
    // This would need the user's email, which we don't have in this context
    // You might want to redirect to a page where they can enter their email
    router.push("/auth/login");
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
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Link không hợp lệ
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Link xác minh email không hợp lệ hoặc đã hết hạn.
                </p>
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full h-12 bg-[#f26b38] hover:bg-[#e05a27] text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Về trang đăng nhập
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
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
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Đang xác minh...
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Vui lòng chờ trong giây lát.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (status === "success") {
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
                  Xác minh thành công!
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Email của bạn đã được xác minh thành công. Bạn có thể đăng nhập vào tài khoản ngay bây giờ.
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

  // Error state
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
              Xác minh email
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-700 mb-12 leading-relaxed"
            >
              Xác minh email giúp bảo vệ tài khoản của bạn và đảm bảo bạn nhận được các thông báo quan trọng.
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

        {/* Right Side - Error */}
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
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Xác minh thất bại
                </h2>
                <p className="text-gray-600">
                  {errorMessage}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-4"
              >
                <Button
                  onClick={handleResendEmail}
                  className="w-full h-12 bg-[#f26b38] hover:bg-[#e05a27] text-white font-semibold rounded-xl transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Gửi lại email xác minh
                </Button>
                <Button
                  onClick={() => router.push("/auth/login")}
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-xl"
                >
                  Về trang đăng nhập
                </Button>
              </motion.div>

              {/* Help Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-gray-500">
                  Vấn đề vẫn tiếp diễn?{" "}
                  <a href="#" className="text-orange-500 hover:underline font-medium">
                    Liên hệ hỗ trợ
                  </a>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#ffece6] to-[#fff5f2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}