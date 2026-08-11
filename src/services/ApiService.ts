// import axios, {
//   AxiosError,
//   AxiosInstance,
//   AxiosRequestConfig,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios";

// /**
//  * Toutes les requêtes passent par l'API Gateway (Spring Cloud Gateway).
//  * La Gateway résout ensuite chaque microservice via Eureka (lb://NOM_SERVICE),
//  * donc le frontend n'a jamais besoin de connaître les ports individuels.
//  */
// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8090/api";

// const TOKEN_KEY = "etec_access_token";
// const REFRESH_TOKEN_KEY = "etec_refresh_token";

// function attachData<T>(data: T): T & { data: T } {
//   if (data !== null && typeof data === "object") {
//     return Object.assign(data as object, { data }) as T & { data: T };
//   }
//   return { data } as T & { data: T };
// }

// // =====================================================================
// // TOKEN HELPERS
// // =====================================================================

// export const TokenStorage = {
//   getAccessToken: (): string | null => localStorage.getItem(TOKEN_KEY),
//   getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
//   setTokens: (accessToken: string, refreshToken?: string) => {
//     localStorage.setItem(TOKEN_KEY, accessToken);
//     if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
//   },
//   clear: () => {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(REFRESH_TOKEN_KEY);
//   },
// };

// // =====================================================================
// // AXIOS INSTANCE
// // =====================================================================

// const apiClient: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // --- Request interceptor: attach JWT ---
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = TokenStorage.getAccessToken();
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // --- Response interceptor: handle 401 / uniform errors ---
// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       TokenStorage.clear();
//       window.location.href = "/log_in";
//       return Promise.reject(error);
//     }

//     return Promise.reject(error);
//   }
// );

// export default apiClient;

// /**
//  * Alias en minuscule de l'instance Axios, pour compatibilité avec le code
//  * existant qui fait `import { apiService } from ...`.
//  */
// export const apiService = apiClient;

// // =====================================================================
// // ERROR TYPE
// // =====================================================================

// export interface ApiError {
//   message: string;
//   status?: number;
//   errors?: Record<string, string[]>;
// }

// /**
//  * Normalise une erreur Axios en ApiError exploitable côté UI.
//  */
// export function toApiError(error: unknown): ApiError {
//   if (axios.isAxiosError(error)) {
//     const data = error.response?.data as
//       | { message?: string; errors?: Record<string, string[]> }
//       | undefined;
//     return {
//       message: data?.message ?? error.message ?? "Une erreur est survenue",
//       status: error.response?.status,
//       errors: data?.errors,
//     };
//   }
//   return { message: "Une erreur inattendue est survenue" };
// }

// // =====================================================================
// // GENERIC CRUD HELPERS
// // =====================================================================

// export interface Page<T> {
//   content: T[];
//   totalElements: number;
//   totalPages: number;
//   number: number;
//   size: number;
// }

// async function request<T>(config: AxiosRequestConfig): Promise<T> {
//   const response = await apiClient.request<T>(config);
//   return attachData(response.data);
// }

// async function requestRaw<T>(config: AxiosRequestConfig): Promise<T> {
//   const response = await apiClient.request<T>(config);
//   return response.data;
// }

// function getStoredUserId(): string {
//   return (
//     localStorage.getItem("etec_user_id") ||
//     localStorage.getItem("userId") ||
//     "1"
//   );
// }

// /**
//  * Fabrique un ensemble d'opérations CRUD génériques pour une ressource donnée.
//  * Exemple : createCrudService<Cours>("/cours")
//  */
// export function createCrudService<T, TCreate = Partial<T>, TUpdate = Partial<T>>(
//   resourcePath: string
// ) {
//   return {
//     getAll: (params?: Record<string, unknown>) =>
//       request<T[]>({ url: resourcePath, method: "GET", params }),

//     getPage: (params?: Record<string, unknown>) =>
//       request<Page<T>>({ url: `${resourcePath}/page`, method: "GET", params }),

