import React from "react";
import { motion } from "framer-motion";

interface FilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "all", label: "Tất cả mẫu", count: "16" },
    { id: "professional", label: "Chuyên nghiệp", count: "6" },
    { id: "modern", label: "Hiện đại", count: "5" },
    { id: "creative", label: "Sáng tạo", count: "5" },
  ];

  return (
    <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
      <div className="flex items-center justify-center">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.id
                ? "text-blue-700 bg-blue-50 border border-blue-100 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {/* Active Tab Indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            
            {/* Tab Content */}
            <span className="relative z-10 flex items-center gap-2">
              {tab.label}
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === tab.id 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {tab.count}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTabs;