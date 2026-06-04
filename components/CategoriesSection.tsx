import CategoryCard from "./CategoryCard";
import { categories, additionalCategories } from "@/lib/data";

export default function CategoriesSection() {
  return (
    <section id="produkte" className="section-padding bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Section Header */}
        <div className="mb-14 md:mb-20">
          <div className="flex items-center gap-4 mb-5">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
              Entdecken
            </p>
          </div>
          <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
            Produktkategorien
          </h2>
        </div>

        {/* Editorial grid - asymmetric layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6">
          {/* First row - three large cards */}
          <div className="lg:col-span-4">
            <CategoryCard {...categories[0]} size="large" />
          </div>
          <div className="lg:col-span-4">
            <CategoryCard {...categories[1]} size="large" />
          </div>
          <div className="lg:col-span-4">
            <CategoryCard {...categories[2]} size="large" />
          </div>

          {/* Second row - 3+6+3 */}
          <div className="lg:col-span-3">
            <CategoryCard {...categories[3]} size="medium" />
          </div>
          <div className="lg:col-span-6">
            <CategoryCard {...categories[4]} size="wide" />
          </div>
          <div className="lg:col-span-3">
            <CategoryCard {...categories[5]} size="medium" />
          </div>
        </div>

        {/* Additional categories */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <span className="font-body text-text-gray text-sm mr-2">Weitere Kategorien:</span>
          {additionalCategories.map((cat) => (
            <a
              key={cat.title}
              href={cat.href}
              className="font-heading text-[11px] font-semibold uppercase tracking-[0.12em] px-5 py-2.5 border border-anthracite/15 text-anthracite hover:bg-anthracite hover:text-white transition-all duration-300"
            >
              {cat.title}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
