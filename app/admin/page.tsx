import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

async function getStats() {
  const [pages, collections, products, media, submissions] = await Promise.all([
    prisma.page.count(),
    prisma.collection.count(),
    prisma.product.count(),
    prisma.mediaAsset.count(),
    prisma.formSubmission.count({ where: { isRead: false } }),
  ]);
  return { pages, collections, products, media, submissions };
}

const statCards = [
  { key: "pages" as const, label: "Seiten", href: "/admin/pages", color: "bg-blue-500" },
  { key: "collections" as const, label: "Kollektionen", href: "/admin/collections", color: "bg-green-500" },
  { key: "products" as const, label: "Produkte", href: "/admin/products", color: "bg-purple-500" },
  { key: "media" as const, label: "Medien", href: "/admin/media", color: "bg-yellow-500" },
  { key: "submissions" as const, label: "Neue Anfragen", href: "/admin/forms/submissions", color: "bg-red-500" },
];

const quickLinks = [
  { label: "Seite bearbeiten", href: "/admin/pages", desc: "Titel, Texte & SEO bearbeiten" },
  { label: "Kollektion bearbeiten", href: "/admin/collections", desc: "Kollektionen verwalten" },
  { label: "Produkt anlegen", href: "/admin/products", desc: "Neues Produkt erstellen" },
  { label: "Bild hochladen", href: "/admin/media", desc: "Medien verwalten" },
  { label: "Navigation bearbeiten", href: "/admin/navigation", desc: "Menüs anpassen" },
  { label: "Footer bearbeiten", href: "/admin/footer", desc: "Footer-Inhalte ändern" },
  { label: "Kontaktformular", href: "/admin/forms/contact", desc: "Formular konfigurieren" },
  { label: "Einstellungen", href: "/admin/settings", desc: "Website-Einstellungen" },
];

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Willkommen im Mosaroma Admin-Bereich.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-2 h-2 rounded-full ${card.color} mb-3`} />
            <p className="text-2xl font-bold text-gray-900">{stats[card.key]}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Schnellzugriff</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-orange-300 hover:shadow-sm transition-all group"
            >
              <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                {link.label}
              </p>
              <p className="text-xs text-gray-400 mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