//     getById: (id: string | number) =>
//       request<T>({ url: `${resourcePath}/${id}`, method: "GET" }),

//     create: (payload: TCreate) =>
//       request<T>({ url: resourcePath, method: "POST", data: payload }),

//     update: (id: string | number, payload: TUpdate) =>
//       request<T>({ url: `${resourcePath}/${id}`, method: "PUT", data: payload }),

//     patch: (id: string | number, payload: Partial<TUpdate>) =>
//       request<T>({ url: `${resourcePath}/${id}`, method: "PATCH", data: payload }),

//     remove: (id: string | number) =>
//       requestRaw<void>({ url: `${resourcePath}/${id}`, method: "DELETE" }),

//     delete: (id: string | number) =>
//       requestRaw<void>({ url: `${resourcePath}/${id}`, method: "DELETE" }),
//   };
// }

// // =====================================================================
// // CSV EXPORT HELPER (Blob-based)
// // =====================================================================

// export function exportToCsv(filename: string, rows: Record<string, unknown>[]) {
//   if (!rows.length) return;

//   const headers = Object.keys(rows[0]);
//   const escape = (value: unknown) => {
//     const str = value === null || value === undefined ? "" : String(value);
//     return `"${str.replace(/"/g, '""')}"`;
//   };

//   const csvContent = [
//     headers.join(","),
//     ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
//   ].join("\n");

//   const blob = new Blob(["\uFEFF" + csvContent], {
//     type: "text/csv;charset=utf-8;",
//   });

//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// }

// // =====================================================================
// // AUTH SERVICE (public + utilisateur)
// // =====================================================================

// export interface LoginPayload {
//   email: string;
//   password: string;
// }

// export interface AuthResponse {
//   token: string;
//   type: string;
//   email: string;
//   role: string;
//   userId: number;
// }

// export const AuthService = {
//   login: (payload: LoginPayload) =>
//     request<AuthResponse>({ url: "/auth/login", method: "POST", data: payload }),

//   register: (payload: Record<string, unknown>) =>
//     request<AuthResponse>({ url: "/auth/registration", method: "POST", data: payload }),

//   logout: () => {
//     TokenStorage.clear();
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("etec_user_id");
//     localStorage.removeItem("role");
//     localStorage.removeItem("etec_user_role");
//   },

//   me: () => request<Record<string, unknown>>({ url: "/users/me", method: "GET" }),
// };

// // =====================================================================
// // UTILISATEUR SERVICE
// // =====================================================================

// export const UsersService = createCrudService("/users");

// // =====================================================================
// // ADMIN SERVICE
// // =====================================================================

// export const AdminService = createCrudService("/admin");
// export const OrganigrammesService = createCrudService("/organigrammes");
// export const NotificationsService = createCrudService("/notifications");
// export const AnneesUnivService = createCrudService("/anneesUniv");
// export const MotsService = createCrudService("/mots");
// export const SlidesService = createCrudService("/slides");
// export const EncadrementsService = createCrudService("/encadrements");
// export const MemoiresService = createCrudService("/memoires");
// export const EmailsService = createCrudService("/emails");

// // =====================================================================
// // ETUDIANT SERVICE
// // =====================================================================

// export const EtudiantService = {
//   ...createCrudService("/etudiants"),

//   create: (payload: Record<string, unknown> | FormData) =>
//     request<Record<string, unknown>>({
//       url: "/etudiants/registration",
//       method: "POST",
//       data: payload,
//       headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
//     }),

//   // TODO: vérifier le endpoint exact côté ETUDIANT-SERVICE
//   getProfile: () =>
//     request<Record<string, unknown>>({ url: `/etudiants/${getStoredUserId()}`, method: "GET" }),

//   // TODO: endpoint agrégé dashboard étudiant
//   getHomeDashboard: () =>
//     request<Record<string, unknown>>({ url: `/etudiants/${getStoredUserId()}/dashboard`, method: "GET" }),

