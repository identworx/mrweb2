import { galleryImages } from "@/lib/data";

export default function GallerySection() {
  return (
    <section className="py-16 md:py-24 bg-anthracite">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="text-center mb-12">
          <p className="font-accent text-pumpkin text-sm tracking-[0.2em] uppercase mb-2">
            Entdecke die
          </p>
          <h2 className="font-heading text-white text-3xl md:text-4xl font-bold">
            MOSAROMA Kollektion
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px] gap-3 md:gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden group ${img.span}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${img.src}')` }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
