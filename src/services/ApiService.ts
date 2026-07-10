import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// =====================================================================
// CONFIGURATION
// =====================================================================

const STUDENT_PROFILE_DEMO = {
  nom: "RAKOTO",
  prenom: "Andry",
  matricule: "ETU-2024-0042",
  niveau: "L3 Info",
};

const ONLINE_LESSONS_BY_COURSE: Record<
  string,
  Array<{ id: string; title: string; duration: string; status: "Termine" | "En cours" | "Bloque" }>
> = {
  "m-3": [
    { id: "l1", title: "Introduction aux modeles relationnels", duration: "18 min", status: "Termine" },
    { id: "l2", title: "Dependances fonctionnelles", duration: "24 min", status: "Termine" },
    { id: "l3", title: "Normalisation 3NF / BCNF", duration: "31 min", status: "En cours" },
    { id: "l4", title: "Transactions et indexation", duration: "28 min", status: "Bloque" },
  ],
  "m-4": [
    { id: "l1", title: "Architecture Vite et React", duration: "22 min", status: "Termine" },
    { id: "l2", title: "Hooks React et consommation API", duration: "36 min", status: "En cours" },
    { id: "l3", title: "Routes protegees et dashboard", duration: "41 min", status: "Bloque" },
    { id: "l4", title: "Integration Node et Express", duration: "34 min", status: "Bloque" },
  ],
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function attachDemo<T>(data: T): Promise<{ data: T }> {
  return success(clone(data));
}

let STUDENT_NOTIFICATIONS_STATE = clone(STUDENT_NOTIFICATIONS_DEMO);
let TEACHER_COURSES_STATE = clone(TEACHER_COURSES_DEMO);

function getStudentCourseDetails(courseId: string | number | undefined) {
  const selectedCourse =
    STUDENT_COURS_DEMO.find((course) => course.id === String(courseId)) ??
    STUDENT_COURS_DEMO[0];

  const lessons = ONLINE_LESSONS_BY_COURSE[selectedCourse.id] ?? [
    { id: "l1", title: "Module introductif", duration: "20 min", status: "Termine" },
    { id: "l2", title: "Cours principal", duration: "35 min", status: "En cours" },
    { id: "l3", title: "Exercices", duration: "25 min", status: "Bloque" },
  ];

  return {
    id: selectedCourse.id,
    code: selectedCourse.code,
    title: selectedCourse.nom,
    teacher: selectedCourse.enseignant,
    progress: selectedCourse.avancement,
    currentLesson:
      lessons.find((lesson) => lesson.status === "En cours")?.title ??
      lessons[0]?.title ??
      selectedCourse.nom,
    lessons,
    activities: selectedCourse.activites.map((activity, index) => ({
      id: `${selectedCourse.id}-activity-${index + 1}`,
      type: activity.type,
      title: activity.titre,
      dueDate: activity.echeance,
      status: activity.statut,
      description:
        activity.type === "devoir"
          ? "Travail a remettre via la plateforme."
          : "Evaluation rapide a faire en ligne.",
    })),
    resources: selectedCourse.fichiers.map((file) => ({
      name: file.nom,
      size: file.taille,
    })),
  };
}

function updateNotification(
  id: string | number,
  updater: (item: (typeof STUDENT_NOTIFICATIONS_STATE)[number]) => (typeof STUDENT_NOTIFICATIONS_STATE)[number]
) {
  STUDENT_NOTIFICATIONS_STATE = STUDENT_NOTIFICATIONS_STATE.map((item) =>
    item.id === String(id) ? updater(item) : item
  );
}

function removeNotification(id: string | number) {
  STUDENT_NOTIFICATIONS_STATE = STUDENT_NOTIFICATIONS_STATE.filter((item) => item.id !== String(id));
}

function updateTeacherCourse(id: string | number, payload: Record<string, unknown>) {
  const index = TEACHER_COURSES_STATE.findIndex((course) => course.id === String(id));
  if (index < 0) return null;

  const updated = {
    ...TEACHER_COURSES_STATE[index],
    ...payload,
    id: TEACHER_COURSES_STATE[index].id,
  };
  TEACHER_COURSES_STATE[index] = updated;
  return updated;
}

function addTeacherCourse(payload: Record<string, unknown>) {
  const created = {
    id: `c-${Date.now()}`,
    titre: String(payload.titre ?? ""),
    code: String(payload.code ?? ""),
    classe: String(payload.classe ?? ""),
    volumeHoraire: Number(payload.volumeHoraire ?? 0),
    description: String(payload.description ?? ""),
  };

  TEACHER_COURSES_STATE = [created, ...TEACHER_COURSES_STATE];
  return created;
}

function removeTeacherCourse(id: string | number) {
  TEACHER_COURSES_STATE = TEACHER_COURSES_STATE.filter((course) => course.id !== String(id));
}

/**
 * Toutes les requêtes passent par l'API Gateway (Spring Cloud Gateway).
 * La Gateway résout ensuite chaque microservice via Eureka (lb://NOM_SERVICE),
 * donc le frontend n'a jamais besoin de connaître les ports individuels.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

const TOKEN_KEY = "etec_access_token";
const REFRESH_TOKEN_KEY = "etec_refresh_token";

function attachData<T>(data: T): T & { data: T } {
  if (data !== null && typeof data === "object") {
    return Object.assign(data as object, { data }) as T & { data: T };
  }

  return { data } as T & { data: T };
}

// =====================================================================
// TOKEN HELPERS
// =====================================================================

export const TokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// =====================================================================
// AXIOS INSTANCE
// =====================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request interceptor: attach JWT ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = TokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor: handle 401 / uniform errors ---

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      TokenStorage.clear();
      window.location.href = "/log_in";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Alias en minuscule de l'instance Axios, pour compatibilité avec le code
 * existant qui fait `import { apiService } from ...`.
 */
export const apiService = apiClient;

// =====================================================================
// ERROR TYPE
// =====================================================================

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * Normalise une erreur Axios en ApiError exploitable côté UI.
 */
export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;
    return {
      message: data?.message ?? error.message ?? "Une erreur est survenue",
      status: error.response?.status,
      errors: data?.errors,
    };
  }
  return { message: "Une erreur inattendue est survenue" };
}