//   getCours: () =>
//     request<Record<string, unknown>[]>({ url: `/etudiants/${getStoredUserId()}/cours`, method: "GET" }),

//   getCourseDetails: (courseId: string | number) =>
//     request<Record<string, unknown>>({ url: `/cours/${courseId}`, method: "GET" }),

//   getNotesDetail: () =>
//     request<Record<string, unknown>[]>({ url: `/notes/etudiant/${getStoredUserId()}`, method: "GET" }),

//   getEmploiDuTemps: () =>
//     request<Record<string, unknown>[]>({ url: `/emploiDuTemps/etudiant/${getStoredUserId()}`, method: "GET" }),

//   getDocuments: () =>
//     request<Record<string, unknown>[]>({ url: `/documents`, method: "GET" }),

//   getNotifications: () =>
//     request<Record<string, unknown>[]>({ url: `/notifications/etudiant/${getStoredUserId()}`, method: "GET" }),

//   marquerNotificationLu: (id: string | number) =>
//     requestRaw<void>({ url: `/notifications/${id}/lu`, method: "PATCH" }),

//   toutMarquerNotificationsLu: () =>
//     requestRaw<void>({ url: `/notifications/etudiant/${getStoredUserId()}/tout-lu`, method: "PATCH" }),

//   supprimerNotification: (id: string | number) =>
//     requestRaw<void>({ url: `/notifications/${id}`, method: "DELETE" }),

//   getResultats: () =>
//     request<Record<string, unknown>>({ url: `/moyennes/etudiant/${getStoredUserId()}/resultats`, method: "GET" }),

//   getNiveaux: () =>
//     request<Record<string, unknown>[]>({ url: `/niveau`, method: "GET" }),
// };

// export const NotesService = createCrudService("/notes");
// export const MoyennesService = createCrudService("/moyennes");
// export const PresencesService = createCrudService("/presences");
// export const HistoriquesService = createCrudService("/historiques");

// // =====================================================================
// // ENSEIGNANT SERVICE
// // =====================================================================

// export const EnseignantService = {
//   ...createCrudService("/enseignants"),

//   create: (payload: Record<string, unknown>) =>
//     request<Record<string, unknown>>({ url: "/enseignants/save", method: "POST", data: payload }),

//   // TODO: endpoint agrégé dashboard enseignant
//   getDashboardData: () =>
//     request<Record<string, unknown>>({ url: `/enseignants/${getStoredUserId()}/dashboard`, method: "GET" }),

//   getCours: () =>
//     request<Record<string, unknown>[]>({ url: `/enseignants/${getStoredUserId()}/cours`, method: "GET" }),

//   updateCours: (id: string | number, payload: Record<string, unknown>) =>
//     request<Record<string, unknown>>({ url: `/cours/${id}`, method: "PUT", data: payload }),

//   createCours: (payload: Record<string, unknown>) =>
//     request<Record<string, unknown>>({ url: `/cours`, method: "POST", data: payload }),

//   deleteCours: (id: string | number) =>
//     requestRaw<void>({ url: `/cours/${id}`, method: "DELETE" }),

//   // TODO: endpoints matières / évaluations / ressources / quota — à brancher sur les vrais controllers
//   getMatieresParClasse: (classe: string) =>
//     request<string[]>({ url: `/matieres/classe/${encodeURIComponent(classe)}`, method: "GET" }),

//   getEtudiantsNotes: (classe: string, matiere: string, evaluation: string) =>
//     request<Record<string, unknown>[]>({
//       url: `/notes/evaluation`,
//       method: "GET",
//       params: { classe, matiere, evaluation },
//     }),

//   saveEtudiantsNotes: (
//     classe: string,
//     matiere: string,
//     evaluation: string,
//     etudiants: Record<string, unknown>[]
//   ) =>
//     requestRaw<void>({
//       url: `/notes/evaluation`,
//       method: "POST",
//       data: { classe, matiere, evaluation, etudiants },
//     }),

