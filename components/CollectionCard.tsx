import Link from "next/link";

interface CollectionCardProps {
  name: string;
  slug: string;
  description: string;
  moodColors: string[];
  fabric: string;
  image: string;
  alt: string;
}

export default function CollectionCard({
  name,
  slug,
  description,
  moodColors,
  fabric,
  image,
  alt,
}: CollectionCardProps) {
  return (
    <Link
      href={`/kollektionen/${slug}`}
      className="group block bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
    >
      {/* Color swatches strip */}
      <div className="flex">
        {moodColors.map((color, i) => (
          <div
            key={i}
            className="flex-1 h-2 transition-all duration-500 group-hover:h-3"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10] bg-light-gray">
        <div
          className="absolute inset-0 bg-cover bg-center img-zoom"
          style={{ backgroundImage: `url('${image}')` }}
          role="img"
          aria-label={alt}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-heading text-anthracite text-lg font-bold group-hover:text-pumpkin transition-colors duration-300">
          {name}
        </h3>

        <p className="font-body text-text-gray text-sm leading-[1.8] mt-2 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mt-5">
          <span className="font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border border-anthracite/15 text-anthracite/50 group-hover:border-pumpkin/30 group-hover:text-pumpkin/70 transition-colors duration-500">
            {fabric}
          </span>

          <span className="flex items-center gap-2 text-pumpkin">
            <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.12em]">
              Kollektion ansehen
            </span>
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="group-hover:translate-x-1 transition-transform duration-300"
            >
              <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
