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
          ? "bg-white/97 backdrop-blur-lg border-b border-black/[0.04]"
          : "bg-gradient-to-b from-black/25 to-transparent"
      }`}
      style={scrolled ? { boxShadow: "0 1px 12px rgba(0,0,0,0.04)" } : undefined}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className={`flex items-center justify-between transition-all duration-700 ease-out ${
          scrolled ? "h-[72px] md:h-[80px]" : "h-[84px] md:h-[100px]"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 relative">
            <Image
              src="/mosaroma_logo.png"
              alt="Mosaroma Logo"
              width={240}
              height={60}
              priority
              className={`transition-all duration-700 ease-out w-auto ${
                scrolled
                  ? "h-[42px] md:h-[48px]"
                  : "h-[48px] md:h-[56px] brightness-0 invert"
              }`}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative font-heading text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-400 ${
                  scrolled
                    ? "text-anthracite hover:text-pumpkin"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
                {/* Hover underline */}
                <span className={`absolute -bottom-1 left-0 h-[1px] w-0 transition-all duration-400 group-hover:w-full ${
                  scrolled ? "bg-pumpkin" : "bg-white/60"
                }`} />
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              aria-label="Suche"
              className={`p-2.5 rounded-full transition-all duration-400 ${
                scrolled
                  ? "text-anthracite hover:text-pumpkin hover:bg-light-gray"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <div className={`w-px h-4 mx-2 transition-colors duration-400 ${
              scrolled ? "bg-medium-gray/30" : "bg-white/20"
            }`} />
            <button
              aria-label="Sprache"
              className={`p-2.5 rounded-full font-heading text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-400 ${
                scrolled
                  ? "text-anthracite hover:text-pumpkin hover:bg-light-gray"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              DE
            </button>
          </div>

          {/* Mobile Burger */}
          <button
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            className={`lg:hidden p-3 -mr-1 rounded-full transition-all duration-400 ${
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
        className={`lg:hidden fixed inset-0 top-[72px] bg-white z-40 transition-all duration-400 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }`}
      >
        <nav className="flex flex-col px-8 pt-14 gap-0">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="group flex items-center justify-between py-4 border-b border-light-gray font-heading text-[15px] font-semibold uppercase tracking-[0.12em] text-anthracite hover:text-pumpkin transition-colors duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.label}
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-medium-gray group-hover:text-pumpkin transition-colors duration-300">
                <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
          <div className="mt-8 pt-6 flex items-center gap-8">
            <button className="font-heading text-[12px] font-semibold text-text-gray uppercase tracking-[0.14em] hover:text-pumpkin transition-colors">
              Suche
            </button>
            <button className="font-heading text-[12px] font-semibold text-text-gray uppercase tracking-[0.14em] hover:text-pumpkin transition-colors">
              DE
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
