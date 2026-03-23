"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Users } from 'lucide-react';

export function Stats() {
  const stats = [
    {
      icon: Briefcase,
      value: '10,000+',
      label: 'Việc làm'
    },
    {
      icon: Building2,
      value: '5,000+',
      label: 'Công ty'
    },
    {
      icon: Users,
      value: '50,000+',
      label: 'Ứng viên'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="grid grid-cols-3 gap-8 lg:gap-12"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-orange-100 rounded-full mb-3">
            <stat.icon className="w-6 h-6 lg:w-8 lg:h-8 text-orange-500" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
            {stat.value}
          </div>
          <div className="text-sm lg:text-base text-gray-600">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
