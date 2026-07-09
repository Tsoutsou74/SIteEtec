# TODO — Intégration API REST (Backend ↔ Frontend)

> Analyse des incohérences entre les appels frontend (`fontend/src/services/ApiService.ts`)
> et les vrais endpoints backend (controllers Spring Boot des microservices).

---

## 🔴 Bloquant — Chemins API frontend vs backend

### 1. Ressources

| Frontend (appelle) | Backend (existe) |
|---|---|
| `/api/ressours` | `/api/ressources` |

**Action :** Corriger la faute de frappe `ressours` → `ressources` dans `ApiService.ts:182,184,186,188` et `SecurityConfig.java:36`.

---

### 2. Étudiant

| Frontend | Backend |
|---|---|
| `/api/etudiant` | `/etudiants` |

**Action :** Frontend appelle `/api/etudiant` (singulier) mais backend a `/etudiants` (pluriel, sans `/api/`).  
→ Décider : aligner le frontend sur le backend (modifier `ApiService.ts:147,149,151,153,155`) OU ajouter une route gateway qui traduit.  
  → Le plus simple : modifier `EtudiantController.java:19` en `@RequestMapping("/api/etudiants")`.

---

### 3. Enseignant

| Frontend | Backend |
|---|---|
| `/api/enseignant` | `/api/Enseignants` |

**Action :** Frontend en minuscule/singulier, backend en capital/pluriel.  
→ Aligner l'un sur l'autre. Suggestion : mettre le backend en `@RequestMapping("/api/enseignants")`.

---

### 4. Admin

| Frontend | Backend |
|---|---|
| `/api/admin` | `/api/admins` |

**Action :** Aligner. Suggestion : backend → `@RequestMapping("/api/admins")`.

---

### 5. Domaines

| Frontend | Backend |
|---|---|
| `/api/domains` | `/api/domaines` |

**Action :** `domains` (anglais) → `domaines` (français). Corriger dans `ApiService.ts:213,215,217,219,221` et `SecurityConfig.java:39`.

---

### 6. Filieres

| Frontend | Backend |
|---|---|
| `/api/filiers` | `/api/filieres` |

**Action :** Faute de frappe `filiers` → `filieres`. Corriger dans `ApiService.ts:302-310` et `SecurityConfig.java:43`.

---

### 7. Historiques

| Frontend | Backend |
|---|---|
| `/api/historiques` | `/api/histoires` |

**Action :** Aligner. Suggestion : backend → `@RequestMapping("/api/historiques")`.

---

### 8. Encadreurs

| Frontend | Backend |
|---|---|
| `/api/encadreurs` | `/encadreurs` |

**Action :** Backend manque le préfixe `/api`. Ajouter `/api/encadreurs` dans `EncadreurController.java:11`.

---

### 9. Emails

| Frontend | Backend |
|---|---|
| `/api/emails` | `/emails` |

**Action :** Backend manque le préfixe `/api`. Ajouter `/api/emails` dans `EmailController.java:13`.
⚠️ Aussi : `SecurityConfig.java:40` a `"api/emails/**"` SANS le `/` au début.

---

### 10. Notifications

| Frontend | Backend |
|---|---|
| `/api/notifications` | `/notifications` |

**Action :** Backend manque `/api`. Ajouter `/api/notifications` dans `NotificationController.java:14`.

---

### 11. Formation en ligne

| Frontend | Backend |
|---|---|
| `/api/formationEnLigne` | `/formation_enligne` |

**Action :** Backend utilise snake_case sans `/api`. Aligner. Suggestion : backend → `/api/formationEnLigne`.

---

### 12. Formation Initiale / Continue

| Frontend appelle | Backend concerné |
|---|---|
| `/api/formationInitiale` | ❌ **Aucun backend trouvé** |
| `/api/formationContinue` | ❌ **Aucun backend trouvé** |

**Action :** Créer les microservices `formation-initiale` et `formation-continue` OU désactiver les appels si ces fonctionnalités ne sont pas encore développées.

---

### 13. Contacts

| Frontend appelle | Backend concerné |
|---|---|
| `/api/contacts` | ❌ **Aucun backend trouvé** |

**Action :** Créer le microservice `contact` OU désactiver les appels. Actuellement utilisé dans `ContactPage.tsx:25-27` et `AdmissionPage.tsx:31`.

---

