# portail-inframine

Landing page officielle d'**Inframine** — hébergée sur GitHub Pages avec le sous-domaine **`portail.inframine.me`**, DNS et e-mail gérés via **Cloudflare**.

---

## 📁 Structure du projet

```
portail-inframine/
├── index.html        # Structure HTML5 sémantique et accessible
├── style.css         # Palette navy/cuivre, IBM Plex Sans, responsive
├── script.js         # Validation e-mail, état de chargement, confirmation
├── CNAME             # Domaine personnalisé GitHub Pages → portail.inframine.me
└── README.md
```

---

## 💻 Tester en local

```bash
# Option A — Python (disponible nativement sur macOS)
python3 -m http.server 8000
# Ouvrez http://localhost:8000

# Option B — Node.js
npx serve .
```

---

## 🌐 Déploiement GitHub Pages

1. Aller sur le dépôt → **Settings** → **Pages**
2. Source : `Deploy from a branch` → branche `main` / `/ (root)` → **Save**
3. GitHub détecte automatiquement le fichier `CNAME` (`portail.inframine.me`)
4. Cocher **Enforce HTTPS** une fois le certificat généré (15–30 min)

---

## ☁️ Configuration Cloudflare

### A. Enregistrement DNS pour `portail.inframine.me`

Dashboard Cloudflare → domaine `inframine.me` → **DNS** → **Add record** :

| Champ          | Valeur                  |
|----------------|-------------------------|
| Type           | `CNAME`                 |
| Name           | `portail`               |
| Target         | `it-amine.github.io`    |
| Proxy status   | DNS Only (nuage gris) ¹ |
| TTL            | Auto                    |

> ¹ Laisser en **DNS Only** le temps que GitHub Pages génère le certificat SSL Let's Encrypt. Repasser en **Proxy (orange)** ensuite pour bénéficier du CDN Cloudflare.

### B. SSL/TLS

- Cloudflare → **SSL/TLS** → **Overview** → Mode : **Full** ou **Full (Strict)**
- Évite les boucles de redirection HTTP infinies avec GitHub Pages

### C. Réception des e-mails `contact@inframine.me`

- Cloudflare → **Email Routing** (gratuit)
- Créer une règle : `contact@inframine.me` → redirection vers votre boîte personnelle

---

## 🔒 Sécurité

### Headers HTTP via Cloudflare Transform Rules

Activer ces en-têtes de sécurité sur Cloudflare (**Rules** → **Transform Rules** → **Modify Response Header**) :

| Header                      | Valeur recommandée                                                  |
|-----------------------------|---------------------------------------------------------------------|
| `Content-Security-Policy`   | `default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; frame-ancestors 'none'` |
| `X-Frame-Options`           | `DENY`                                                              |
| `X-Content-Type-Options`    | `nosniff`                                                           |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                                   |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`                          |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload`                      |

> Cloudflare applique déjà **HSTS** et **TLS 1.2+ forcé** automatiquement dès que le proxy est activé.

### Bonnes pratiques actives sur ce projet

- ✅ **Pas de dépendances tierces à risque** — aucun script externe chargé hormis Google Fonts (police affichage uniquement, pas d'exécution de code)
- ✅ **Formulaire sans backend exposé** — en production, remplacer le `setTimeout` par un appel à un **Cloudflare Worker** ou **Formspree** (voir `script.js`)
- ✅ **Enforce HTTPS** activé sur GitHub Pages — tout trafic HTTP redirigé automatiquement
- ✅ **Pas de cookies tiers** ni tracking sur cette page

### Formspree / Cloudflare Worker (intégration e-mail production)

Pour remplacer la simulation locale dans `script.js` par un vrai envoi :

**Option A — Formspree (le plus simple) :**
```js
fetch('https://formspree.io/f/VOTRE_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
});
```

**Option B — Cloudflare Worker (contrôle total) :**
```js
fetch('https://api.portail.inframine.me/waitlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
});
```
Le Worker stocke l'adresse dans **Cloudflare KV** et envoie un accusé via **Cloudflare Email Routing** ou l'API SendGrid/Resend.

---

## 📬 Contact

**contact@inframine.me**