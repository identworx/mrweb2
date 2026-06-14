"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SwatchRow {
  id: string;
  name: string;
  slug: string;
  articleNumber: string;
  familyId: string;
  familyName: string;
  colorHex: string;
  swatchImageUrl: string;
  isActive: boolean;
  availabilityCount: number;
}

interface FamilyRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
}

interface ProductTypeRow {
  id: string;
  name: string;
  slug: string;
  iconKey: string;
  order: number;
  isActive: boolean;
}

interface Props {
  swatches: SwatchRow[];
  families: FamilyRow[];
  productTypes: ProductTypeRow[];
  userRole: string;
}

type Tab = "swatches" | "families" | "product-types";

export default function FabricAdminList({
  swatches,
  families,
  productTypes,
  userRole,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("swatches");
  const [familyFilter, setFamilyFilter] = useState("");
  const [search, setSearch] = useState("");

  const filteredSwatches = swatches.filter((s) => {
    if (familyFilter && s.familyId !== familyFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.articleNumber.toLowerCase().includes(q) ||
        s.familyName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  async function toggleActive(entity: string, id: string) {
    await fetch(`/api/admin/fabrics?entity=${entity}&id=${id}`, {
      method: "PATCH",
    });
    router.refresh();
  }

  async function deleteEntity(entity: string, id: string, name: string) {
    if (!confirm(`"${name}" wirklich löschen?`)) return;
    const res = await fetch(`/api/admin/fabrics?entity=${entity}&id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Fehler beim Löschen");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stoffbibliothek</h1>
        <Link
          href="/admin/fabrics/new"
          className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded hover:bg-orange-700"
        >
          Neuer Stoff
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(
          [
            ["swatches", `Stoffe (${swatches.length})`],
            ["families", `Familien (${families.length})`],
            ["product-types", `Produktarten (${productTypes.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Swatches Tab */}
      {tab === "swatches" && (
        <>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suchen…"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <select
              value={familyFilter}
              onChange={(e) => setFamilyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Alle Familien</option>
              {families.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Swatch</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Art.-Nr.</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Familie</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Produkte</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSwatches.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 border border-gray-200 rounded overflow-hidden">
                        {s.swatchImageUrl ? (
                          <img src={s.swatchImageUrl} alt="" className="w-full h-full object-cover" />
                        ) : s.colorHex ? (
                          <div className="w-full h-full" style={{ backgroundColor: s.colorHex }} />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-500">{s.articleNumber || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{s.familyName}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{s.availabilityCount}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive("swatches", s.id)}
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          s.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {s.isActive ? "Aktiv" : "Inaktiv"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/fabrics/${s.id}`}
                        className="text-orange-600 hover:text-orange-700 text-sm mr-3"
                      >
                        Bearbeiten
                      </Link>
                      {userRole === "ADMIN" && (
                        <button
                          onClick={() => deleteEntity("swatches", s.id, s.name)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Löschen
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredSwatches.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      Keine Stoffe gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Families Tab */}
      {tab === "families" && (
        <FamilyManager
          families={families}
          userRole={userRole}
          onToggle={(id) => toggleActive("families", id)}
          onDelete={(id, name) => deleteEntity("families", id, name)}
          onRefresh={() => router.refresh()}
        />
      )}

      {/* Product Types Tab */}
      {tab === "product-types" && (
        <ProductTypeManager
          productTypes={productTypes}
          userRole={userRole}
          onToggle={(id) => toggleActive("product-types", id)}
          onDelete={(id, name) => deleteEntity("product-types", id, name)}
          onRefresh={() => router.refresh()}
        />
      )}
    </div>
  );
}

function FamilyManager({
  families,
  userRole,
  onToggle,
  onDelete,
  onRefresh,
}: {
  families: FamilyRow[];
  userRole: string;
  onToggle: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);

  function startEdit(f: FamilyRow) {
    setEditId(f.id);
    setName(f.name);
    setSlug(f.slug);
    setDescription(f.description);
    setOrder(f.order);
    setShowForm(true);
  }

  function startNew() {
    setEditId(null);
    setName("");
    setSlug("");
    setDescription("");
    setOrder(families.length);
    setShowForm(true);
  }

  async function save() {
    const body: Record<string, unknown> = {
      entity: "family",
      name,
      slug: slug || undefined,
      description,
      order,
    };
    if (editId) body.id = editId;

    const res = await fetch("/api/admin/fabrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Fehler");
      return;
    }

    setShowForm(false);
    onRefresh();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={startNew}
          className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded hover:bg-orange-700"
        >
          Neue Familie
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reihenfolge</label>
            <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700">Speichern</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">Abbrechen</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Reihenfolge</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {families.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{f.name}</td>
                <td className="px-4 py-3 text-gray-500">{f.slug}</td>
                <td className="px-4 py-3 text-center text-gray-500">{f.order}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onToggle(f.id)}
                    className={`px-2 py-0.5 text-xs rounded-full ${f.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {f.isActive ? "Aktiv" : "Inaktiv"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(f)} className="text-orange-600 hover:text-orange-700 text-sm mr-3">Bearbeiten</button>
                  {userRole === "ADMIN" && (
                    <button onClick={() => onDelete(f.id, f.name)} className="text-red-500 hover:text-red-700 text-sm">Löschen</button>
                  )}
                </td>
              </tr>
            ))}
            {families.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Keine Familien vorhanden.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductTypeManager({
  productTypes,
  userRole,
  onToggle,
  onDelete,
  onRefresh,
}: {
  productTypes: ProductTypeRow[];
  userRole: string;
  onToggle: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [iconKey, setIconKey] = useState("");
  const [order, setOrder] = useState(0);

  function startEdit(pt: ProductTypeRow) {
    setEditId(pt.id);
    setName(pt.name);
    setSlug(pt.slug);
    setIconKey(pt.iconKey);
    setOrder(pt.order);
    setShowForm(true);
  }

  function startNew() {
    setEditId(null);
    setName("");
    setSlug("");
    setIconKey("");
    setOrder(productTypes.length);
    setShowForm(true);
  }

  async function save() {
    const body: Record<string, unknown> = {
      entity: "product-type",
      name,
      slug: slug || undefined,
      iconKey,
      order,
    };
    if (editId) body.id = editId;

    const res = await fetch("/api/admin/fabrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Fehler");
      return;
    }

    setShowForm(false);
    onRefresh();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={startNew}
          className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded hover:bg-orange-700"
        >
          Neue Produktart
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon Key</label>
              <input value={iconKey} onChange={(e) => setIconKey(e.target.value)} placeholder="z.B. dekokissen" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
            </div>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reihenfolge</label>
            <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700">Speichern</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">Abbrechen</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Icon Key</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Reihenfolge</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {productTypes.map((pt) => (
              <tr key={pt.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{pt.name}</td>
                <td className="px-4 py-3 text-gray-500">{pt.slug}</td>
                <td className="px-4 py-3 text-gray-500">{pt.iconKey || "—"}</td>
                <td className="px-4 py-3 text-center text-gray-500">{pt.order}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onToggle(pt.id)}
                    className={`px-2 py-0.5 text-xs rounded-full ${pt.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {pt.isActive ? "Aktiv" : "Inaktiv"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(pt)} className="text-orange-600 hover:text-orange-700 text-sm mr-3">Bearbeiten</button>
                  {userRole === "ADMIN" && (
                    <button onClick={() => onDelete(pt.id, pt.name)} className="text-red-500 hover:text-red-700 text-sm">Löschen</button>
                  )}
                </td>
              </tr>
            ))}
            {productTypes.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Keine Produktarten vorhanden.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
