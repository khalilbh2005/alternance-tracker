import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import "./styles/theme.css";
import "./styles/layout.css";

import DashboardPage from "./pages/DashboardPage.jsx";
import CompaniesPage from "./pages/CompaniesPage.jsx";
import OffersPage from "./pages/OffersPage.jsx";
import ApplicationsPage from "./pages/ApplicationsPage.jsx";

function Layout() {
  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo" />
          <div>
            <h1>Alternance Tracker</h1>
            <p>Dashboard • Entreprises • Offres • Candidatures</p>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/companies">Entreprises</NavLink>
          <NavLink to="/offers">Offres</NavLink>
          <NavLink to="/applications">Candidatures</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
      </Routes>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>
);