## 🟡 Important — Configuration Gateway

### 14. Routes manquantes dans GatewayConfig.java

Seulement **7 routes** sont définies. Tous les autres microservices sont accessibles via leur path réel mais **aucune route explicite** :
- [ ] `domaines` → lb://DOMAINE
- [ ] `encadreurs` → lb://ENCADREUR
- [ ] `encadrements` → lb://ENCADREMENT
- [ ] `emails` → lb://EMAIL
- [ ] `emploiDuTemps` → lb://EMPLOIDUTEMPS
- [ ] `filieres` → lb://FILIERE
- [ ] `formationInitiale` → lb://FORMATIONINITIALE
- [ ] `formationContinue` → lb://FORMATIONCONTINUE
- [ ] `formationEnLigne` → lb://FORMATIONENLIGNE
- [ ] `historiques` → lb://HISTORIQUE
- [ ] `matieres` → lb://MATIERE
- [ ] `memoires` → lb://MEMOIRE
- [ ] `moyennes` → lb://MOYENNE
- [ ] `niveau` → lb://NIVEAU
- [ ] `notes` → lb://NOTE
- [ ] `notifications` → lb://NOTIFICATION
- [ ] `organigrammes` → lb://ORGANIGRAMME
- [ ] `presences` → lb://PRESENCE
- [ ] `mots` → lb://PRESIDENT
- [ ] `semestres` → lb://SEMESTRE
- [ ] `slides` → lb://SLIDES
- [ ] `anneesUniv` → lb://UNIVESITAIRE
- [ ] `chapitres` → lb://COURSENLIGNE
- [ ] `lecons` → lb://COURSENLIGNE
- [ ] `ressources` → lb://COURSENLIGNE
- [ ] `videos` → lb://COURSENLIGNE
- [ ] `contacts` → lb://CONTACT

### 15. SecurityConfig — correction obligatoire

- Ligne 40 : `"api/emails/**"` → `"/api/emails/**"` (slash manquant)

---

## 🟡 Important — Gestion des erreurs

### 16. Pas de `@ControllerAdvice` / `@ExceptionHandler` dans le backend

Aucun microservice ne définit de gestionnaire global d'exceptions. Cela provoque des réponses **500** avec stacktrace brute.

**Action :** Créer un `GlobalExceptionHandler` avec `@ControllerAdvice` commune (dans `common/` ou dans chaque service) :

| Exception | HTTP Status |
|---|---|
| `ResourceNotFoundException` | 404 |
| `BadRequestException` | 400 |
| `MethodArgumentNotValidException` | 400 |
| `AccessDeniedException` | 403 |
| `AuthenticationException` | 401 |
| `Exception` (fallback) | 500 |

### 17. Pas d'Error Boundary côté React

**Action :** Ajouter un Error Boundary React (`ErrorBoundary.tsx`) pour capturer les erreurs de rendu, et améliorer les blocs `try/catch` existants pour un affichage utilisateur cohérent (toast/notification).

---

## 🟢 Recommandé — Refactoring services

### 18. Supprimer / implémenter les stubs

Les fichiers suivants ne contiennent que leur nom (stubs vides) :
- `src/services/faculty.service.ts`
- `src/services/news.service.ts`
- `src/feature/auth/services/auth.service.ts`
- `src/feature/admissions/services/admission.service.ts`
- `src/feature/news/services/news.service.ts`
- `src/feature/events/services/event.service.ts`
- `src/feature/faculties/services/faculty.service.ts`

### 19. Uniformiser les noms des application.properties / Eureka

Vérifier que `spring.application.name` dans chaque backend correspond exactement au nom cible dans les routes Gateway :
- Ex. `lb://ACTUALITE` → le service doit être enregistré sous `ACTUALITE` sur Eureka

---

## 📋 Checklist

- [x] **1–13** : Corriger tous les chemins API (frontend ou backend selon décision)
- [x] **14** : Ajouter toutes les routes Gateway manquantes
- [x] **15** : Corriger le slash manquant dans `SecurityConfig.java`
- [x] **16** : Implémenter `@ControllerAdvice` global dans le backend
- [x] **17** : Ajouter ErrorBoundary React
- [x] **18** : Nettoyer les stubs services
- [ ] **19** : Vérifier les noms Eureka
- [ ] Tester après chaque correction — vérifier que les erreurs 400/405/500 disparaissent
