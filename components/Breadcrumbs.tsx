import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: "dark" | "light";
}

export default function Breadcrumbs({
  items,
  variant = "dark",
}: BreadcrumbsProps) {
  const isLight = variant === "light";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`mx-auto max-w-[1400px] px-5 md:px-10 pb-4 ${
        isLight ? "pt-4" : "pt-28 md:pt-36"
      }`}
    >
      <ol
        className={`flex flex-wrap items-center gap-1.5 font-body text-xs ${
          isLight ? "text-white/50" : "text-text-gray/50"
        }`}
      >
        <li>
          <Link
            href="/"
            className={`transition-colors duration-300 ${
              isLight
                ? "hover:text-white"
                : "hover:text-pumpkin"
            }`}
          >
            Startseite
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span className={isLight ? "text-white/30" : "text-text-gray/30"}>
              /
            </span>
            {item.href ? (
              <Link
                href={item.href}
                className={`transition-colors duration-300 ${
                  isLight
                    ? "hover:text-white"
                    : "hover:text-pumpkin"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLight ? "text-white/70" : "text-text-gray/70"}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
