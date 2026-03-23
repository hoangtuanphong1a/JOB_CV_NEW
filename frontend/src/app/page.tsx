"use client";

import React from "react";
import { Hero } from "@/components/hero/Hero";
import { JobCategories } from "@/components/JobCategories";
import { FeaturedJobs } from "@/components/FeaturedJobs";
import { FeaturedCompanies } from "@/components/FeaturedCompanies";
import { BlogPreview } from "@/components/BlogPreview";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  return (
    <div>
      <Hero />
      <JobCategories />
      <FeaturedJobs />
      <FeaturedCompanies />
      <BlogPreview />
      <Sidebar />
    </div>
  );
}
