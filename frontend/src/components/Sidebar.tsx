"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, FileText, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleFindJob = () => {
    router.push('/jobs');
    setIsOpen(false);
  };

  const handleCreateCV = () => {
    router.push('/cv-builder');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Sidebar Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <Search className="h-6 w-6" />
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Menu nhanh
        </div>
      </motion.button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-50"
        />
      )}

      {/* Sidebar Content */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Menu nhanh</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Actions */}
          <div className="space-y-4">
            <Button
              onClick={handleFindJob}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
            >
              <Search className="h-5 w-5" />
              Tìm việc ngay
            </Button>

            <Button
              onClick={handleCreateCV}
              variant="outline"
              className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white h-14 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center gap-3"
            >
              <FileText className="h-5 w-5" />
              Tạo CV miễn phí
            </Button>
          </div>

          {/* Quick Links */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Truy cập nhanh</h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  router.push('/companies');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
              >
                🏢 Danh sách công ty
              </button>
              <button
                onClick={() => {
                  router.push('/blog');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
              >
                📝 Blog & Cẩm nang
              </button>
              <button
                onClick={() => {
                  router.push('/dashboard/candidate');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
              >
                👤 Hồ sơ cá nhân
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Thống kê</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">15K+</div>
                <div className="text-xs text-gray-600">Việc làm</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">2.5K+</div>
                <div className="text-xs text-gray-600">Công ty</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
