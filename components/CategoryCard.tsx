import type { ResolvedIcon } from "@/lib/cms/icons";
import Link from "next/link";
import CmsIcon from "@/components/cms/CmsIcon";

interface CategoryCardProps {
  title: string;
  image: string;
  alt: string;
  size?: "large" | "medium" | "wide";
  description?: string;
  href?: string;
  icons?: Record<string, ResolvedIcon>;
}

export default function CategoryCard({
  title,
  image,
  alt,
  size = "large",
  description,
  href = "#",
  icons = {},
}: CategoryCardProps) {
  const aspectClass = {
    large: "aspect-[3/4]",
    medium: "aspect-[3/4]",
    wide: "aspect-[16/9] lg:aspect-[3/4]",
  }[size];

  return (
    <Link
      href={href}
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
        {description && (
          <p className="font-body text-white/70 text-sm leading-relaxed mt-3 ml-8">
            {description}
          </p>
        )}
        {description && (
          <span className="inline-flex items-center gap-2 text-pumpkin mt-3 ml-8">
            <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em]">
              Mehr erfahren
            </span>
            <CmsIcon icon={icons["arrow-right"]} width={12} height={12} className="motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        )}
      </div>
    </Link>
  );
}
