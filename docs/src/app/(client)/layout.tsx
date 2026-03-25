"use client";

import LayoutContainer from "@/components/layouts/LayoutContainer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutContainer>{children}</LayoutContainer>;
}
