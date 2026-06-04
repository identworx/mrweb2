import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageEditForm from "@/components/admin/PageEditForm";

export default async function PageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const isNew = id === "new";
  const page = isNew ? null : await prisma.page.findUnique({ where: { id } });

  if (!isNew && !page) {
    redirect("/admin/pages");
  }

  const pageData = page
    ? {
        id: page.id,
        title: page.title,
        slug: page.slug,
        eyebrow: page.eyebrow ?? "",
        headline: page.headline ?? "",
        introText: page.introText ?? "",
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
        status: "DRAFT",
        type: "STANDARD",
        seoTitle: "",
        seoDescription: "",
      };

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

      <PageEditForm page={pageData} />
    </div>
  );
}
