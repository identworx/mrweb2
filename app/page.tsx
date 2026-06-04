import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import BrandPromisesSection from "@/components/BrandPromisesSection";
import SplitHighlightSection from "@/components/SplitHighlightSection";
import MaterialTechnologySection from "@/components/MaterialTechnologySection";
import FabricQualitiesSection from "@/components/FabricQualitiesSection";
import SustainabilitySection from "@/components/SustainabilitySection";
import CollectionsSection from "@/components/CollectionsSection";
import InspirationSection from "@/components/InspirationSection";
import CatalogsSection from "@/components/CatalogsSection";
import NewsPreviewSection from "@/components/NewsPreviewSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <BrandPromisesSection />
        <SplitHighlightSection />
        <MaterialTechnologySection />
        <FabricQualitiesSection />
        <SustainabilitySection />
        <CollectionsSection />
        <InspirationSection />
        <CatalogsSection />
        <NewsPreviewSection />
      </main>
      <Footer />
    </>
  );
}