// =====================================================================
// GENERIC CRUD HELPERS
// =====================================================================

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return attachData(response.data);
}

async function requestRaw<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}

function getStoredUserId(): string {
  return (
    localStorage.getItem("etec_user_id") ||
    localStorage.getItem("userId") ||
    "1"
  );
}

function success<T>(data: T): Promise<{ data: T }> {
  return Promise.resolve({ data });
}

const STUDENT_COURS_DEMO = [
  {
    id: "m-1",
    code: "INF301",
    typeFormation: "initiale",
    domaine: "Informatique",
    nom: "Algorithmique Avancee & Complexite",
    enseignant: "M. ANDRIAMALALA Tahina",
    coefficient: 4,
    avancement: 75,
    lienVirtuel: "https://moodle.example.com/course/301",
    activites: [
      { type: "devoir", titre: "TD graphes et arbres binaires", echeance: "08 juillet 2026", statut: "En cours" },
      { type: "devoir", titre: "Projet complexite algorithmique", echeance: "15 juillet 2026", statut: "A faire" },
    ],
    fichiers: [
      { nom: "Ch01_Introduction_Graphes.pdf", type: "pdf", taille: "1.8 MB" },
      { nom: "TD1_Arbres_Binaires_Recherche.pdf", type: "pdf", taille: "850 KB" },
      { nom: "TP1_Correction_Java.zip", type: "zip", taille: "2.4 MB" },
    ],
  },
  {
    id: "m-3",
    code: "INF303",
    typeFormation: "enligne",
    domaine: "Informatique",
    nom: "Bases de Donnees Relationnelles",
    enseignant: "Mme. RAKOTOMALALA Feno",
    coefficient: 3,
    avancement: 90,
    lienVirtuel: "https://moodle.example.com/course/303",
    activites: [
      { type: "devoir", titre: "Projet BDD - schema relationnel", echeance: "12 juillet 2026", statut: "Termine" },
      { type: "quiz", titre: "Quiz normalisation 3NF / BCNF", echeance: "Disponible", statut: "A faire" },
    ],
    fichiers: [
      { nom: "Ch02_Normalisation_3NF_BCNF.pdf", type: "pdf", taille: "1.2 MB" },
      { nom: "Projet_BDD_Sujet_2026.pdf", type: "pdf", taille: "620 KB" },
    ],
  },
];

