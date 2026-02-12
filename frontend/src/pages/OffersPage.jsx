import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);

  // filtre optionnel par entreprise
  const [filterCompanyId, setFilterCompanyId] = useState("");

  const [form, setForm] = useState({
    companyId: "",
    title: "",
    location: "",
    techStack: "",
    url: "",
    description: "",
  });

  const filteredOffers = useMemo(() => {
    if (!filterCompanyId) return offers;
    const cid = Number(filterCompanyId);
    return offers.filter((o) => o?.company?.id === cid);
  }, [offers, filterCompanyId]);

  function normalizeError(e) {
    const data = e?.response?.data;
    if (data?.fieldErrors) {
      const msgs = Object.entries(data.fieldErrors).map(([field, msg]) => `${field}: ${msg}`);
      return msgs.join(" | ");
    }
    return data?.message || e?.message || "Erreur";
  }

  async function loadAll() {
    setLoading(true);
    setErr("");
    try {
      const [companiesRes, offersRes] = await Promise.all([
        api.get("/companies"),
        api.get("/offers"),
      ]);
      setCompanies(companiesRes.data || []);
      setOffers(offersRes.data || []);
    } catch (e) {
      setErr(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function resetForm() {
    setForm({
      companyId: "",
      title: "",
      location: "",
      techStack: "",
      url: "",
      description: "",
    });
    setEditingId(null);
  }

  function startEdit(offer) {
    setErr("");
    setSuccess("");
    setEditingId(offer.id);

    setForm({
      companyId: offer?.company?.id ? String(offer.company.id) : "",
      title: offer.title || "",
      location: offer.location || "",
      techStack: offer.techStack || "",
      url: offer.url || "",
      description: offer.description || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");

    const companyId = Number(form.companyId);
    if (!companyId) {
      setErr("companyId: Sélectionne une entreprise");
      return;
    }
    if (!form.title.trim()) {
      setErr("title: Le titre est obligatoire");
      return;
    }

    const payload = {
      title: form.title.trim(),
      location: form.location.trim() || null,
      techStack: form.techStack.trim() || null,
      url: form.url.trim() || null,
      description: form.description.trim() || null,
    };

    setSaving(true);
    try {
      if (editingId == null) {
        // CREATE : POST /offers?companyId=...
        const res = await api.post(`/offers?companyId=${companyId}`, payload);
        setOffers((prev) => [res.data, ...prev]);
        setSuccess("Offre créée ✅");
        resetForm();
      } else {
        // UPDATE : PUT /offers/{id}
        const res = await api.put(`/offers/${editingId}`, payload);

        // Attention: ton backend ne change pas la company dans update (c’est volontaire)
        setOffers((prev) => prev.map((o) => (o.id === editingId ? res.data : o)));
        setSuccess("Offre modifiée ✅");
        resetForm();
      }
    } catch (e) {
      setErr(normalizeError(e));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(offer) {
    setErr("");
    setSuccess("");

    const ok = window.confirm(`Supprimer l'offre "${offer.title}" ?`);
    if (!ok) return;

    setDeletingId(offer.id);
    try {
      await api.delete(`/offers/${offer.id}`);
      setOffers((prev) => prev.filter((o) => o.id !== offer.id));
      setSuccess("Offre supprimée ✅");

      if (editingId === offer.id) resetForm();
    } catch (e) {
      setErr(normalizeError(e));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h3>Offres</h3>

      {/* Formulaire Create/Update */}
      <div className="card">
        <h4>{editingId == null ? "Créer une offre" : `Modifier l'offre #${editingId}`}</h4>

        {err && <p style={{ color: "crimson", marginTop: 8 }}>{err}</p>}
        {success && <p style={{ color: "green", marginTop: 8 }}>{success}</p>}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 720 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label>
              Entreprise <span style={{ color: "crimson" }}>*</span>
            </label>
            <select name="companyId" value={form.companyId} onChange={onChange} disabled={editingId != null}>
              <option value="">-- Sélectionner --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {editingId != null && (
              <small style={{ color: "#555" }}>
                (Pour simplifier, on ne change pas l’entreprise d’une offre en mode édition.)
              </small>
            )}
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>
              Titre <span style={{ color: "crimson" }}>*</span>
            </label>
            <input name="title" value={form.title} onChange={onChange} placeholder="Ex: Alternance Développeur Java" />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Localisation</label>
            <input name="location" value={form.location} onChange={onChange} placeholder="Ex: Paris" />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Technos</label>
            <input name="techStack" value={form.techStack} onChange={onChange} placeholder="Ex: Java, Spring, React" />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Lien</label>
            <input name="url" value={form.url} onChange={onChange} placeholder="https://..." />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={3} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : editingId == null ? "Créer" : "Enregistrer"}
            </button>

            {editingId != null && (
              <button type="button" onClick={resetForm} disabled={saving}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste + filtre */}
      <div className="card">
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <h4 style={{ margin: 0 }}>Liste des offres</h4>
          <button onClick={loadAll} disabled={loading}>
            {loading ? "Chargement..." : "Rafraîchir"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
          <label>Filtrer par entreprise :</label>
          <select value={filterCompanyId} onChange={(e) => setFilterCompanyId(e.target.value)}>
            <option value="">Toutes</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span style={{ color: "#555" }}>
            {filteredOffers.length} offre(s)
          </span>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : filteredOffers.length === 0 ? (
          <p>Aucune offre.</p>
        ) : (
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            {filteredOffers.map((o) => (
              <li
                key={o.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 0",
                }}
              >
                <div>
                  <b>{o.title}</b>
                  <div style={{ color: "#555" }}>
                    {o?.company?.name ? `${o.company.name}` : "Entreprise ?"}
                    {o.location ? ` — ${o.location}` : ""}
                    {o.techStack ? ` — ${o.techStack}` : ""}
                  </div>
                  {o.url && (
                    <div>
                      <a href={o.url} target="_blank" rel="noreferrer">
                        Lien
                      </a>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => startEdit(o)}>Modifier</button>
                  <button onClick={() => onDelete(o)} disabled={deletingId === o.id}>
                    {deletingId === o.id ? "Suppression..." : "Supprimer"}
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
