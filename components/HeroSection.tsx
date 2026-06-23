import Link from "next/link";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

interface HeroSectionProps {
  icons?: Record<string, ResolvedIcon>;
}

export default function HeroSection({ icons = {} }: HeroSectionProps) {
  return (
    <section className="relative w-full h-screen min-h-[700px] max-h-[1100px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "url('/Luxury-Outdoor-Space-with-Premium-Garden-Furniture.jpg')",
          backgroundPosition: "center 45%",
        }}
      />

      {/* Overlay 1: Strong bottom-to-top scrim */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.65) 22%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.08) 65%, transparent 80%)",
        }}
      />
      {/* Overlay 2: Left scrim */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.20) 30%, transparent 55%)",
        }}
      />
      {/* Overlay 3: Top scrim for header */}
      <div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/30 to-transparent"
        style={{ height: "28%" }}
      />

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 lg:px-12 pb-20 md:pb-28 lg:pb-32">
          <div className="max-w-xl lg:max-w-[620px]">

            {/* Subheadline */}
            <p className="font-accent text-pumpkin-accessible text-xs tracking-[0.3em] uppercase mb-6">
              Hochwertige Outdoor-Textilien
            </p>

            {/* Headline */}
            <h1 className="font-heading text-white text-[2.75rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-extrabold leading-[1.02] tracking-[-0.02em] mb-6 md:mb-8">
              Design trifft
              <br />
              Performance.
            </h1>

            {/* Subline */}
            <p className="font-heading text-white/90 text-lg md:text-xl lg:text-2xl font-medium leading-snug mb-4 max-w-[28rem] md:max-w-[32rem]">
              Hochwertige Outdoor-Textilien für Räume und Momente, die bleiben.
            </p>

            {/* Text */}
            <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.75] mb-10 md:mb-12 max-w-[28rem] md:max-w-[32rem]">
              Mosaroma verbindet anspruchsvolles Design, langlebige Materialien
              und zuverlässige Outdoor-Performance für Garten, Terrasse,
              Hospitality und Fachhandel.
            </p>

            {/* Two CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/kollektionen" className="btn-primary">
                Kollektionen entdecken
                <CmsIcon icon={icons["arrow-right"]} width={14} height={14} />
              </Link>
              <Link href="/kataloge" className="btn-outline-white">
                Katalog ansehen
                <CmsIcon icon={icons["arrow-right"]} width={14} height={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent motion-safe:animate-pulse" />
      </div>

      {/* Side accent */}
      <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <div className="w-px h-12 bg-white/[0.08]" />
        <span className="font-accent text-white/[0.12] text-[9px] tracking-[0.35em] uppercase" style={{ writingMode: "vertical-rl" }}>
          MOSAROMA
        </span>
        <div className="w-px h-12 bg-white/[0.08]" />
      </div>
    </section>
  );
}