//   getRessources: () =>
//     request<Record<string, unknown>[]>({ url: `/ressours/enseignant/${getStoredUserId()}`, method: "GET" }),

//   getQuotaStockage: () =>
//     request<Record<string, unknown>>({ url: `/enseignants/${getStoredUserId()}/quota`, method: "GET" }),

//   deleteRessource: (id: string | number) =>
//     requestRaw<void>({ url: `/ressours/${id}`, method: "DELETE" }),

//   uploadRessource: (formData: FormData) =>
//     request<Record<string, unknown>>({
//       url: `/ressours/upload`,
//       method: "POST",
//       data: formData,
//       headers: { "Content-Type": "multipart/form-data" },
//     }),
// };

// // =====================================================================
// // COURS SERVICE
// // =====================================================================

// export const CoursService = createCrudService("/cours");
// export const MatieresService = createCrudService("/matieres");
// export const ChapitresService = createCrudService("/chapitres");
// export const DomainsService = createCrudService("/domains");
// export const RessourcesService = createCrudService("/ressours"); // orthographe alignée sur la Gateway
// export const SemestresService = createCrudService("/semestres");
// export const NiveauService = createCrudService("/niveau");
// export const FilieresService = createCrudService("/filieres");
// export const EmploiDuTempsService = createCrudService("/emploiDuTemps");
// export const FormationInitialeService = createCrudService("/formationInitiale");
// export const FormationContinueService = createCrudService("/formationContinue");
// export const FormationEnLigneService = createCrudService("/formationEnLigne");

// // =====================================================================
// // ACTUALITE SERVICE (public)
// // =====================================================================

// export const ActualitesService = {
//   getAll: async (params?: Record<string, unknown>) => {
//     const page = await requestRaw<Page<Record<string, unknown>>>({
//       url: "/actualites",
//       method: "GET",
//       params,
//     });

//     const items = Array.isArray(page?.content) ? page.content : [];
//     return attachData(items as Record<string, unknown>[]);
//   },

//   getPage: (params?: Record<string, unknown>) =>
//     request<Page<Record<string, unknown>>>({ url: "/actualites", method: "GET", params }),

//   getById: (id: string | number) =>
//     request<Record<string, unknown>>({ url: `/actualites/${id}`, method: "GET" }),

//   create: (payload: Record<string, unknown>) => {
//     const formData = new FormData();
//     formData.append("titre", String(payload.titre ?? ""));
//     formData.append("description", String(payload.description ?? ""));
//     formData.append("status", String(payload.status ?? "BROUILLON"));
//     formData.append("categorie", String(payload.categorie ?? "EVENEMENT"));
//     formData.append("important", String(Boolean(payload.important)));

//     const file = payload.file;
//     if (file instanceof File) {
//       formData.append("file", file);
//     }

//     return request<Record<string, unknown>>({
//       url: "/actualites/save",
//       method: "POST",
//       data: formData,
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   },

//   update: (id: string | number, payload: Record<string, unknown>) => {
//     const formData = new FormData();
//     formData.append("titre", String(payload.titre ?? ""));
//     formData.append("description", String(payload.description ?? ""));
//     formData.append("status", String(payload.status ?? "BROUILLON"));
//     formData.append("categorie", String(payload.categorie ?? "EVENEMENT"));
//     formData.append("important", String(Boolean(payload.important)));

//     const file = payload.file;
//     if (file instanceof File) {
//       formData.append("file", file);
//     }

//     return request<Record<string, unknown>>({
//       url: `/actualites/${id}`,
//       method: "PUT",
//       data: formData,
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   },

//   remove: (id: string | number) =>
//     requestRaw<void>({ url: `/actualites/${id}`, method: "DELETE" }),

//   delete: (id: string | number) =>
//     requestRaw<void>({ url: `/actualites/${id}`, method: "DELETE" }),
// };

