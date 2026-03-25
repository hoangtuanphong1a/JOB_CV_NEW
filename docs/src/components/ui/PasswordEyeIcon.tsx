// Simple Eye and EyeOff SVG React components for password visibility toggle
import React from 'react';

export const Eye = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
    <path
      d="M10 4C5 4 1.73 7.11 0.5 10c1.23 2.89 4.5 6 9.5 6s8.27-3.11 9.5-6C18.27 7.11 15 4 10 4zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6a2 2 0 100 4 2 2 0 000-4z"
      fill="currentColor"
    />
  </svg>
);

export const EyeOff = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
    <path
      d="M1 1l18 18M4.22 4.22A9.77 9.77 0 001 10c1.23 2.89 4.5 6 9.5 6a9.77 9.77 0 004.78-1.22M15.78 15.78A9.77 9.77 0 0019 10c-1.23-2.89-4.5-6-9.5-6a9.77 9.77 0 00-4.78 1.22M9 9a2 2 0 012 2m-2-2a2 2 0 002 2m-2-2l-5.5 5.5m13-13l-5.5 5.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
