interface CategoryCardProps {
  title: string;
  image: string;
  alt: string;
}

export default function CategoryCard({ title, image, alt }: CategoryCardProps) {
  return (
    <a
      href="#"
      className="group relative block overflow-hidden aspect-[4/5] bg-light-gray"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <span className="inline-block bg-pumpkin text-white font-heading text-[11px] font-bold uppercase tracking-[0.12em] px-4 py-2 transition-colors duration-300 group-hover:bg-burnt-orange">
          {title}
        </span>
      </div>
    </a>
  );
}
