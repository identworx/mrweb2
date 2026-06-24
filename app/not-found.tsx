import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublicLayoutData } from "@/lib/cms/public-layout";

export default async function NotFound() {
  const layout = await getPublicLayoutData();

  return (
    <>
      <Header {...layout.header} />
      <main id="main" className="flex-1 bg-cream">
        <section className="section-padding">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-accent text-text-muted text-xs tracking-[0.3em] uppercase mb-4">
                404
              </p>

              <h1 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.08] mb-6">
                Diese Seite wurde nicht gefunden.
              </h1>

              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-10">
                Die gesuchte Seite existiert nicht oder wurde verschoben.
              </p>

              <Link href="/" className="btn-primary">
                Zur Startseite
              </Link>

              <div className="mt-16 pt-10 border-t border-light-gray">
                <p className="font-heading text-text-muted text-sm font-semibold uppercase tracking-[0.1em] mb-6">
                  Vielleicht suchst du nach
                </p>
                <nav aria-label="Weitere Seiten" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                  <Link href="/kollektionen" className="font-body text-anthracite text-sm hover:text-pumpkin transition-colors duration-300">
                    Kollektionen
                  </Link>
                  <Link href="/materialien" className="font-body text-anthracite text-sm hover:text-pumpkin transition-colors duration-300">
                    Materialien
                  </Link>
                  <Link href="/kataloge" className="font-body text-anthracite text-sm hover:text-pumpkin transition-colors duration-300">
                    Kataloge
                  </Link>
                  <Link href="/kontakt" className="font-body text-anthracite text-sm hover:text-pumpkin transition-colors duration-300">
                    Kontakt
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
