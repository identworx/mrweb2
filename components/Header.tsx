"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/lib/data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex items-center justify-between h-[70px] md:h-[80px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/mosaroma_logo.png"
              alt="Mosaroma Logo"
              width={200}
              height={50}
              priority
              className={`transition-all duration-300 ${scrolled ? "h-11 md:h-12" : "h-12 md:h-14"} w-auto`}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-heading text-[13px] font-semibold uppercase tracking-[0.12em] text-anthracite hover:text-pumpkin transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              aria-label="Suche"
              className="p-2 text-anthracite hover:text-pumpkin transition-colors"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <button
              aria-label="Sprache"
              className="p-2 text-anthracite hover:text-pumpkin transition-colors font-heading text-xs font-semibold uppercase tracking-wider"
            >
              DE
            </button>
          </div>

          {/* Mobile Burger */}
          <button
            aria-label="Menü öffnen"
            className="lg:hidden p-2 text-anthracite"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="w-6 flex flex-col gap-[5px]">
              <span
                className={`block h-[2px] bg-current transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block h-[2px] bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] bg-current transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-[70px] bg-white z-40 transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-8 pt-8 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-heading text-lg font-semibold uppercase tracking-[0.1em] text-anthracite hover:text-pumpkin transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-light-gray flex items-center gap-6">
            <button className="text-sm text-text-gray font-heading uppercase tracking-wider">
              Suche
            </button>
            <button className="text-sm text-text-gray font-heading uppercase tracking-wider">
              DE
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}