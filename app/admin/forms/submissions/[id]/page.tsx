import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import SubmissionDetail from "@/components/admin/SubmissionDetail";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const submission = await prisma.formSubmission.findUnique({
    where: { id },
    include: { form: { select: { name: true } } },
  });

  if (!submission) {
    redirect("/admin/forms/submissions");
  }

  if (!submission.isRead) {
    await prisma.formSubmission.update({
      where: { id },
      data: { isRead: true },
    });
  }

  const data = JSON.parse(String(submission.data)) as Record<string, string>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          <Link href="/admin/forms/submissions" className="hover:text-orange-600 transition-colors">
            Anfragen
          </Link>
          {" > "}
          Detail
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          Anfrage vom{" "}
          {submission.createdAt.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Formular: {submission.form.name}
        </h2>

        <dl className="divide-y divide-gray-100">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">{key}</dt>
              <dd className="text-sm text-gray-900 col-span-2 whitespace-pre-wrap">
                {String(value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <SubmissionDetail id={submission.id} />
    </div>
  );
}