const STUDENT_HOME_DEMO = {
  infosPerso: {
    nom: "Etudiant",
    prenom: "Demo",
    mention: "Génie Logiciel",
    niveau: "L3",
    statutInscrit: true,
  },
  stats: {
    moyenne: 13.5,
    evolutionMoyenne: "0.8",
    modulesValides: "8 / 10",
    semestre: "Semestre 1",
    heuresCours: 24,
    absences: 2,
  },
  notes: [
    { matiere: "Algorithmes", note: 15 },
    { matiere: "Base de donnees", note: 12 },
    { matiere: "Web", note: 14 },
  ],
  evolutionMoyennes: [
    { sem: "S1", moy: 12.4 },
    { sem: "S2", moy: 13.1 },
    { sem: "S3", moy: 13.5 },
  ],
  emploiDuTemps: [
    { jour: "Lundi", heure: "08:00 - 10:00", matiere: "Algorithmes", salle: "A1", type: "Cours" },
    { jour: "Mardi", heure: "10:00 - 12:00", matiere: "BDD", salle: "B2", type: "TP" },
  ],
  echeances: [
    { label: "Projet BDD", date: "12 juillet 2026", color: "#22c55e" },
    { label: "Quiz React", date: "Disponible", color: "#3b82f6" },
  ],
};

const STUDENT_NOTES_DEMO = [
  { id: "n1", code: "INF301", matiere: "Algorithmique", noteDevoir: 15, noteExamen: 14, coefficient: 4, enseignant: "M. ANDRIAMALALA Tahina" },
  { id: "n2", code: "INF303", matiere: "Bases de donnees", noteDevoir: 12, noteExamen: 13, coefficient: 3, enseignant: "Mme. RAKOTOMALALA Feno" },
];

const STUDENT_EDT_DEMO = [
  {
    jour: "Lundi",
    seances: [
      { id: "s1", matiere: "Algorithmes", enseignant: "M. ANDRIAMALALA", salle: "A1", heureDebut: "08:00", heureFin: "10:00", type: "Cours", color: "#22c55e" },
    ],
  },
  {
    jour: "Mardi",
    seances: [
      { id: "s2", matiere: "BDD", enseignant: "Mme. RAKOTOMALALA", salle: "B2", heureDebut: "10:00", heureFin: "12:00", type: "TP", color: "#3b82f6" },
    ],
  },
];

const STUDENT_DOCS_DEMO = [
  { id: "d1", titre: "Règlement intérieur", description: "Texte officiel de l'établissement", categorie: "Règlements", datePublication: "01/07/2026", taille: "1.2 MB", format: "pdf" },
  { id: "d2", titre: "Guide stages", description: "Procédure de stage", categorie: "Stages / Pro", datePublication: "02/07/2026", taille: "2.4 MB", format: "pdf" },
];

const STUDENT_NOTIFICATIONS_DEMO = [
  { id: "no1", titre: "Nouvelle note disponible", description: "Votre note de BDD est publiée.", type: "Notes", date: "09 juillet 2026", lu: false },
  { id: "no2", titre: "Cours déplacé", description: "Le TD de lundi est déplacé en salle A2.", type: "Cours", date: "08 juillet 2026", lu: true },
];

const STUDENT_RESULTATS_DEMO = {
  semestre: "Semestre 1",
  anneeUniversitaire: "2025-2026",
  moyenneGenerale: 13.42,
  totalCreditsAcquis: 30,
  totalCreditsSemestre: 30,
  statutFinal: "Admis",
  mention: "Assez Bien",
  decisionJury: "Jury favorable, passage au semestre suivant.",
  ues: [
    {
      id: "ue1",
      codeUE: "UE-INF-1",
      nomUE: "Fondamentaux Informatiques",
      creditsUE: 15,
      moyenneUE: 13.5,
      valide: true,
      matieres: [
        { code: "INF301", nom: "Algorithmique", credit: 4, note: 15, valide: true },
        { code: "INF303", nom: "BDD", credit: 3, note: 12, valide: true },
      ],
    },
  ],
};

