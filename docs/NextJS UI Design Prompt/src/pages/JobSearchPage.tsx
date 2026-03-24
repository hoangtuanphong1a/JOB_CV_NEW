import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { JobSearchContent } from "../components/JobSearchContent";

export function JobSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <JobSearchContent />
      <Footer />
    </div>
  );
}
