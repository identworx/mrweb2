"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "./ConfirmDialog";

interface DangerZoneProps {
  entityId: string;
  entityName: string;
  apiEndpoint: string;
  redirectTo: string;
  archiveAction?: {
    currentStatus: string;
    label?: string;
  };
  deactivateAction?: {
    isActive: boolean;
    label?: string;
  };
  deleteAction?: {
    enabled: boolean;
    disabledReason?: string;
    warning?: string;
  };
  userRole: string;
}

export default function DangerZone({
  entityId,
  entityName,
  apiEndpoint,
  redirectTo,
  archiveAction,
  deactivateAction,
  deleteAction,
  userRole,
}: DangerZoneProps) {
  const router = useRouter();
  const [dialog, setDialog] = useState<"archive" | "deactivate" | "delete" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = userRole === "ADMIN";
  const canArchive = userRole !== "VIEWER";
  const canDelete = isAdmin && deleteAction?.enabled !== false;

  async function handleArchive() {
    setLoading(true);
    setError(null);
    try {
      const newStatus = archiveAction!.currentStatus === "ARCHIVED" ? "DRAFT" : "ARCHIVED";
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
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate() {
    setLoading(true);
    setError(null);
    try {
      const newActive = !deactivateAction!.isActive;
      const res = await fetch(`${apiEndpoint}?id=${entityId}&action=toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler");
      }
      setDialog(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiEndpoint}?id=${entityId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Löschen");
      }
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen");
      setLoading(false);
    }
  }

  const isArchived = archiveAction?.currentStatus === "ARCHIVED";
  const isActive = deactivateAction?.isActive ?? true;

  return (
    <div className="bg-white rounded-lg border border-red-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-red-700">Gefahrenzone</h2>

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {archiveAction && canArchive && (
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isArchived ? "Aus Archiv wiederherstellen" : "Archivieren"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {isArchived
                  ? "Setzt den Status zurück auf Entwurf."
                  : "Versteckt den Eintrag auf der öffentlichen Website."}
              </p>
            </div>
            <button
              onClick={() => setDialog("archive")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isArchived
                  ? "text-green-700 bg-green-50 border border-green-200 hover:bg-green-100"
                  : "text-yellow-700 bg-yellow-50 border border-yellow-200 hover:bg-yellow-100"
              }`}
            >
              {isArchived ? "Wiederherstellen" : "Archivieren"}
            </button>
          </div>
        )}

        {deactivateAction && canArchive && (
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isActive ? "Deaktivieren" : "Reaktivieren"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {isActive
                  ? "Deaktivierte Einträge werden nicht öffentlich angezeigt."
                  : "Aktiviert den Eintrag wieder."}
              </p>
            </div>
            <button
              onClick={() => setDialog("deactivate")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "text-yellow-700 bg-yellow-50 border border-yellow-200 hover:bg-yellow-100"
                  : "text-green-700 bg-green-50 border border-green-200 hover:bg-green-100"
              }`}
            >
              {isActive ? "Deaktivieren" : "Reaktivieren"}
            </button>
          </div>
        )}

        {deleteAction && (
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Endgültig löschen</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {!isAdmin
                  ? "Nur Administratoren können endgültig löschen."
                  : deleteAction.enabled === false
                    ? deleteAction.disabledReason || "Löschen nicht möglich."
                    : "Diese Aktion kann nicht rückgängig gemacht werden."}
              </p>
            </div>
            <button
              onClick={() => setDialog("delete")}
              disabled={!canDelete}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Löschen
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={dialog === "archive"}
        title={isArchived ? "Wiederherstellen" : "Archivieren"}
        message={
          isArchived
            ? `„${entityName}" wirklich wiederherstellen? Der Status wird auf Entwurf gesetzt.`
            : `„${entityName}" wirklich archivieren? Der Eintrag wird auf der öffentlichen Website nicht mehr angezeigt.`
        }
        confirmLabel={isArchived ? "Wiederherstellen" : "Archivieren"}
        variant="warning"
        loading={loading}
        onConfirm={handleArchive}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === "deactivate"}
        title={isActive ? "Deaktivieren" : "Reaktivieren"}
        message={
          isActive
            ? `„${entityName}" wirklich deaktivieren?`
            : `„${entityName}" wirklich reaktivieren?`
        }
        confirmLabel={isActive ? "Deaktivieren" : "Reaktivieren"}
        variant="warning"
        loading={loading}
        onConfirm={handleDeactivate}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === "delete"}
        title="Endgültig löschen"
        message={`„${entityName}" wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
        details={deleteAction?.warning ? [deleteAction.warning] : undefined}
        confirmLabel="Endgültig löschen"
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDialog(null)}
      />
    </div>
  );
}
