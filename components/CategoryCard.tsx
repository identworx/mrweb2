interface CategoryCardProps {
  title: string;
  image: string;
  alt: string;
  size?: "large" | "medium" | "wide";
}

export default function CategoryCard({ title, image, alt, size = "large" }: CategoryCardProps) {
  const aspectClass = {
    large: "aspect-[3/4]",
    medium: "aspect-[3/4]",
    wide: "aspect-[16/9] lg:aspect-[3/4]",
  }[size];

  return (
    <a
      href="#"
      className={`group relative block overflow-hidden ${aspectClass} bg-light-gray`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center img-zoom"
        style={{ backgroundImage: `url('${image}')` }}
        role="img"
        aria-label={alt}
      />
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
        <div className="flex items-center gap-3">
          <div className="w-5 h-px bg-pumpkin transition-all duration-500 group-hover:w-8" />
          <span className="font-heading text-white text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300">
            {title}
          </span>
        </div>
      </div>
    </a>
  );
}
