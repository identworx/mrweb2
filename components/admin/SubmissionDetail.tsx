"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SubmissionDetail({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Anfrage wirklich löschen?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Fehler beim Löschen");
      }

      router.push("/admin/forms/submissions");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Fehler beim Löschen");
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex items-center px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {deleting ? "Löscht..." : "Löschen"}
      </button>
      <Link
        href="/admin/forms/submissions"
        className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        Zurück
      </Link>
    </div>
  );
}
