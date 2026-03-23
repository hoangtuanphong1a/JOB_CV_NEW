"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Stats } from "./Stats";
import { SearchBar } from "./SearchBar";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();

  const handleFindJob = () => {
    router.push('/jobs');
  };

  const handleCreateCV = () => {
    router.push('/cv-builder');
  };

  return (
    <section className="relative bg-gradient-to-br from-[#ffece6] to-[#fff5f2] py-16 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-pink-100/20" />
      </div>

      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-8 z-10"
      >
        <Badge className="bg-orange-500 hover:bg-orange-500 text-white px-4 py-2 text-sm font-medium">
          1000+ công việc mới mỗi ngày
        </Badge>
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Tìm công việc <span className="text-orange-500">mơ ước</span>{" "}
                của bạn
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 max-w-lg">
                Kết nối với hàng nghìn công ty uy tín và cơ hội việc làm chất
                lượng cao tại Việt Nam
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={handleFindJob}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Tìm việc ngay
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={handleCreateCV}
                variant="outline"
                className="border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                Tạo CV miễn phí
              </Button>
            </motion.div>

            {/* Stats */}
            <Stats />
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Success Badge Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute bottom-8 left-8 z-20 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">
                Ứng tuyển thành công +1,247 hôm nay
              </span>
            </motion.div>

            {/* Main Image */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="CVKing Job Portal - MacBook and Mobile"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </motion.div>

              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg"
              >
                <Search className="h-6 w-6 text-orange-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Search Bar Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <SearchBar />
        </motion.div>
      </div>
    </section>
  );
}
