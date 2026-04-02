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
  title: "MOSAROMA – Premium Outdoor Living",
  description:
    "Stilvolle Lösungen für anspruchsvolle Außenbereiche. Entdecken Sie hochwertige Outdoor-Textilien und Gartenmöbel von MOSAROMA.",
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
