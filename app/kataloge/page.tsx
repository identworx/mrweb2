import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import DownloadCard from "@/components/DownloadCard";
import { downloads } from "@/lib/mosaroma/downloads";

export const metadata: Metadata = {
  title: "Kataloge & Downloads | Mosaroma",
  description:
    "Alle Kataloge, technischen Datenblätter und Dokumente von MOSAROMA zum Ansehen und Herunterladen.",
};

export default function KatalogePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <PageHero
          accent="Downloads"
          title="Kataloge & Downloads"
          description="Hier finden Sie alle Dokumente rund um unsere Produkte, Stoffe und Kollektionen — vom vollständigen Katalog bis zu technischen Datenblättern."
        />

        {/* Downloads Grid */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {downloads.map((download) => (
                <DownloadCard
                  key={download.title}
                  title={download.title}
                  description={download.description}
                  type={download.type}
                  languages={download.languages}
                  href={download.href}
                />
              ))}
            </div>

            {/* Note */}
            <p className="font-body text-text-gray/50 text-sm mt-10 text-center italic">
              Downloads werden in Kürze aktiviert.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
