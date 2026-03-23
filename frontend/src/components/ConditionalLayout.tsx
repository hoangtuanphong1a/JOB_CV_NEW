"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isDashboardPage = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isAuthPage && !isDashboardPage && <Header />}
      <main className={isAuthPage ? "" : "min-h-screen"}>
        {children}
      </main>
      {!isAuthPage && !isDashboardPage && <Footer />}
    </>
  );
}
