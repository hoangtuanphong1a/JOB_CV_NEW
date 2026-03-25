'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface Props {
  className?: HTMLDivElement['className'];
}

const BgGradient = ({ className }: Props) => {
  return (
    <div className={cn('absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50', className)}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-0 left-0 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/20 to-cyan-400/20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, 100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 blur-3xl"
      />
    </div>
  );
};

export { BgGradient };
