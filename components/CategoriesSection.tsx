import CategoryCard from "./CategoryCard";
import { categories } from "@/lib/data";

export default function CategoriesSection() {
  return (
    <section id="produkte" className="section-padding bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-anthracite text-3xl md:text-4xl font-bold tracking-tight">
            Unsere Produkte
          </h2>
          <div className="mt-4 mx-auto w-12 h-[2px] bg-pumpkin" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
