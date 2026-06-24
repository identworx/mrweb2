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
  eyebrow: string;
  subtitle: string;
  material: string;
  weight: string;
  dyeing: string;
  comfort: string;
  cushionThickness: string;
  hubHighlights: string;
  isHighlighted: boolean;
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stoffbibliothek</h1>
          <p className="text-xs text-gray-400 mt-1">
            Hier pflegst du Stoffmuster, Farbmuster und Swatches für die öffentliche Stoffübersicht.
          </p>
        </div>
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
  const [eyebrow, setEyebrow] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [material, setMaterial] = useState("");
  const [weight, setWeight] = useState("");
  const [dyeing, setDyeing] = useState("");
  const [comfort, setComfort] = useState("");
  const [cushionThickness, setCushionThickness] = useState("");
  const [hubHighlights, setHubHighlights] = useState("");
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [order, setOrder] = useState(0);

  function startEdit(f: FamilyRow) {
    setEditId(f.id);
    setName(f.name);
    setSlug(f.slug);
    setDescription(f.description);
    setEyebrow(f.eyebrow);
    setSubtitle(f.subtitle);
    setMaterial(f.material);
    setWeight(f.weight);
    setDyeing(f.dyeing);
    setComfort(f.comfort);
    setCushionThickness(f.cushionThickness);
    setHubHighlights(f.hubHighlights);
    setIsHighlighted(f.isHighlighted);
    setOrder(f.order);
    setShowForm(true);
  }

  function startNew() {
    setEditId(null);
    setName("");
    setSlug("");
    setDescription("");
    setEyebrow("");
    setSubtitle("");
    setMaterial("");
    setWeight("");
    setDyeing("");
    setComfort("");
    setCushionThickness("");
    setHubHighlights("");
    setIsHighlighted(false);
    setOrder(families.length);
    setShowForm(true);
  }

  async function save() {
    const body: Record<string, unknown> = {
      entity: "family",
      name,
      slug: slug || undefined,
      description,
      eyebrow,
      subtitle,
      material,
      weight,
      dyeing,
      comfort,
      cushionThickness,
      hubHighlights,
      isHighlighted,
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

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded text-sm";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

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
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Basisdaten</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto" className={inputCls} />
              <p className="text-xs text-gray-400 mt-1">Nur Kleinbuchstaben, Zahlen und Bindestriche. Leer = automatisch.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Subtitle</label>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="z.B. Aus dem Ozean geboren." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Eyebrow</label>
              <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} placeholder="z.B. Premium Outdoor" className={inputCls} />
              <p className="text-xs text-gray-400 mt-1">Kleiner Text über dem Stoffnamen.</p>
            </div>
          </div>
          <div>
            <label className={labelCls}>Beschreibung</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls} />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 pt-2">Hub-Card Inhalte</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Material</label>
              <input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="z.B. 100 % Olefin" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Gewicht</label>
              <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="z.B. ab 260 g/m²" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Färbung</label>
              <input value={dyeing} onChange={(e) => setDyeing(e.target.value)} placeholder="z.B. spinndüsengefärbt" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Komfort</label>
              <input value={comfort} onChange={(e) => setComfort(e.target.value)} placeholder="z.B. hoher Sitzkomfort" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Polsterstärke</label>
              <input value={cushionThickness} onChange={(e) => setCushionThickness(e.target.value)} placeholder="z.B. 5–6 cm" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Highlights für Hub-Card</label>
            <textarea
              value={hubHighlights}
              onChange={(e) => setHubHighlights(e.target.value)}
              rows={4}
              placeholder={"Eine Zeile pro Highlight, z.B.:\nHöchste Lichtechtheit (7–8)\nUV-Beständigkeit 5/5\nWasseraufnahme < 0,1 %"}
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">Eine Zeile pro Highlight. Leere Zeilen werden ignoriert.</p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 pt-2">Darstellung</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="w-32">
              <label className={labelCls}>Reihenfolge</label>
              <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className={inputCls} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isHighlighted"
                checked={isHighlighted}
                onChange={(e) => setIsHighlighted(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="isHighlighted" className="text-sm text-gray-700">
                Auf Materialien-Hub hervorheben (dunkle Premium-Card)
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
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
              <th className="text-left px-4 py-3 font-medium text-gray-600">Material</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Reihenfolge</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {families.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">{f.name}</span>
                  {f.isHighlighted && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-orange-100 text-orange-700">Hub</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{f.slug}</td>
                <td className="px-4 py-3 text-gray-500">{f.material || "—"}</td>
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
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Keine Familien vorhanden.</td></tr>
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
              <p className="text-xs text-gray-400 mt-1">Nur Kleinbuchstaben, Zahlen und Bindestriche. Leer = automatisch.</p>
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
