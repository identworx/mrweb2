import Link from "next/link";
import Image from "next/image";

interface NewsCardProps {
  title: string;
  tag: string;
  date: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
  isPlaceholder?: boolean;
}

export default function NewsCard({
  title,
  tag,
  date,
  description,
  slug,
  imageUrl,
  isPlaceholder = false,
}: NewsCardProps) {
  return (
    <Link
      href={`/neuigkeiten/${slug}`}
      className="group block bg-white transition-all duration-500 motion-safe:hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden"
    >
      {isPlaceholder && (
        <span className="absolute top-3 right-3 z-10 font-body text-[10px] text-text-gray/60 italic">
          (Platzhalter)
        </span>
      )}

      {imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden bg-cream">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}

      <div className="p-6 md:p-7">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-pumpkin/10 text-pumpkin">
            {tag}
          </span>
          <span className="font-body text-text-gray/50 text-xs">{date}</span>
        </div>

        <h3 className="font-heading text-anthracite text-base md:text-lg font-bold leading-snug mb-2.5 group-hover:text-pumpkin transition-colors duration-300">
          {title}
        </h3>

        <p className="font-body text-text-gray text-sm leading-[1.7] line-clamp-2">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-pumpkin">
          <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.12em]">
            Weiterlesen
          </span>
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            className="motion-safe:group-hover:translate-x-1 transition-transform duration-300"
            aria-hidden="true"
          >
            <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
