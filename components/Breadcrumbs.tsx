import Link from "next/link";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: "dark" | "light";
  icons?: Record<string, ResolvedIcon>;
  locale?: "de" | "en";
}

export default function Breadcrumbs({
  items,
  variant = "dark",
  icons = {},
  locale = "de",
}: BreadcrumbsProps) {
  const isLight = variant === "light";
  const homeLabel = locale === "en" ? "Home" : "Startseite";
  const homeHref = locale === "en" ? "/en" : "/";

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={`flex flex-wrap items-center gap-1 font-body text-xs tracking-wide ${
          isLight ? "text-white/70" : "text-text-muted"
        }`}
      >
        <li>
          <Link
            href={homeHref}
            className={`transition-colors duration-200 ${
              isLight ? "hover:text-white" : "hover:text-pumpkin"
            }`}
          >
            {homeLabel}
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <CmsIcon
              icon={icons["chevron-right"]}
              width={12}
              height={12}
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
                aria-current="page"
                className={isLight ? "text-white/70" : "text-text-muted"}
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