const STUDENT_LEVELS_DEMO = [
  {
    id: "niv1",
    nom: "L3 Informatique",
    description: "Maquette pédagogique du niveau L3.",
    responsable: "Dr. Andria",
    matieres: [
      {
        id: "m1",
        code: "INF301",
        titre: "Algorithmique",
        enseignant: "M. ANDRIAMALALA",
        volumeHoraire: 60,
        progress: 75,
        ressources: [
          { id: "r1", titre: "Cours Algorithmique", type: "Cours", taille: "1.8 MB" },
          { id: "r2", titre: "TD Graphes", type: "TD/TP", taille: "850 KB" },
        ],
      },
    ],
  },
];

const TEACHER_COURSES_DEMO = [
  { id: "c1", titre: "Programmation web", code: "INF304", classe: "L3 Info", volumeHoraire: 45, description: "Frontend + API" },
  { id: "c2", titre: "Bases de données", code: "INF303", classe: "L3 Info", volumeHoraire: 60, description: "Modèle relationnel" },
];

const TEACHER_DASHBOARD_DEMO = {
  stats: {
    heuresEffectuees: "24h",
    heuresQuota: "40h",
    classesAssignees: "2 groupes",
    saisieNotesPourcentage: "80%",
    ressourcesPartagees: "12 fichiers",
  },
  coursParNiveauRadar: [
    { niveau: "L1", heures: 12 },
    { niveau: "L2", heures: 20 },
    { niveau: "L3", heures: 24 },
  ],
  evolutionReussiteEtudiants: [
    { sem: "S1", taux: 72 },
    { sem: "S2", taux: 78 },
    { sem: "S3", taux: 82 },
  ],
  quotaHeuresBarData: [
    { mois: "Mai", effectuees: 18, quota: 20 },
    { mois: "Juin", effectuees: 22, quota: 20 },
  ],
  coursDeLaSemaine: [
    { jour: "Lundi", heure: "08:00", classe: "L3 Info", matiere: "Algo", salle: "A1", type: "Cours" },
    { jour: "Mardi", heure: "10:00", classe: "L3 Info", matiere: "BDD", salle: "B2", type: "TP" },
  ],
  notesRestantes: [
    { classe: "L3 Info - BDD", statut: "2 notes à saisir" },
  ],
  echeances: [
    { label: "Clôture notes", date: "12 juillet 2026", color: "#f59e0b" },
  ],
};

/**
 * Fabrique un ensemble d'opérations CRUD génériques pour une ressource donnée.
 * Exemple : createCrudService<Cours>("/cours")
 */
export function createCrudService<T, TCreate = Partial<T>, TUpdate = Partial<T>>(
  resourcePath: string
) {
  return {
    getAll: (params?: Record<string, unknown>) =>
      request<T[]>({ url: resourcePath, method: "GET", params }),

    getPage: (params?: Record<string, unknown>) =>
      request<Page<T>>({ url: `${resourcePath}/page`, method: "GET", params }),

    getById: (id: string | number) =>
      request<T>({ url: `${resourcePath}/${id}`, method: "GET" }),

    create: (payload: TCreate) =>
      request<T>({ url: resourcePath, method: "POST", data: payload }),

    update: (id: string | number, payload: TUpdate) =>
      request<T>({ url: `${resourcePath}/${id}`, method: "PUT", data: payload }),

    patch: (id: string | number, payload: Partial<TUpdate>) =>
      request<T>({ url: `${resourcePath}/${id}`, method: "PATCH", data: payload }),

    remove: (id: string | number) =>
      requestRaw<void>({ url: `${resourcePath}/${id}`, method: "DELETE" }),

    delete: (id: string | number) =>
      requestRaw<void>({ url: `${resourcePath}/${id}`, method: "DELETE" }),
  };
}

const TEACHER_MATIERES_BY_CLASSE: Record<string, string[]> = {
  "L1 Info A": ["Algorithmique", "Maths AppliquÃ©es", "Anglais"],
  "L1 Info B": ["Algorithmique", "Bureautique", "Maths AppliquÃ©es"],
  "L2 Info B": ["Bases de donnÃ©es", "RÃ©seaux", "Java"],
  "L3 Info": ["Architecture logicielle", "BDD avancÃ©e", "React"],
  "M1 GL": ["DevOps", "Architecture avancÃ©e", "Gestion de projet"],
};

type EvaluationStudent = {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  note: number | '';
  absent: boolean;
};

