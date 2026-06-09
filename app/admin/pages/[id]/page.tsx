import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageEditForm from "@/components/admin/PageEditForm";
import PageSectionsEditor from "@/components/admin/PageSectionsEditor";
import { getSessionUser } from "@/lib/auth/session";

export default async function PageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  const isNew = id === "new";
  const page = isNew
    ? null
    : await prisma.page.findUnique({
        where: { id },
        include: {
          sections: { orderBy: { order: "asc" } },
        },
      });

  if (!isNew && !page) {
    redirect("/admin/pages");
  }

  const mediaAssets = await prisma.mediaAsset.findMany({
    where: { mimeType: { startsWith: "image/" } },
    select: { id: true, filename: true, url: true, alt: true },
    orderBy: { createdAt: "desc" },
  });

  const pageData = page
    ? {
        id: page.id,
        title: page.title,
        slug: page.slug,
        eyebrow: page.eyebrow ?? "",
        headline: page.headline ?? "",
        introText: page.introText ?? "",
        heroImageId: page.heroImageId ?? "",
        status: page.status,
        type: page.type,
        seoTitle: page.seoTitle ?? "",
        seoDescription: page.seoDescription ?? "",
      }
    : {
        id: "",
        title: "",
        slug: "",
        eyebrow: "",
        headline: "",
        introText: "",
        heroImageId: "",
        status: "DRAFT",
        type: "STANDARD",
        seoTitle: "",
        seoDescription: "",
      };

  const userRole = sessionUser?.role ?? "VIEWER";

  const sections = page
    ? page.sections.map((s) => ({
        id: s.id,
        type: s.type,
        title: s.title,
        eyebrow: s.eyebrow,
        content: s.content,
        buttonLabel: s.buttonLabel,
        buttonHref: s.buttonHref,
        imageId: s.imageId,
        settings: parseSettings(s.settings),
        order: s.order,
        isActive: s.isActive,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin/pages" className="hover:text-orange-600 transition-colors">
            Seiten
          </Link>
          {" > "}
          {isNew ? "Neue Seite" : "Seite bearbeiten"}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {isNew ? "Neue Seite erstellen" : pageData.title}
        </h1>
      </div>

      <PageEditForm page={pageData} mediaAssets={mediaAssets} userRole={userRole} />

      {page ? (
        <PageSectionsEditor
          pageId={page.id}
          initialSections={sections}
          userRole={userRole}
        />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500">
          Sections können nach dem ersten Speichern der Seite angelegt werden.
        </div>
      )}
    </div>
  );
}

function parseSettings(raw: unknown): Record<string, unknown> {
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) return parsed;
    } catch { /* ignore */ }
  }
  return {};
}
