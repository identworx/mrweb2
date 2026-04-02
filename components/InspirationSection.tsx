import InspirationCard from "./InspirationCard";
import { inspirations } from "@/lib/data";

export default function InspirationSection() {
  return (
    <section id="inspiration" className="section-padding bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left intro */}
          <div className="lg:col-span-3">
            <h2 className="font-heading text-anthracite text-3xl md:text-4xl font-bold leading-tight mb-4">
              Lass dich
              <br />
              inspirieren!
            </h2>
            <p className="font-body text-text-gray text-base leading-relaxed mb-6">
              Entdecke unsere aktuellen Kataloge, Trends und Ratgeber. Lass
              dich inspirieren und tauche ein in die MOSAROMA-Welt.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["Alle", "Kataloge", "Trends", "Ratgeber", "Ideen"].map(
                (filter) => (
                  <button
                    key={filter}
                    className={`font-heading text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 transition-colors duration-200 ${
                      filter === "Alle"
                        ? "bg-anthracite text-white"
                        : "text-text-gray hover:text-anthracite border border-medium-gray hover:border-anthracite"
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Cards */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {inspirations.map((item) => (
                <InspirationCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