let TEACHER_EVALUATIONS_STATE: Record<string, EvaluationStudent[]> = {
  "L1 Info A|Algorithmique|Devoir 1": [
    { id: "e1", matricule: "ETU-001", nom: "Rakoto", prenom: "Andry", note: 14, absent: false },
    { id: "e2", matricule: "ETU-002", nom: "Rasoanaivo", prenom: "Mbola", note: 11, absent: false },
    { id: "e3", matricule: "ETU-003", nom: "Rajaona", prenom: "Tiana", note: '', absent: true },
  ],
};

let TEACHER_RESOURCES_STATE = [
  { id: "r1", nom: "Syllabus_Vite_TypeScript.pdf", classe: "L3 Info", matiere: "React", taille: "950 KB", dateDepot: "09/07/2026", downloads: 18, format: "document" as const },
  { id: "r2", nom: "Correction_fetch_hooks.pdf", classe: "L3 Info", matiere: "React", taille: "730 KB", dateDepot: "08/07/2026", downloads: 12, format: "document" as const },
  { id: "r3", nom: "Demo_Architecture.mp4", classe: "L2 Info B", matiere: "RÃ©seaux", taille: "45 MB", dateDepot: "07/07/2026", downloads: 7, format: "video" as const },
];

let TEACHER_STORAGE_QUOTA = {
  utilise: "24 GB",
  max: "50 GB",
  pourcentage: 48,
};

function makeEvaluationKey(classe: string, matiere: string, evaluation: string) {
  return `${classe}|${matiere}|${evaluation}`;
}

function guessResourceFormat(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".webm")) return "video" as const;
  if (lower.endsWith(".zip") || lower.endsWith(".rar")) return "archive" as const;
  return "document" as const;
}

// =====================================================================
// CSV EXPORT HELPER (Blob-based)
// =====================================================================

export function exportToCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// =====================================================================
// AUTH SERVICE (public + utilisateur)
// =====================================================================

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  role: string;
  userId: number;
}

