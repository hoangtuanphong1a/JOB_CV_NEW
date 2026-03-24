import React from "react";
import { motion } from "framer-motion";

const SkeletonCVCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-gray-200 rounded-xl animate-pulse" />
          <div className="flex-1 h-10 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonCVCard;