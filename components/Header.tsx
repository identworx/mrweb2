"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/lib/data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
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
      {/* Transparent state: subtle gradient scrim for readability */}
      {!scrolled && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-transparent pointer-events-none" />
      )}

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className={`flex items-center justify-between transition-all duration-700 ease-out ${
          scrolled ? "h-[68px] md:h-[76px]" : "h-[88px] md:h-[108px]"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/mosaroma_logo.png"
              alt="Mosaroma Logo"
              width={280}
              height={70}
              priority
              className={`transition-all duration-700 ease-out w-auto ${
                scrolled
                  ? "h-[44px] md:h-[50px]"
                  : "h-[52px] md:h-[62px] brightness-0 invert drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
              }`}
            />
          </Link>

          {/* Desktop Nav - centered */}
          <nav className="hidden lg:flex items-center gap-9 xl:gap-11">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative font-heading text-[13px] font-semibold uppercase tracking-[0.12em] transition-all duration-400 ${
                  scrolled
                    ? "text-anthracite/85 hover:text-pumpkin"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
                {/* Hover underline */}
                <span className={`absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-400 ease-out group-hover:w-full ${
                  scrolled ? "bg-pumpkin/70" : "bg-white/50"
                }`} />
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              aria-label="Suche"
              className={`p-2.5 rounded-full transition-all duration-300 ${
                scrolled
                  ? "text-anthracite/70 hover:text-pumpkin hover:bg-light-gray"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <div className={`w-px h-3.5 mx-1.5 transition-colors duration-400 ${
              scrolled ? "bg-medium-gray/25" : "bg-white/15"
            }`} />
            <button
              aria-label="Sprache"
              className={`p-2.5 rounded-full font-heading text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                scrolled
                  ? "text-anthracite/70 hover:text-pumpkin hover:bg-light-gray"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              DE
            </button>
          </div>

          {/* Mobile Burger */}
          <button
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            className={`lg:hidden p-3 -mr-1 rounded-full transition-all duration-300 ${
              scrolled || mobileOpen
                ? "text-anthracite hover:bg-light-gray"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
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

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-[68px] bg-white z-40 transition-all duration-400 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }`}
      >
        <nav className="flex flex-col px-8 pt-10 gap-0">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="group flex items-center justify-between py-4.5 border-b border-light-gray font-heading text-[15px] font-semibold uppercase tracking-[0.1em] text-anthracite hover:text-pumpkin transition-colors duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.label}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-medium-gray/60 group-hover:text-pumpkin group-hover:translate-x-0.5 transition-all duration-300">
                <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
          <div className="mt-8 pt-6 flex items-center gap-8">
            <button className="font-heading text-[12px] font-semibold text-text-gray uppercase tracking-[0.12em] hover:text-pumpkin transition-colors">
              Suche
            </button>
            <button className="font-heading text-[12px] font-semibold text-text-gray uppercase tracking-[0.12em] hover:text-pumpkin transition-colors">
              DE
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