export const AuthService = {
  login: (payload: LoginPayload) =>
    request<AuthResponse>({ url: "/auth/login", method: "POST", data: payload }),

  register: (payload: Record<string, unknown>) =>
    request<AuthResponse>({ url: "/auth/registration", method: "POST", data: payload }),

  logout: () => {
    TokenStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("etec_user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("etec_user_role");
  },

  me: () => request<Record<string, unknown>>({ url: "/users/me", method: "GET" }),
};

// =====================================================================
// UTILISATEUR SERVICE
// =====================================================================

export const UsersService = createCrudService("/users");

// =====================================================================
// ADMIN SERVICE
// =====================================================================

export const AdminService = createCrudService("/admin");
export const OrganigrammesService = createCrudService("/organigrammes");
export const NotificationsService = createCrudService("/notifications");
export const AnneesUnivService = createCrudService("/anneesUniv");
export const MotsService = createCrudService("/mots");
export const SlidesService = createCrudService("/slides");
export const EncadrementsService = createCrudService("/encadrements");
export const MemoiresService = createCrudService("/memoires");
export const EmailsService = createCrudService("/emails");

// =====================================================================
// ETUDIANT SERVICE
// =====================================================================

export const EtudiantService = {
  ...createCrudService("/etudiants"),
  create: (payload: Record<string, unknown> | FormData) =>
    request<Record<string, unknown>>({
      url: "/etudiants/registration",
      method: "POST",
      data: payload,
      headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    }),
  getProfile: () => attachDemo(STUDENT_PROFILE_DEMO),
  getHomeDashboard: () => attachDemo(STUDENT_HOME_DEMO),
  getCours: () => attachDemo(STUDENT_COURS_DEMO),
  getNotesDetail: () => attachDemo(STUDENT_NOTES_DEMO),
  getEmploiDuTemps: () => attachDemo(STUDENT_EDT_DEMO),
  getDocuments: () => attachDemo(STUDENT_DOCS_DEMO),
  getNotifications: () => attachDemo(STUDENT_NOTIFICATIONS_STATE),
  marquerNotificationLu: (id: string | number) => {
    updateNotification(id, (item) => ({ ...item, lu: true }));
    return attachDemo({ success: true });
  },
  toutMarquerNotificationsLu: () => {
    STUDENT_NOTIFICATIONS_STATE = STUDENT_NOTIFICATIONS_STATE.map((item) => ({
      ...item,
      lu: true,
    }));
    return attachDemo({ success: true });
  },
  supprimerNotification: (id: string | number) => {
    removeNotification(id);
    return attachDemo({ success: true });
  },
  getCourseDetails: (courseId: string | number) =>
    attachDemo(getStudentCourseDetails(courseId)),
  getResultats: () => attachDemo(STUDENT_RESULTATS_DEMO),
  getNiveaux: () => attachDemo(STUDENT_LEVELS_DEMO),
};
export const NotesService = createCrudService("/notes");
export const MoyennesService = createCrudService("/moyennes");
export const PresencesService = createCrudService("/presences");
export const HistoriquesService = createCrudService("/historiques");

// =====================================================================
// ENSEIGNANT SERVICE
// =====================================================================

export const EnseignantService = {
  ...createCrudService("/enseignants"),
  create: (payload: Record<string, unknown>) =>
    request<Record<string, unknown>>({ url: "/enseignants/save", method: "POST", data: payload }),
  getDashboardData: () => attachDemo(TEACHER_DASHBOARD_DEMO),
  getCours: () => attachDemo(TEACHER_COURSES_STATE),
  updateCours: (id: string | number, payload: Record<string, unknown>) => {
    const updated = updateTeacherCourse(id, payload);
    return attachDemo(updated ?? { id: String(id), ...payload });
  },
  createCours: (payload: Record<string, unknown>) => {
    const created = addTeacherCourse(payload);
    return attachDemo(created);
  },
  deleteCours: (id: string | number) => {
    removeTeacherCourse(id);
    return attachDemo({ success: true });
  },
};

// =====================================================================
// COURS SERVICE
// =====================================================================

export const CoursService = createCrudService("/cours");
export const MatieresService = createCrudService("/matieres");
export const ChapitresService = createCrudService("/chapitres");
export const DomainsService = createCrudService("/domains");
export const RessourcesService = createCrudService("/ressours"); // orthographe alignée sur la Gateway
export const SemestresService = createCrudService("/semestres");
export const NiveauService = createCrudService("/niveau");
export const FilieresService = createCrudService("/filieres");
export const EmploiDuTempsService = createCrudService("/emploiDuTemps");
export const FormationInitialeService = createCrudService("/formationInitiale");
export const FormationContinueService = createCrudService("/formationContinue");
export const FormationEnLigneService = createCrudService("/formationEnLigne");

// =====================================================================
// ACTUALITE SERVICE (public)
// =====================================================================

export const ActualitesService = {
  getAll: async (params?: Record<string, unknown>) => {
    const page = await requestRaw<Page<Record<string, unknown>>>({
      url: "/actualites",
      method: "GET",
      params,
    });

    const items = Array.isArray(page?.content) ? page.content : [];
    return attachData(items as Record<string, unknown>[]);
  },

  getPage: (params?: Record<string, unknown>) =>
    request<Page<Record<string, unknown>>>({ url: "/actualites", method: "GET", params }),

  getById: (id: string | number) =>
    request<Record<string, unknown>>({ url: `/actualites/${id}`, method: "GET" }),

  create: (payload: Record<string, unknown>) => {
    const formData = new FormData();
    formData.append("titre", String(payload.titre ?? ""));
    formData.append("description", String(payload.description ?? ""));
    formData.append("status", String(payload.status ?? "BROUILLON"));
    formData.append("categorie", String(payload.categorie ?? "EVENEMENT"));
    formData.append("important", String(Boolean(payload.important)));

    const file = payload.file;
    if (file instanceof File) {
      formData.append("file", file);
    }

    return request<Record<string, unknown>>({
      url: "/actualites/save",
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: (id: string | number, payload: Record<string, unknown>) => {
    const formData = new FormData();
    formData.append("titre", String(payload.titre ?? ""));
    formData.append("description", String(payload.description ?? ""));
    formData.append("status", String(payload.status ?? "BROUILLON"));
    formData.append("categorie", String(payload.categorie ?? "EVENEMENT"));
    formData.append("important", String(Boolean(payload.important)));

    const file = payload.file;
    if (file instanceof File) {
      formData.append("file", file);
    }

    return request<Record<string, unknown>>({
      url: `/actualites/${id}`,
      method: "PUT",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  remove: (id: string | number) =>
    requestRaw<void>({ url: `/actualites/${id}`, method: "DELETE" }),

  delete: (id: string | number) =>
    requestRaw<void>({ url: `/actualites/${id}`, method: "DELETE" }),
};
export const EncadreursService = createCrudService("/encadreurs");
export const ContactsService = createCrudService("/contacts");

// =====================================================================
// AGGREGATED EXPORT (usage optionnel : import { Api } from "./ApiService")
// =====================================================================

export const Api = {
  auth: AuthService,
  users: UsersService,
  admin: AdminService,
  organigrammes: OrganigrammesService,
  notifications: NotificationsService,
  anneesUniv: AnneesUnivService,
  mots: MotsService,
  slides: SlidesService,
  encadrements: EncadrementsService,
  memoires: MemoiresService,
  emails: EmailsService,
  etudiant: EtudiantService,
  notes: NotesService,
  moyennes: MoyennesService,
  presences: PresencesService,
  historiques: HistoriquesService,
  enseignant: EnseignantService,
  cours: CoursService,
  matieres: MatieresService,
  chapitres: ChapitresService,
  domains: DomainsService,
  ressources: RessourcesService,
  semestres: SemestresService,
  niveau: NiveauService,
  filieres: FilieresService,
  emploiDuTemps: EmploiDuTempsService,
  formationInitiale: FormationInitialeService,
  formationContinue: FormationContinueService,
  formationEnLigne: FormationEnLigneService,
  actualites: ActualitesService,
  encadreurs: EncadreursService,
  contacts: ContactsService,
  getMatieresParClasse: (classe: string) => attachDemo(TEACHER_MATIERES_BY_CLASSE[classe] ?? []),
  getEtudiantsNotes: (classe: string, matiere: string, evaluation: string) => {
    const key = makeEvaluationKey(classe, matiere, evaluation);
    if (!TEACHER_EVALUATIONS_STATE[key]) {
      TEACHER_EVALUATIONS_STATE[key] = clone([
        { id: "e1", matricule: "ETU-001", nom: "Rakoto", prenom: "Andry", note: 0, absent: false },
        { id: "e2", matricule: "ETU-002", nom: "Rasoanaivo", prenom: "Mbola", note: 0, absent: false },
      ]);
    }
    return attachDemo(TEACHER_EVALUATIONS_STATE[key]);
  },
  saveEtudiantsNotes: (classe: string, matiere: string, evaluation: string, etudiants: EvaluationStudent[]) => {
    TEACHER_EVALUATIONS_STATE[makeEvaluationKey(classe, matiere, evaluation)] = clone(etudiants);
    return attachDemo({ success: true });
  },
  getRessources: () => attachDemo(TEACHER_RESOURCES_STATE),
  getQuotaStockage: () => attachDemo(TEACHER_STORAGE_QUOTA),
  deleteRessource: (id: string | number) => {
    TEACHER_RESOURCES_STATE = TEACHER_RESOURCES_STATE.filter((item) => item.id !== String(id));
    return attachDemo({ success: true });
  },
  uploadRessource: (formData: FormData) => {
    const file = formData.get("file");
    const nom = file instanceof File ? file.name : "nouveau-fichier";
    const created = {
      id: `r-${Date.now()}`,
      nom,
      classe: String(formData.get("classe") ?? "L1 Info A"),
      matiere: String(formData.get("matiere") ?? "General"),
      taille: file instanceof File ? `${Math.max(1, Math.round(file.size / 1024))} KB` : "0 KB",
      dateDepot: new Date().toLocaleDateString('fr-FR'),
      downloads: 0,
      format: guessResourceFormat(nom),
    };
    TEACHER_RESOURCES_STATE = [created, ...TEACHER_RESOURCES_STATE];
    TEACHER_STORAGE_QUOTA = {
      ...TEACHER_STORAGE_QUOTA,
      pourcentage: Math.min(100, TEACHER_STORAGE_QUOTA.pourcentage + 1),
    };
    return attachDemo(created);
  },
};

// Alias pour compatibilité avec du code existant qui fait `import { ApiService } from ...`
export const ApiService = Api;
Object.assign(apiClient, Api);
