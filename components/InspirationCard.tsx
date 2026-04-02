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
    <a href="#" className="group block">
      <div className="relative overflow-hidden aspect-[3/2] mb-4 bg-light-gray">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${image}')` }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-pumpkin text-white text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1">
            {tag}
          </span>
        </div>
      </div>
      <h3 className="font-heading text-anthracite text-lg font-bold mb-2 group-hover:text-pumpkin transition-colors duration-200">
        {title}
      </h3>
      <p className="font-body text-text-gray text-sm leading-relaxed line-clamp-3">
        {description}
      </p>
    </a>
  );
}
