import type { Metadata } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/josefin-sans/400.css";
import "@fontsource/josefin-sans/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mosaroma | Design trifft Performance",
  description:
    "Hochwertige Outdoor-Textilien, Sitzauflagen, Kissen, Poufs und Kollektionen für Garten, Terrasse, Hospitality und Fachhandel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
