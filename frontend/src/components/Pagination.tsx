import React from "react";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      // Show all pages if total pages is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first 3, last 3, and current page with ellipsis
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push(-1); // Ellipsis indicator
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push(-1); // Ellipsis indicator
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`p-2 rounded-xl transition-all duration-200 ${
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === -1) {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-400">
                ...
              </span>
            );
          }

          return (
            <motion.button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: currentPage === page ? 1.05 : 1,
                backgroundColor: currentPage === page ? "#2563eb" : "transparent",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {page}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-xl transition-all duration-200 ${
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;