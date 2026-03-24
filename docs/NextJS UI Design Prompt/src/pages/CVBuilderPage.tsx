import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CVBuilderContent } from "../components/CVBuilderContent";

export function CVBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CVBuilderContent />
      <Footer />
    </div>
  );
}
