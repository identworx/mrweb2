"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAlternateRoute } from "@/lib/i18n/routes";
import type { Locale } from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  locale: Locale;
  scrolled?: boolean;
}

export default function LanguageSwitcher({ locale, scrolled = false }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const otherLocale: Locale = locale === "de" ? "en" : "de";
  const otherHref = getAlternateRoute(pathname, otherLocale);

  return (
    <Link
      href={otherHref}
      lang={otherLocale}
      hrefLang={otherLocale}
      className={`font-heading text-[11px] font-semibold uppercase tracking-[0.12em] px-2 py-1.5 transition-all duration-300 ${
        scrolled
          ? "text-anthracite/60 hover:text-anthracite"
          : "text-white/70 hover:text-white"
      }`}
      style={scrolled ? undefined : { textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
    >
      {otherLocale === "en" ? "EN" : "DE"}
    </Link>
  );
}
