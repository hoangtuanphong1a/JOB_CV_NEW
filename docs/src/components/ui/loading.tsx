import React, { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'default';
  fullScreen?: boolean;
}

const Loading = ({ className, size = 'sm', fullScreen = false, color = 'default', ...props }: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const containerClasses = cn(
    'flex items-center justify-center',
    fullScreen ? 'fixed inset-0 z-50 bg-white' : 'h-full',
    className
  );

  return (
    <div className={containerClasses} {...props}>
      <div
        className={cn('animate-spin rounded-full border-b-2', sizeClasses[size], {
          'border-white': color === 'white',
          'border-primary': color === 'default',
        })}
        aria-busy="true"
        aria-label="Loading..."
      />
    </div>
  );
};

const LoadingScreen = (props: Omit<LoadingProps, 'fullScreen'>) => <Loading size="md" {...props} fullScreen />;

export { Loading, LoadingScreen };
