"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { mainNavLinks } from "@/lib/mosaroma/navigation";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

export interface HeaderNavItem {
  label: string;
  href: string;
  target?: string;
  badgeText?: string | null;
  badgeVariant?: string;
}

interface HeaderProps {
  navItems?: HeaderNavItem[];
  logoUrl?: string | null;
  siteName?: string | null;
  icons?: Record<string, ResolvedIcon>;
}

const BADGE_VARIANTS: Record<string, string> = {
  blue: "bg-[#2F7195] text-white",
  orange: "bg-pumpkin text-white",
  dark: "bg-anthracite text-white",
  light: "bg-white/90 text-anthracite",
};

function badgeClasses(variant?: string): string {
  return BADGE_VARIANTS[variant || "blue"] || BADGE_VARIANTS.blue;
}

export default function Header({ navItems, logoUrl, siteName, icons = {} }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    toggleRef.current?.focus();
  }, []);

  const links: HeaderNavItem[] =
    navItems && navItems.length > 0
      ? navItems
      : mainNavLinks.map((l) => ({ label: l.label, href: l.href }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobile();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  useEffect(() => {
    if (!mobileOpen || !menuRef.current) return;
    const menu = menuRef.current;
    const onTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = menu.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    menu.addEventListener("keydown", onTrap);
    const firstLink = menu.querySelector<HTMLElement>("a[href]");
    firstLink?.focus();
    return () => menu.removeEventListener("keydown", onTrap);
  }, [mobileOpen]);

  const logoAlt = siteName ? `${siteName} Logo` : "Mosaroma Logo";

  return (
    <>
      <a
        href="#main"
        className="fixed left-3 -top-20 z-[80] px-3 py-2 bg-pumpkin text-white font-heading text-[10px] font-semibold uppercase tracking-[0.12em] shadow-lg transition-all duration-200 focus:top-3 focus:outline-none focus:ring-2 focus:ring-white/80"
      >
        Zum Inhalt springen
      </a>
      <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        scrolled
          ? "bg-white/[0.97] backdrop-blur-xl"
          : ""
      }`}
      style={scrolled
        ? { boxShadow: "0 1px 0 rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)" }
        : undefined
      }
    >
      {!scrolled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.12) 75%, transparent 100%)",
          }}
        />
      )}

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className={`flex items-center justify-between transition-all duration-700 ease-out ${
          scrolled ? "h-[68px] md:h-[76px]" : "h-[88px] md:h-[108px]"
        }`}>
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logoUrl || "/mosaroma_logo.png"}
              alt={logoAlt}
              width={280}
              height={70}
              priority
              className={`transition-all duration-700 ease-out w-auto ${
                scrolled
                  ? "h-[44px] md:h-[50px]"
                  : "h-[52px] md:h-[62px] brightness-0 invert drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
              }`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                {...(link.target === "_blank" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`group relative font-heading text-[12px] font-semibold uppercase tracking-[0.12em] transition-all duration-400 ${
                  scrolled
                    ? "text-anthracite/85 hover:text-pumpkin"
                    : "text-white hover:text-white"
                }`}
                style={scrolled ? undefined : { textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
              >
                {link.label}
                {link.badgeText && (
                  <span className={`relative -top-[5px] ml-0.5 inline-flex items-center px-[5px] py-[1px] text-[8px] font-bold uppercase tracking-[0.06em] leading-none rounded-[2px] ${
                    badgeClasses(link.badgeVariant)
                  }`}>
                    {link.badgeText}
                  </span>
                )}
                <span className={`absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-400 ease-out group-hover:w-full ${
                  scrolled ? "bg-pumpkin/70" : "bg-white/50"
                }`} />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/kontakt"
              className={`font-heading text-[11px] font-semibold uppercase tracking-[0.12em] px-5 py-2.5 transition-all duration-300 ${
                scrolled
                  ? "border border-anthracite/20 text-anthracite hover:bg-anthracite hover:text-white"
                  : "border border-white/50 text-white hover:bg-white/10"
              }`}
              style={scrolled ? undefined : { textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            >
              Kontakt
            </Link>
          </div>

          <button
            ref={toggleRef}
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={mobileOpen}
            className={`lg:hidden p-3.5 -mr-1 transition-all duration-300 ${
              scrolled || mobileOpen
                ? "text-anthracite hover:bg-light-gray"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => mobileOpen ? closeMobile() : setMobileOpen(true)}
          >
            <div className="w-[22px] flex flex-col gap-[5px]">
              <span
                className={`block h-[1.5px] bg-current transition-all duration-300 origin-center ${
                  mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] bg-current transition-all duration-300 origin-center ${
                  mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        className={`lg:hidden fixed inset-0 bg-white z-40 transition-all duration-400 ${
          scrolled ? "top-[68px] md:top-[76px]" : "top-[88px] md:top-[108px]"
        } ${
          mobileOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }`}
      >
        <nav className="flex flex-col px-8 pt-10 gap-0">
          <Link
            href="/"
            onClick={closeMobile}
            className="group flex items-center justify-between py-4.5 border-b border-light-gray font-heading text-[15px] font-semibold uppercase tracking-[0.1em] text-anthracite hover:text-pumpkin transition-colors duration-300"
          >
            Startseite
            <CmsIcon icon={icons["chevron-right"]} width={14} height={14} className="text-medium-gray/60 group-hover:text-pumpkin group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.target === "_blank" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={closeMobile}
              className="group flex items-center justify-between py-4.5 border-b border-light-gray font-heading text-[15px] font-semibold uppercase tracking-[0.1em] text-anthracite hover:text-pumpkin transition-colors duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span>
                {link.label}
                {link.badgeText && (
                  <span className={`relative -top-[5px] ml-1 inline-flex items-center px-[5px] py-[1px] text-[8px] font-bold uppercase tracking-[0.06em] leading-none rounded-[2px] ${
                    badgeClasses(link.badgeVariant)
                  }`}>
                    {link.badgeText}
                  </span>
                )}
              </span>
              <CmsIcon icon={icons["chevron-right"]} width={14} height={14} className="text-medium-gray/60 group-hover:text-pumpkin group-hover:translate-x-0.5 transition-all duration-300" />
            </Link>
          ))}
          <div className="mt-8 pt-6">
            <Link
              href="/kontakt"
              onClick={closeMobile}
              className="btn-primary w-full justify-center"
            >
              Kontakt
            </Link>
          </div>
        </nav>
      </div>
    </header>
    </>
  );
}
