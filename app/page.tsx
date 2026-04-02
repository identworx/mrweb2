import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import SplitHighlightSection from "@/components/SplitHighlightSection";
import InspirationSection from "@/components/InspirationSection";
import GallerySection from "@/components/GallerySection";
import DealerCtaSection from "@/components/DealerCtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <SplitHighlightSection />
        <InspirationSection />
        <GallerySection />
        <DealerCtaSection />
      </main>
      <Footer />
    </>
  );
}
