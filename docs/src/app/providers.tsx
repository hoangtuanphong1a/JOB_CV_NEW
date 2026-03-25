"use client";

import React, { ReactNode, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { BreadcrumbProvider } from "@/contexts/BreadcumbContext";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        // staleTime: 1000 * 60 * 5,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => getQueryClient(), []);

  return (
    <BreadcrumbProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-center"
          richColors
          className="text-center [&_li]:justify-center"
        />
        {children}
        <NextTopLoader
          color="oklch(0.7529 0.1271 234.97)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2.3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow={false}
        />
      </QueryClientProvider>
    </BreadcrumbProvider>
  );
}
