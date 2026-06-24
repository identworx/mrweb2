"use client";

import { useEffect } from "react";

export default function HtmlLangOverride({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = "de";
    };
  }, [lang]);

  return null;
}
