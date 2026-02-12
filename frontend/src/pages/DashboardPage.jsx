import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import "./DashboardPage.css";

function StatLabel({ status }) {
  const map = {
    SPOTTED: "Repérée",
    APPLIED: "Envoyée",
    FOLLOW_UP: "Relance",
    INTERVIEW: "Entretien",
    ACCEPTED: "Acceptée",
    REJECTED: "Refusée",
  };
  return map[status] || status;
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setData(res.data))
      .catch((e) => setErr(e?.response?.data?.message || e?.message || "Erreur"));
  }, []);

  const stats = useMemo(() => {
    const obj = data?.applicationsByStatus || {};
    return Object.entries(obj).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  }, [data]);

  if (err) return <div className="card"><p className="error">Erreur: {err}</p></div>;
  if (!data) return <div className="card"><p className="muted">Chargement...</p></div>;

  const total = stats.reduce((sum, [, v]) => sum + (v ?? 0), 0);
  const max = Math.max(1, stats[0]?.[1] || 1);

  return (
    <div className="dashWrap">
      <div className="dashHead">
        <div>
          <h2 className="dashTitle">Dashboard</h2>
          <p className="dashSub muted">Vue rapide + priorités du jour</p>
        </div>
        <span className="dashPill">
          <span className="dashDot" />
          Live
        </span>
      </div>

      <div className="dashKpiGrid">
        <div className="card dashKpi">
          <div className="row">
            <span className="muted">À relancer</span>
            <span className="badge glow">Suivi</span>
          </div>
          <div className="dashKpiValue">{data.toFollowUpCount}</div>
          <p className="muted dashHint">Relances dues aujourd’hui ou avant</p>
        </div>

        <div className="card dashKpi">
          <div className="row">
            <span className="muted">Total</span>
            <span className="badge">Candidatures</span>
          </div>
          <div className="dashKpiValue">{total}</div>
          <p className="muted dashHint">Enregistrées dans ton tracker</p>
        </div>

        <div className="card dashKpi">
          <div className="row">
            <span className="muted">Focus</span>
            <span className="badge">Prochaine</span>
          </div>
          <div className="dashKpiValue dashKpiSmall">
            {data?.toFollowUp?.[0]?.companyName || "—"}
          </div>
          <p className="muted dashHint">Première relance à traiter</p>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <h3 className="dashH3">Candidatures par statut</h3>
          <span className="badge">{stats.length} statuts</span>
        </div>

        <div className="dashStats">
          {stats.map(([k, v]) => (
            <div className="dashStatRow" key={k}>
              <div className="dashStatLeft">
                <span className={`dashStatusDot dash-${k}`} />
                <span className="dashStatKey"><StatLabel status={k} /></span>
              </div>
              <div className="dashStatRight">
                <span className="dashStatVal">{v}</span>
                <div className="dashBar">
                  <div className="dashBarFill" style={{ width: `${(v / max) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="row">
          <h3 className="dashH3">À relancer (top 10)</h3>
          <span className="badge glow">{(data.toFollowUp || []).length} éléments</span>
        </div>

        {(data.toFollowUp || []).length === 0 ? (
          <p className="muted">Rien à relancer 🎉</p>
        ) : (
          <div className="dashTable">
            <div className="dashThead">
              <div>ID</div><div>Entreprise</div><div>Offre</div><div>Relance</div>
            </div>
            {data.toFollowUp.map((x) => (
              <div className="dashTrow" key={x.id}>
                <div className="dashMono">#{x.id}</div>
                <div className="dashStrong">{x.companyName || "—"}</div>
                <div className="muted">{x.offerTitle || "—"}</div>
                <div><span className="badge">{x.followUpAt || "—"}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
