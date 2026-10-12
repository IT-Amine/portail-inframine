# portail-inframine

Portail et landing page officielle d'**Inframine** — Plateforme d'orchestration et de pilotage d'infrastructure souveraine.
Hébergée sur GitHub Pages avec le sous-domaine **`portail.inframine.me`**, DNS et messagerie gérés via **Cloudflare**.

---

## 📁 Structure du projet

```text
portail-inframine/
├── index.html        # Structure sémantique, formulaires RGPD, FAQ & modales légales
├── style.css         # Thème sombre sobre (IBM Plex, marine #09101F & cuivre #C4963A)
├── script.js         # Validation e-mail & consentement CNIL, gestion des modales <dialog>
├── CNAME             # Configuration du domaine personnalisé (portail.inframine.me)
├── LICENSE           # Licence libre MIT (Copyright 2026 Inframine - Amine KADA)
└── README.md         # Guide technique, sécurité et conformité réglementaire
```

---

## ⚖️ Conformité Réglementaire & Sécurité (RGPD, CNIL, ANSSI)

Cette interface a été conçue pour respecter strictement le cadre légal français et européen dès la conception (*Privacy & Security by Design*) :

### 1. Règlement Général sur la Protection des Données (RGPD) & CNIL
* **Minimisation des données (Art. 5.1.c RGPD)** : Seule l'adresse e-mail professionnelle est collectée. Aucune donnée superficielle (nom, téléphone, tracking IP) n'est requise.
* **Consentement libre et éclairé (Art. 6 & 7 RGPD)** : Case à cocher de consentement explicite et non pré-cochée.
* **Traçabilité du consentement** : Enregistrement de l'horodatage (`timestamp` ISO 8601) et du statut de conformité lors de chaque soumission.
* **Exercice des droits (Art. 15 à 22 RGPD)** : Mention claire de l'adresse de contact (`contact@inframine.me`) pour toute demande d'accès, rectification ou suppression (droit à l'oubli sous 48h).
* **Architecture Zéro-Cookie (Recommandations CNIL)** : Ce site ne dépose aucun cookie de profilage ni traceur tiers. Aucun bandeau de consentement intrusif n'est requis conformément aux directives de la CNIL.

### 2. Bonnes pratiques de l'ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information)
* **Chiffrement en transit** : Forçage du protocole TLS 1.3 avec HSTS (*Strict-Transport-Security*).
* **Minimisation de la surface d'attaque** : Aucune dépendance JavaScript externe non vérifiée (code vanilla natif sans framework lourd).
* **Ségrégation et souveraineté** : Hébergement statique sécurisé, pas de base de données backend exposée publiquement.

---

## 💻 Tester en local

```bash
# Option A — Serveur Python natif (macOS / Linux)
python3 -m http.server 8000
# Ouvrez ensuite http://localhost:8000 dans votre navigateur

# Option B — Node.js
npx serve .
```

---

## 🌐 Déploiement GitHub Pages

1. Rendez-vous sur votre dépôt : **Settings** → **Pages**
2. Sous **Build and deployment** :
   * Source : `Deploy from a branch`
   * Branch : `main` / dossier `/ (root)` → Cliquez sur **Save**
3. GitHub Pages prend automatiquement en compte le fichier `CNAME` (`portail.inframine.me`).
4. Cochez **Enforce HTTPS** une fois le certificat SSL validé.

---

## ☁️ Configuration Cloudflare (DNS, SSL & Messagerie)

### A. Enregistrement DNS pour `portail.inframine.me`
Dans le tableau de bord Cloudflare → domaine `inframine.me` → **DNS** → **Add record** :

| Type | Name | Target | Proxy status | TTL |
|------|------|--------|--------------|-----|
| `CNAME` | `portail` | `it-amine.github.io` | **DNS Only** (nuage gris) ¹ | `Auto` |

> ¹ Laissez le nuage **gris** le temps de la validation initiale du certificat Let's Encrypt par GitHub Pages (15 à 30 min). Vous pourrez ensuite basculer en **Proxy orange** pour profiter de l'accélération CDN Cloudflare.

### B. Configuration SSL/TLS
* Allez dans **SSL/TLS** → **Overview** :
* Sélectionnez le mode **Full** ou **Full (Strict)** pour éviter toute boucle de redirection infinie.

### C. Réception des e-mails `contact@inframine.me`
* Dans Cloudflare → **Email Routing** (gratuit) :
* Créez une règle personnalisée : `contact@inframine.me` → redirection vers votre boîte de réception principale.

---

## 🔒 Headers HTTP de sécurité recommandés (Cloudflare)

Dans Cloudflare (**Rules** → **Transform Rules** → **Modify Response Header**) :

| Header | Valeur recommandée |
|--------|---------------------|
| `Content-Security-Policy` | `default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; frame-ancestors 'none'` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |

---

## 📄 Licence

Ce projet est distribué sous les termes de la [Licence MIT](LICENSE).  
Copyright (c) 2026 Inframine — Amine KADA.