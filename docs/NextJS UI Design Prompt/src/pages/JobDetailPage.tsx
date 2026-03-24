import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { JobDetailContent } from "../components/JobDetailContent";

export function JobDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <JobDetailContent />
      <Footer />
    </div>
  );
}
