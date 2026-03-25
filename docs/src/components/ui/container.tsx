'use client';

import React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp ref={ref} className={cn('container mx-auto w-full px-4 sm:px-6 lg:px-8', className)} {...props}>
        {children}
      </Comp>
    );
  }
);

Container.displayName = 'Container';

export { Container };
