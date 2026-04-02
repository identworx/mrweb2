interface InspirationCardProps {
  tag: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

export default function InspirationCard({
  tag,
  title,
  description,
  image,
  alt,
}: InspirationCardProps) {
  return (
    <a href="#" className="group flex flex-col sm:flex-row gap-5 md:gap-6">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10] sm:aspect-square sm:w-48 md:w-56 flex-shrink-0 bg-light-gray">
        <div
          className="absolute inset-0 bg-cover bg-center img-zoom"
          style={{ backgroundImage: `url('${image}')` }}
          role="img"
          aria-label={alt}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center py-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-px bg-pumpkin" />
          <span className="text-pumpkin text-[10px] font-heading font-semibold uppercase tracking-[0.15em]">
            {tag}
          </span>
        </div>
        <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold mb-2 group-hover:text-pumpkin transition-colors duration-300 leading-snug">
          {title}
        </h3>
        <p className="font-body text-text-gray text-sm leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </a>
  );
}
