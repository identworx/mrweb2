import CategoryCard from "./CategoryCard";
import { categories } from "@/lib/data";

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
            Unsere Produkte
          </h2>
        </div>

        {/* Editorial grid - asymmetric layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6">
          {/* First two cards - larger */}
          <div className="lg:col-span-4">
            <CategoryCard {...categories[0]} size="large" />
          </div>
          <div className="lg:col-span-4">
            <CategoryCard {...categories[1]} size="large" />
          </div>
          <div className="lg:col-span-4">
            <CategoryCard {...categories[2]} size="large" />
          </div>

          {/* Bottom row - three smaller cards */}
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
      </div>
    </section>
  );
}
