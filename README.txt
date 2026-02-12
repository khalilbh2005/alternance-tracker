# 🚀 Alternance Tracker

Application full-stack pour gérer sa recherche d’alternance : entreprises, offres, candidatures, relances et entretiens.

---

## ✨ Fonctionnalités

### 📊 Dashboard
- statistiques des candidatures
- candidatures à relancer
- répartition par statut

### 🏢 Entreprises
- créer / modifier / supprimer une entreprise
- gestion des contacts RH

### 💼 Offres
- CRUD complet
- association avec une entreprise

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
- suivi des résultats

---

## 🛠️ Stack Technique

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- REST API

### Frontend
- React (Vite)
- Axios
- CSS custom (design futuriste)

---

## 🧱 Architecture

alternance-tracker/
├── backend/ (Spring Boot API)
└── frontend/ (React application)


---

## 🗄️ Configuration Base de Données

Le backend utilise MySQL.

### 1️⃣ Créer la base

```sql
CREATE DATABASE alternance_db;

2️⃣ Configurer application.properties

Fichier :

backend/src/main/resources/application.properties


Exemple :

spring.datasource.url=jdbc:mysql://localhost:3306/alternance_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=XXXX

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true


⚠️ Assurez-vous que MySQL est démarré avant de lancer le backend.

⚙️ Installation
1️⃣ Cloner le projet
git clone https://github.com/TON-USERNAME/alternance-tracker.git

2️⃣ Lancer le Backend
cd backend
mvn spring-boot:run


API disponible :

http://localhost:8080/api

3️⃣ Lancer le Frontend
cd frontend
npm install
npm run dev


Application disponible :

http://localhost:5173

👨‍💻 Auteur

Projet développé par Khalil BEN HAMZA
