import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-[1400px] px-5 md:px-10 pt-28 md:pt-36 pb-4"
    >
      <ol className="flex flex-wrap items-center gap-1.5 font-body text-xs text-text-gray/50">
        <li>
          <Link
            href="/"
            className="hover:text-pumpkin transition-colors duration-300"
          >
            Startseite
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span className="text-text-gray/30">/</span>
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-pumpkin transition-colors duration-300"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-gray/70">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
