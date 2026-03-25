"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import Header from "./header";
import { Footer } from "./footer";

const LayoutContainer = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();
  const hideHeaderFooter = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.NEW].some((route) =>
    pathname.startsWith(route)
  );

  return (
    <div className="flex flex-col min-h-screen w-full">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1 ">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default LayoutContainer;
