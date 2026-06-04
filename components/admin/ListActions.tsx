"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "./ConfirmDialog";

interface ListActionsProps {
  entityId: string;
  entityName: string;
  apiEndpoint: string;
  editHref: string;
  viewHref?: string;
  archiveAction?: { currentStatus: string };
  deactivateAction?: { isActive: boolean };
  userRole: string;
}

export default function ListActions({
  entityId,
  entityName,
  apiEndpoint,
  editHref,
  viewHref,
  archiveAction,
  deactivateAction,
  userRole,
}: ListActionsProps) {
  const router = useRouter();
  const [dialog, setDialog] = useState<"archive" | "deactivate" | null>(null);
  const [loading, setLoading] = useState(false);

  const canModify = userRole !== "VIEWER";
  const isArchived = archiveAction?.currentStatus === "ARCHIVED";
  const isActive = deactivateAction?.isActive ?? true;

  async function handleArchive() {
    setLoading(true);
    try {
      const newStatus = isArchived ? "DRAFT" : "ARCHIVED";
      const res = await fetch(`${apiEndpoint}?id=${entityId}&action=status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler");
      }
      setDialog(null);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate() {
    setLoading(true);
    try {
      const res = await fetch(`${apiEndpoint}?id=${entityId}&action=toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler");
      }
      setDialog(null);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={editHref}
        className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
      >
        Bearbeiten
      </a>

      {viewHref && (
        <a
          href={viewHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ↗
        </a>
      )}

      {archiveAction && canModify && (
        <button
          onClick={() => setDialog("archive")}
          className={`text-xs font-medium transition-colors ${
            isArchived
              ? "text-green-600 hover:text-green-700"
              : "text-yellow-600 hover:text-yellow-700"
          }`}
        >
          {isArchived ? "Aktivieren" : "Archivieren"}
        </button>
      )}

      {deactivateAction && canModify && (
        <button
          onClick={() => setDialog("deactivate")}
          className={`text-xs font-medium transition-colors ${
            isActive
              ? "text-yellow-600 hover:text-yellow-700"
              : "text-green-600 hover:text-green-700"
          }`}
        >
          {isActive ? "Deaktivieren" : "Aktivieren"}
        </button>
      )}

      {archiveAction && (
        <ConfirmDialog
          open={dialog === "archive"}
          title={isArchived ? "Wiederherstellen" : "Archivieren"}
          message={
            isArchived
              ? `„${entityName}" wiederherstellen?`
              : `„${entityName}" archivieren?`
          }
          confirmLabel={isArchived ? "Wiederherstellen" : "Archivieren"}
          variant="warning"
          loading={loading}
          onConfirm={handleArchive}
          onCancel={() => setDialog(null)}
        />
      )}

      {deactivateAction && (
        <ConfirmDialog
          open={dialog === "deactivate"}
          title={isActive ? "Deaktivieren" : "Aktivieren"}
          message={
            isActive
              ? `„${entityName}" deaktivieren?`
              : `„${entityName}" aktivieren?`
          }
          confirmLabel={isActive ? "Deaktivieren" : "Aktivieren"}
          variant="warning"
          loading={loading}
          onConfirm={handleDeactivate}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
}
