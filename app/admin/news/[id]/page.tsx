import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewsEditForm from "@/components/admin/NewsEditForm";
import { getSessionUser } from "@/lib/auth/session";

export default async function NewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sessionUser = await getSessionUser();
  const isNew = id === "new";
  const [article, mediaAssets] = await Promise.all([
    isNew ? null : prisma.newsArticle.findUnique({ where: { id } }),
    prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, url: true, alt: true, originalName: true },
    }),
  ]);

  if (!isNew && !article) {
    redirect("/admin/news");
  }

  const articleData = article
    ? {
        id: article.id,
        slug: article.slug,
        title: article.title,
        eyebrow: article.eyebrow ?? "",
        excerpt: article.excerpt ?? "",
        content: article.content ?? "",
        heroImageId: article.heroImageId ?? "",
        cardImageId: article.cardImageId ?? "",
        category: article.category ?? "",
        status: article.status,
        publishedAt: article.publishedAt
          ? article.publishedAt.toISOString().slice(0, 16)
          : "",
        seoTitle: article.seoTitle ?? "",
        seoDescription: article.seoDescription ?? "",
      }
    : {
        id: "",
        slug: "",
        title: "",
        eyebrow: "",
        excerpt: "",
        content: "",
        heroImageId: "",
        cardImageId: "",
        category: "",
        status: "DRAFT",
        publishedAt: "",
        seoTitle: "",
        seoDescription: "",
      };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin/news" className="hover:text-orange-600 transition-colors">
            News
          </Link>
          {" > "}
          {isNew ? "Neuer Artikel" : "Artikel bearbeiten"}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {isNew ? "Neuen Artikel erstellen" : articleData.title}
        </h1>
      </div>

      <NewsEditForm
        article={articleData}
        mediaAssets={mediaAssets}
        userRole={sessionUser?.role ?? "VIEWER"}
      />
    </div>
  );
}
