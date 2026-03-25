"use client";

import AdminLayout from "@/components/layouts/AdminLayout";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  return <AdminLayout>{children}</AdminLayout>;
}