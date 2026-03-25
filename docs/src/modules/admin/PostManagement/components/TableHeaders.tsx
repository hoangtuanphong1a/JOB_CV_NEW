import React from 'react';

// Reusable header components
export const CenteredHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm flex  whitespace-normal break-words justify-center items-center w-full text-center">
    {children}
  </div>
);

export const LeftHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex text-sm font-bold w-full justify-between ${className}`}>{children}</div>
);
export const RightHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex text-sm font-bold w-full justify-between text-right">{children}</div>
);