// export const EncadreursService = createCrudService("/encadreurs");
// export const ContactsService = createCrudService("/contacts");

// // =====================================================================
// // AGGREGATED EXPORT (usage optionnel : import { Api } from "./ApiService")
// // =====================================================================

// export const Api = {
//   auth: AuthService,
//   users: UsersService,
//   admin: AdminService,
//   organigrammes: OrganigrammesService,
//   notifications: NotificationsService,
//   anneesUniv: AnneesUnivService,
//   mots: MotsService,
//   slides: SlidesService,
//   encadrements: EncadrementsService,
//   memoires: MemoiresService,
//   emails: EmailsService,
//   etudiant: EtudiantService,
//   notes: NotesService,
//   moyennes: MoyennesService,
//   presences: PresencesService,
//   historiques: HistoriquesService,
//   enseignant: EnseignantService,
//   cours: CoursService,
//   matieres: MatieresService,
//   chapitres: ChapitresService,
//   domains: DomainsService,
//   ressources: RessourcesService,
//   semestres: SemestresService,
//   niveau: NiveauService,
//   filieres: FilieresService,
//   emploiDuTemps: EmploiDuTempsService,
//   formationInitiale: FormationInitialeService,
//   formationContinue: FormationContinueService,
//   formationEnLigne: FormationEnLigneService,
//   actualites: ActualitesService,
//   encadreurs: EncadreursService,
//   contacts: ContactsService,
// };

// Object.assign(apiClient, Api);


