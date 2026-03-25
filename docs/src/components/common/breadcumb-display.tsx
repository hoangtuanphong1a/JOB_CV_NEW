import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import React from 'react';
import { useBreadcrumb } from '@/contexts/BreadcumbContext';

function BreadcrumbDisplay() {
    const { currentPath } = useBreadcrumb();

    return (
        <>
            {currentPath.map((item, index) => (
                <React.Fragment key={item.id}>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{item.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                    {index < currentPath.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
            ))}
        </>
    );
}

export default BreadcrumbDisplay;