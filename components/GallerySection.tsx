import { galleryImages } from "@/lib/data";

export default function GallerySection() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-anthracite overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-px bg-pumpkin/60" />
            <p className="font-accent text-pumpkin/80 text-xs tracking-[0.3em] uppercase">
              Galerie
            </p>
            <div className="w-8 h-px bg-pumpkin/60" />
          </div>
          <h2 className="font-heading text-white text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight">
            MOSAROMA Kollektion
          </h2>
          <p className="font-body text-white/40 text-base md:text-lg mt-4 max-w-lg mx-auto leading-relaxed">
            Impressionen aus der Welt von MOSAROMA – kuratiert für
            anspruchsvolle Ästhetik.
          </p>
        </div>

        {/* Curated masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px] lg:auto-rows-[260px]">
          {/* Large feature image */}
          <div className="col-span-2 md:col-span-5 row-span-2 relative overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center img-zoom"
              style={{ backgroundImage: `url('${galleryImages[0].src.replace("w=500&h=500", "w=800&h=900")}')` }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
          </div>

          {/* Top right */}
          <div className="md:col-span-4 relative overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center img-zoom"
              style={{ backgroundImage: `url('${galleryImages[1].src}')` }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
          </div>

          <div className="md:col-span-3 relative overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center img-zoom"
              style={{ backgroundImage: `url('${galleryImages[2].src}')` }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
          </div>

          {/* Bottom right */}
          <div className="md:col-span-3 relative overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center img-zoom"
              style={{ backgroundImage: `url('${galleryImages[3].src}')` }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
          </div>

          <div className="md:col-span-4 relative overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center img-zoom"
              style={{ backgroundImage: `url('${galleryImages[4].src}')` }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
