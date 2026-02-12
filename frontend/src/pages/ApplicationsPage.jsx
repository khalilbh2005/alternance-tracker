import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";

const STATUSES = ["SPOTTED", "APPLIED", "FOLLOW_UP", "INTERVIEW", "ACCEPTED", "REJECTED"];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);

  // filtres
  const [filterStatus, setFilterStatus] = useState("");
  const [showFollowUpOnly, setShowFollowUpOnly] = useState(false);

  const [form, setForm] = useState({
    offerId: "",
    status: "APPLIED",
    appliedAt: "",
    followUpAt: "",
    channel: "",
    notes: "",
  });

  function normalizeError(e) {
    const data = e?.response?.data;
    if (data?.fieldErrors) {
      const msgs = Object.entries(data.fieldErrors).map(([field, msg]) => `${field}: ${msg}`);
      return msgs.join(" | ");
    }
    return data?.message || e?.message || "Erreur";
  }

  async function loadOffers() {
    const res = await api.get("/offers");
    setOffers(res.data || []);
  }

  async function loadApplications({ status = "", followUpOnly = false } = {}) {
    let url = "/applications";
    if (followUpOnly) {
      url = "/applications/to-follow-up";
    } else if (status) {
      url = `/applications?status=${encodeURIComponent(status)}`;
    }
    const res = await api.get(url);
    setApplications(res.data || []);
  }

  async function loadAll() {
    setLoading(true);
    setErr("");
    try {
      await Promise.all([loadOffers(), loadApplications({ status: filterStatus, followUpOnly: showFollowUpOnly })]);
    } catch (e) {
      setErr(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quand on change les filtres, on recharge seulement les candidatures
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        await loadApplications({ status: filterStatus, followUpOnly: showFollowUpOnly });
      } catch (e) {
        setErr(normalizeError(e));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, showFollowUpOnly]);

  const offersById = useMemo(() => {
    const m = new Map();
    for (const o of offers) m.set(o.id, o);
    return m;
  }, [offers]);

  function resetForm() {
    setForm({
      offerId: "",
      status: "APPLIED",
      appliedAt: "",
      followUpAt: "",
      channel: "",
      notes: "",
    });
    setEditingId(null);
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function startEdit(app) {
    setErr("");
    setSuccess("");
    setEditingId(app.id);

    const offerId =
      app?.offer?.id
        ? String(app.offer.id)
        : ""; // si ton backend renvoie offer (normalement oui)

    setForm({
      offerId,
      status: app.status || "APPLIED",
      appliedAt: app.appliedAt || "",
      followUpAt: app.followUpAt || "",
      channel: app.channel || "",
      notes: app.notes || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");

    const offerIdNum = Number(form.offerId);
    if (!offerIdNum) {
      setErr("offerId: Sélectionne une offre");
      return;
    }

    const payload = {
      status: form.status,
      appliedAt: form.appliedAt || null,
      followUpAt: form.followUpAt || null,
      channel: form.channel.trim() || null,
      notes: form.notes.trim() || null,
    };

    setSaving(true);
    try {
      if (editingId == null) {
        // CREATE
        const res = await api.post(`/applications?offerId=${offerIdNum}`, payload);
        setApplications((prev) => [res.data, ...prev]);
        setSuccess("Candidature créée ✅");
        resetForm();
      } else {
        // UPDATE
        const res = await api.put(`/applications/${editingId}`, payload);

        // Note: ton backend ne change pas l'offre sur update (simple)
        setApplications((prev) => prev.map((a) => (a.id === editingId ? res.data : a)));
        setSuccess("Candidature modifiée ✅");
        resetForm();
      }
    } catch (e) {
      setErr(normalizeError(e));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(app) {
    setErr("");
    setSuccess("");

    const ok = window.confirm(`Supprimer la candidature #${app.id} ?`);
    if (!ok) return;

    setDeletingId(app.id);
    try {
      await api.delete(`/applications/${app.id}`);
      setApplications((prev) => prev.filter((a) => a.id !== app.id));
      setSuccess("Candidature supprimée ✅");
      if (editingId === app.id) resetForm();
    } catch (e) {
      setErr(normalizeError(e));
    } finally {
      setDeletingId(null);
    }
  }

  function getOfferLabel(app) {
    // si l'API renvoie offer/company dans l'application
    if (app?.offer?.title) {
      const companyName = app?.offer?.company?.name ? ` — ${app.offer.company.name}` : "";
      return `${app.offer.title}${companyName}`;
    }

    // fallback: si on a offerId quelque part (pas prévu), ou sinon "?"
    return "Offre ?";
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h3>Candidatures</h3>

      {/* Formulaire Create/Update */}
      <div className="card">
        <h4>{editingId == null ? "Créer une candidature" : `Modifier la candidature #${editingId}`}</h4>

        {err && <p style={{ color: "crimson", marginTop: 8 }}>{err}</p>}
        {success && <p style={{ color: "green", marginTop: 8 }}>{success}</p>}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 760 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label>
              Offre <span style={{ color: "crimson" }}>*</span>
            </label>
            <select name="offerId" value={form.offerId} onChange={onChange} disabled={editingId != null}>
              <option value="">-- Sélectionner --</option>
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title} — {o?.company?.name || "Entreprise ?"}
                </option>
              ))}
            </select>
            {editingId != null && (
              <small style={{ color: "#555" }}>
                (Pour simplifier, on ne change pas l’offre d’une candidature en mode édition.)
              </small>
            )}
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Statut</label>
            <select name="status" value={form.status} onChange={onChange}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Date d’envoi</label>
            <input type="date" name="appliedAt" value={form.appliedAt} onChange={onChange} />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Date de relance</label>
            <input type="date" name="followUpAt" value={form.followUpAt} onChange={onChange} />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Canal</label>
            <input name="channel" value={form.channel} onChange={onChange} placeholder="LinkedIn, email, site..." />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={onChange} rows={3} />
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

      {/* Filtres */}
      <div className="card">
        <h4 style={{ marginTop: 0 }}>Filtres</h4>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <label>Statut :</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setShowFollowUpOnly(false);
              setFilterStatus(e.target.value);
            }}
          >
            <option value="">Tous</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setFilterStatus("");
              setShowFollowUpOnly(true);
            }}
          >
            À relancer
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterStatus("");
              setShowFollowUpOnly(false);
            }}
          >
            Réinitialiser
          </button>

          <button type="button" onClick={loadAll} disabled={loading}>
            {loading ? "Chargement..." : "Rafraîchir"}
          </button>

          <span style={{ color: "#555" }}>{applications.length} candidature(s)</span>
        </div>
      </div>

      {/* Liste */}
      <div className="card">
        <h4 style={{ marginTop: 0 }}>Liste</h4>

        {loading ? (
          <p>Chargement...</p>
        ) : applications.length === 0 ? (
          <p>Aucune candidature.</p>
        ) : (
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            {applications.map((a) => (
              <li
                key={a.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 0",
                }}
              >
                <div>
                  <b>#{a.id}</b> — <b>{a.status}</b>
                  <div style={{ color: "#555" }}>{getOfferLabel(a)}</div>
                  <div style={{ color: "#555" }}>
                    {a.appliedAt ? `Envoyée: ${a.appliedAt}` : ""}
                    {a.followUpAt ? ` — Relance: ${a.followUpAt}` : ""}
                    {a.channel ? ` — Canal: ${a.channel}` : ""}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => startEdit(a)}>Modifier</button>
                  <button onClick={() => onDelete(a)} disabled={deletingId === a.id}>
                    {deletingId === a.id ? "Suppression..." : "Supprimer"}
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
