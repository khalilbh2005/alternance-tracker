import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    sector: "",
    website: "",
    location: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);

  function loadCompanies() {
    setLoading(true);
    setErr("");
    api
      .get("/companies")
      .then((res) => setCompanies(res.data))
      .catch((e) => setErr(e?.message || "Erreur lors du chargement"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function normalizeError(e) {
    const data = e?.response?.data;
    if (data?.fieldErrors) {
      const msgs = Object.entries(data.fieldErrors).map(([field, msg]) => `${field}: ${msg}`);
      return msgs.join(" | ");
    }
    return data?.message || e?.message || "Erreur";
  }

  function resetForm() {
    setForm({ name: "", sector: "", website: "", location: "", notes: "" });
    setEditingId(null);
  }

  function startEdit(company) {
    setErr("");
    setSuccess("");
    setEditingId(company.id);
    setForm({
      name: company.name || "",
      sector: company.sector || "",
      website: company.website || "",
      location: company.location || "",
      notes: company.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (!form.name.trim()) {
      setErr("name: Company name is required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      sector: form.sector.trim() || null,
      website: form.website.trim() || null,
      location: form.location.trim() || null,
      notes: form.notes.trim() || null,
    };

    setSaving(true);
    try {
      if (editingId == null) {
        // CREATE
        const res = await api.post("/companies", payload);
        setCompanies((prev) => [res.data, ...prev]);
        setSuccess("Entreprise créée ✅");
        resetForm();
      } else {
        // UPDATE
        const res = await api.put(`/companies/${editingId}`, payload);
        setCompanies((prev) => prev.map((c) => (c.id === editingId ? res.data : c)));
        setSuccess("Entreprise modifiée ✅");
        resetForm();
      }
    } catch (e) {
      setErr(normalizeError(e));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(company) {
    setErr("");
    setSuccess("");

    const ok = window.confirm(`Supprimer l'entreprise "${company.name}" ?`);
    if (!ok) return;

    setDeletingId(company.id);
    try {
      await api.delete(`/companies/${company.id}`);
      setCompanies((prev) => prev.filter((c) => c.id !== company.id));
      setSuccess("Entreprise supprimée ✅");

      // si on supprimait celle en cours d’édition
      if (editingId === company.id) resetForm();
    } catch (e) {
      setErr(normalizeError(e)); // ici tu verras le message clair si offres existantes
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h3>Entreprises</h3>

      {/* Formulaire Create/Update */}
      <div className="card">
        <h4>{editingId == null ? "Créer une entreprise" : `Modifier l'entreprise #${editingId}`}</h4>

        {err && <p style={{ color: "crimson", marginTop: 8 }}>{err}</p>}
        {success && <p style={{ color: "green", marginTop: 8 }}>{success}</p>}

        <form onSubmit={onSubmit}  className="form">
          <div className="grid2">
            <label>
              Nom <span style={{ color: "crimson" }}>*</span>
            </label>
            <input name="name" value={form.name} onChange={onChange} placeholder="Ex: Capgemini" required />
          </div>

          <div className="grid2">
            <label>Secteur</label>
            <input name="sector" value={form.sector} onChange={onChange} placeholder="Ex: ESN" />
          </div>

          <div className="grid2">
            <label>Site web</label>
            <input name="website" value={form.website} onChange={onChange} placeholder="https://..." />
          </div>

          <div className="grid2">
            <label>Localisation</label>
            <input name="location" value={form.location} onChange={onChange} placeholder="Ex: Paris" />
          </div>

          <div className="grid2">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={onChange} rows={3} />
          </div>

          <div className="grid2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Enregistrement..." : editingId == null ? "Créer" : "Enregistrer"}
            </button>

            {editingId != null && (
              <button type="button" onClick={resetForm} className="btn-secondary" disabled={saving}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h4 style={{ margin: 0 }}>Liste</h4>
          <button onClick={loadCompanies} disabled={loading}>
            {loading ? "Chargement..." : "Rafraîchir"}
          </button>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : companies.length === 0 ? (
          <p>Aucune entreprise.</p>
        ) : (
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            {companies.map((c) => (
              <li
                key={c.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 0",
                }}
              >
                <div>
                  <b>{c.name}</b>
                  {c.location ? ` — ${c.location}` : ""}
                  {c.sector ? ` — ${c.sector}` : ""}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => startEdit(c)} title="Modifier">
                    Modifier
                  </button>

                  <button onClick={() => onDelete(c)} disabled={deletingId === c.id} title="Supprimer">
                    {deletingId === c.id ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
