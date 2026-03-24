import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FeaturedCompanies } from "../components/FeaturedCompanies";
import { CompanyListHero } from "../components/CompanyListHero";

export function CompanyListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CompanyListHero />
      <div className="pb-8">
        <FeaturedCompanies />
      </div>
      <Footer />
    </div>
  );
}