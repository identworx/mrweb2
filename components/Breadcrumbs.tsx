import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: "dark" | "light";
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function Breadcrumbs({
  items,
  variant = "dark",
}: BreadcrumbsProps) {
  const isLight = variant === "light";

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={`flex flex-wrap items-center gap-1 font-body text-xs tracking-wide ${
          isLight ? "text-white/50" : "text-text-gray/50"
        }`}
      >
        <li>
          <Link
            href="/"
            className={`transition-colors duration-200 ${
              isLight ? "hover:text-white" : "hover:text-pumpkin"
            }`}
          >
            Startseite
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronIcon
              className={isLight ? "text-white/25" : "text-text-gray/25"}
            />
            {item.href ? (
              <Link
                href={item.href}
                className={`transition-colors duration-200 ${
                  isLight ? "hover:text-white" : "hover:text-pumpkin"
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