import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * Toutes les requêtes passent par l'API Gateway (Spring Cloud Gateway).
 * La Gateway résout ensuite chaque microservice via Eureka (lb://NOM_SERVICE),
 * donc le frontend n'a jamais besoin de connaître les ports individuels.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8002/api";

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

    const requestUrl = originalRequest?.url ?? "";
    const isPublicAuthRequest = requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/registration");

    if (error.response?.status === 401 && !originalRequest?._retry && !isPublicAuthRequest) {
      TokenStorage.clear();
      if (window.location.pathname !== "/log_in") {
        window.location.href = "/log_in";
      }
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

/**
 * Détermine la route de destination selon le rôle renvoyé par le backend.
 * Gère les variantes de format ("ADMIN", "ROLE_ADMIN", "Admin", ...).
 */
function getDashboardPathForRole(rawRole: string | undefined | null): string {
  const role = (rawRole ?? "").toUpperCase().replace("ROLE_", "");

  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin";
    case "ETUDIANT":
      return "/dashboard-etudiant";
    case "ENSEIGNANT":
      return "/dashboard-enseignant";
    default:
      return "/";
  }
}

export const AuthService = {
  login: async (payload: LoginPayload) => {
    const response = await request<AuthResponse>({
      url: "/auth/login",
      method: "POST",
      data: payload,
    });

    // Stocker le token et les infos utilisateur
    TokenStorage.setTokens(response.token);
    localStorage.setItem("userId", String(response.userId));
    localStorage.setItem("etec_user_id", String(response.userId));
    localStorage.setItem("role", response.role);
    localStorage.setItem("etec_user_role", response.role);

    // Redirection automatique selon le rôle
    window.location.href = getDashboardPathForRole(response.role);

    return response;
  },

  register: (payload: Record<string, unknown>) =>
    request<AuthResponse>({ url: "/auth/registration", method: "POST", data: payload }),

  logout: () => {
    TokenStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("etec_user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("etec_user_role");
    window.location.href = "/log_in";
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

  // TODO: vérifier le endpoint exact côté ETUDIANT-SERVICE
  getProfile: () =>
    request<Record<string, unknown>>({ url: `/etudiants/${getStoredUserId()}`, method: "GET" }),

  // TODO: endpoint agrégé dashboard étudiant
  getHomeDashboard: () =>
    request<Record<string, unknown>>({ url: `/etudiants/${getStoredUserId()}/dashboard`, method: "GET" }),

  getCours: () =>
    request<Record<string, unknown>[]>({ url: `/etudiants/${getStoredUserId()}/cours`, method: "GET" }),

  getCourseDetails: (courseId: string | number) =>
    request<Record<string, unknown>>({ url: `/cours/${courseId}`, method: "GET" }),

  getNotesDetail: () =>
    request<Record<string, unknown>[]>({ url: `/notes/etudiant/${getStoredUserId()}`, method: "GET" }),

  getEmploiDuTemps: () =>
    request<Record<string, unknown>[]>({ url: `/emploiDuTemps/etudiant/${getStoredUserId()}`, method: "GET" }),

  getDocuments: () =>
    request<Record<string, unknown>[]>({ url: `/documents`, method: "GET" }),

  getNotifications: () =>
    request<Record<string, unknown>[]>({ url: `/notifications/etudiant/${getStoredUserId()}`, method: "GET" }),

  marquerNotificationLu: (id: string | number) =>
    requestRaw<void>({ url: `/notifications/${id}/lu`, method: "PATCH" }),

  toutMarquerNotificationsLu: () =>
    requestRaw<void>({ url: `/notifications/etudiant/${getStoredUserId()}/tout-lu`, method: "PATCH" }),

  supprimerNotification: (id: string | number) =>
    requestRaw<void>({ url: `/notifications/${id}`, method: "DELETE" }),

  getResultats: () =>
    request<Record<string, unknown>>({ url: `/moyennes/etudiant/${getStoredUserId()}/resultats`, method: "GET" }),

  getNiveaux: () =>
    request<Record<string, unknown>[]>({ url: `/niveau`, method: "GET" }),
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

  // TODO: endpoint agrégé dashboard enseignant
  getDashboardData: () =>
    request<Record<string, unknown>>({ url: `/enseignants/${getStoredUserId()}/dashboard`, method: "GET" }),

  getCours: () =>
    request<Record<string, unknown>[]>({ url: `/enseignants/${getStoredUserId()}/cours`, method: "GET" }),

  updateCours: (id: string | number, payload: Record<string, unknown>) =>
    request<Record<string, unknown>>({ url: `/cours/${id}`, method: "PUT", data: payload }),

  createCours: (payload: Record<string, unknown>) =>
    request<Record<string, unknown>>({ url: `/cours`, method: "POST", data: payload }),

  deleteCours: (id: string | number) =>
    requestRaw<void>({ url: `/cours/${id}`, method: "DELETE" }),

  // TODO: endpoints matières / évaluations / ressources / quota — à brancher sur les vrais controllers
  getMatieresParClasse: (classe: string) =>
    request<string[]>({ url: `/matieres/classe/${encodeURIComponent(classe)}`, method: "GET" }),

  getEtudiantsNotes: (classe: string, matiere: string, evaluation: string) =>
    request<Record<string, unknown>[]>({
      url: `/notes/evaluation`,
      method: "GET",
      params: { classe, matiere, evaluation },
    }),

  saveEtudiantsNotes: (
    classe: string,
    matiere: string,
    evaluation: string,
    etudiants: Record<string, unknown>[]
  ) =>
    requestRaw<void>({
      url: `/notes/evaluation`,
      method: "POST",
      data: { classe, matiere, evaluation, etudiants },
    }),

  getRessources: () =>
    request<Record<string, unknown>[]>({ url: `/ressours/enseignant/${getStoredUserId()}`, method: "GET" }),

  getQuotaStockage: () =>
    request<Record<string, unknown>>({ url: `/enseignants/${getStoredUserId()}/quota`, method: "GET" }),

  deleteRessource: (id: string | number) =>
    requestRaw<void>({ url: `/ressours/${id}`, method: "DELETE" }),

  uploadRessource: (formData: FormData) =>
    request<Record<string, unknown>>({
      url: `/ressours/upload`,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }),
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
};

Object.assign(apiClient, Api);
