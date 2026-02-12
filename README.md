<h1 align="center">🚀 Alternance Tracker</h1>

<p align="center">
Application full-stack pour gérer et suivre efficacement sa recherche d’alternance :
entreprises, offres, candidatures, relances et entretiens.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Java-17-orange?logo=openjdk"/>
</p>

---

## ✨ Fonctionnalités

### 📊 Dashboard
- statistiques des candidatures
- visualisation des statuts
- liste des candidatures à relancer

### 🏢 Entreprises
- création / modification / suppression
- gestion des contacts RH

### 💼 Offres
- CRUD complet
- association entreprise ↔ offre

### 📩 Candidatures
- suivi par statut :
  - SPOTTED
  - APPLIED
  - FOLLOW_UP
  - INTERVIEW
  - ACCEPTED
  - REJECTED
- filtres dynamiques
- relances

### 🎤 Entretiens
- planification
- suivi du résultat

---

## 🛠️ Stack Technique

| Backend | Frontend | Database |
|---|---|---|
| Java 17 | React (Vite) | MySQL |
| Spring Boot | Axios | |
| Spring Data JPA | CSS custom | |
| Hibernate | | |

---

## 🧱 Architecture
alternance-tracker/
├── backend/ → API REST Spring Boot
└── frontend/ → Application React


Architecture basée sur :

- séparation Frontend / Backend
- API REST JSON
- relations JPA (OneToMany / ManyToOne)

---

## 🗄️ Configuration Base de Données

### 1️⃣ Créer la base

```sql
CREATE DATABASE alternance_db;

2️⃣ Configurer application.properties
backend/src/main/resources/application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/alternance_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=XXXX

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true


Spring Boot créera automatiquement les tables.

⚙️ Installation
1️⃣ Cloner le projet
git clone https://github.com/TON-USERNAME/alternance-tracker.git

2️⃣ Lancer le Backend
cd backend
mvn spring-boot:run


API :

http://localhost:8080/api

3️⃣ Lancer le Frontend
cd frontend
npm install
npm run dev


App :

http://localhost:5173

📸 Screenshots
/screenshots/dashboard.png
/screenshots/companies.png
/screenshots/offers.png
/screenshots/applications.png

🔗 API REST (exemples)
GET    /api/dashboard
GET    /api/companies
POST   /api/offers?companyId=...
GET    /api/applications/to-follow-up


🎯 Objectifs du projet

concevoir une API REST complète avec Spring Boot

modéliser une base relationnelle

créer une interface React connectée

implémenter un design UI moderne

👨‍💻 Auteur

Khalil BEN HAMZA

