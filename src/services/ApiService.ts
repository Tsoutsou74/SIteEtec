import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// =========================
// INTERCEPTOR - REQUEST
// =========================

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);

// =========================
// INTERCEPTOR - RESPONSE
// =========================

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            localStorage.removeItem('isConnected');
            window.location.href = '/auth';
        }

        if (error.response?.status === 403) {
            console.error('Accès refusé (403) :', error.config?.url);
        }

        return Promise.reject(error);
    }
);

// =========================
// API SERVICE
// =========================

const ApiService = {

    // =========================
    // AUTH (public : /auth/**)
    // =========================

    auth: {

        // LOGIN
        login: async (credentials) => {
            const response = await api.post('/auth/login', credentials);
            const user = response.data;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', user.role);
            localStorage.setItem('token', user.token);
            localStorage.setItem('isConnected', 'true');

            return user;
        },

        // REGISTER
        register: (userData) =>
            api.post('/auth/register', userData),

        // LOGOUT
        logout: () => {
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            localStorage.removeItem('isConnected');
        },

        // GET USER
        getCurrentUser: () => {
            return JSON.parse(localStorage.getItem('user'));
        },

        // GET ROLE
        getRole: () => {
            return localStorage.getItem('role');
        },

        // CHECK ADMIN
        isAdmin: () => {
            return localStorage.getItem('role') === 'ROLE_ADMIN';
        },

        // CHECK ETUDIANT
        isEtudiant: () => {
            return localStorage.getItem('role') === 'ROLE_ETUDIANT';
        },

        // CHECK ENSEIGNANT
        isEnseignant: () => {
            return localStorage.getItem('role') === 'ROLE_ENSEIGNANT';
        },

        // UPDATE PROFILE
        updateProfile: (id, data) =>
            api.put(`/auth/users/${id}`, data),

        // RESET PASSWORD
        updatePassword: (data) =>
            api.post('/auth/reset-password', data)
    },

    // =========================
    // ADMIN (hasRole ADMIN)
    // =========================

    admin: {

        getAll: () => api.get('/api/admin'),

        create: (data) => api.post('/api/admin', data),

        update: (id, data) => api.put(`/api/admin/${id}`, data),

        delete: (id) => api.delete(`/api/admin/${id}`),
    },

    // =========================
    // ETUDIANT (hasRole ETUDIANT)
    // =========================

    etudiant: {

        getAll: () => api.get('/api/etudiant'),

        getById: (id) => api.get(`/api/etudiant/${id}`),

        create: (data) => api.post('/api/etudiant', data),

        update: (id, data) => api.put(`/api/etudiant/${id}`, data),

        delete: (id) => api.delete(`/api/etudiant/${id}`),
    },

    // =========================
    // ENSEIGNANT (hasRole ENSEIGNANT)
    // =========================

    enseignant: {

        getAll: () => api.get('/api/enseignant'),

        getById: (id) => api.get(`/api/enseignant/${id}`),

        create: (data) => api.post('/api/enseignant', data),

        update: (id, data) => api.put(`/api/enseignant/${id}`, data),

        delete: (id) => api.delete(`/api/enseignant/${id}`),
    },

    // =========================
    // RESSOURCES / COURS / CHAPITRES / DOMAINS
    // (hasRole "Etudiant" côté gateway - vérifie la casse, voir note plus bas)
    // =========================

    ressources: {

        getAll: () => api.get('/api/ressours'),

        create: (data) => api.post('/api/ressours', data),

        update: (id, data) => api.put(`/api/ressours/${id}`, data),

        delete: (id) => api.delete(`/api/ressours/${id}`),
    },

    cours: {

        getAll: () => api.get('/api/cours'),

        create: (data) => api.post('/api/cours', data),

        update: (id, data) => api.put(`/api/cours/${id}`, data),

        delete: (id) => api.delete(`/api/cours/${id}`),
    },

    chapitres: {

        getAll: () => api.get('/api/chapitres'),

        create: (data) => api.post('/api/chapitres', data),

        update: (id, data) => api.put(`/api/chapitres/${id}`, data),

        delete: (id) => api.delete(`/api/chapitres/${id}`),
    },

    domains: {

        getAll: () => api.get('/api/domains'),

        create: (data) => api.post('/api/domains', data),

        update: (id, data) => api.put(`/api/domains/${id}`, data),

        delete: (id) => api.delete(`/api/domains/${id}`),
    },

    // =========================
    // ACTUALITES / ENCADREURS (public)
    // =========================

    actualites: {

        getAll: () => api.get('/api/actualites'),

        create: (data) => api.post('/api/actualites', data),

        update: (id, data) => api.put(`/api/actualites/${id}`, data),

        delete: (id) => api.delete(`/api/actualites/${id}`),
    },

    contacts: {

        create: (data) => api.post('/api/contacts', data),

        getAll: () => api.get('/api/contacts'),
    },

    encadreurs: {

        getAll: () => api.get('/api/encadreurs'),

        create: (data) => api.post('/api/encadreurs', data),

        update: (id, data) => api.put(`/api/encadreurs/${id}`, data),

        delete: (id) => api.delete(`/api/encadreurs/${id}`),
    },

    // =========================
    // EMAILS (public - corrige le "/" manquant côté gateway, voir note)
    // =========================

    emails: {

        getAll: () => api.get('/api/emails'),

        send: (data) => api.post('/api/emails', data),
    },

    // =========================
    // EMPLOI DU TEMPS
    // =========================

    emploiDuTemps: {

        getAll: () => api.get('/api/emploiDuTemps'),

        create: (data) => api.post('/api/emploiDuTemps', data),

        update: (id, data) => api.put(`/api/emploiDuTemps/${id}`, data),

        delete: (id) => api.delete(`/api/emploiDuTemps/${id}`),
    },

    // =========================
    // ENCADREMENTS
    // =========================

    encadrements: {

        getAll: () => api.get('/api/encadrements'),

        create: (data) => api.post('/api/encadrements', data),

        update: (id, data) => api.put(`/api/encadrements/${id}`, data),

        delete: (id) => api.delete(`/api/encadrements/${id}`),
    },

    // =========================
    // FILIERS
    // =========================

    filiers: {

        getAll: () => api.get('/api/filiers'),

        create: (data) => api.post('/api/filiers', data),

        update: (id, data) => api.put(`/api/filiers/${id}`, data),

        delete: (id) => api.delete(`/api/filiers/${id}`),
    },

    // =========================
    // FORMATIONS PUBLIQUES
    // =========================

    formationInitiale: {

        getAll: () => api.get('/api/formationInitiale'),

        create: (data) => api.post('/api/formationInitiale', data),

        update: (id, data) => api.put(`/api/formationInitiale/${id}`, data),

        delete: (id) => api.delete(`/api/formationInitiale/${id}`),
    },

    formationContinue: {

        getAll: () => api.get('/api/formationContinue'),

        create: (data) => api.post('/api/formationContinue', data),

        update: (id, data) => api.put(`/api/formationContinue/${id}`, data),

        delete: (id) => api.delete(`/api/formationContinue/${id}`),
    },

    formationEnLigne: {

        getAll: () => api.get('/api/formationEnLigne'),

        create: (data) => api.post('/api/formationEnLigne', data),

        update: (id, data) => api.put(`/api/formationEnLigne/${id}`, data),

        delete: (id) => api.delete(`/api/formationEnLigne/${id}`),
    },

    // =========================
    // HISTORIQUES
    // =========================

    historiques: {

        getAll: () => api.get('/api/historiques'),

        create: (data) => api.post('/api/historiques', data),

        update: (id, data) => api.put(`/api/historiques/${id}`, data),

        delete: (id) => api.delete(`/api/historiques/${id}`),
    },

    // =========================
    // MATIERES
    // =========================

    matieres: {

        getAll: () => api.get('/api/matieres'),

        create: (data) => api.post('/api/matieres', data),

        update: (id, data) => api.put(`/api/matieres/${id}`, data),

        delete: (id) => api.delete(`/api/matieres/${id}`),
    },

    // =========================
    // MEMOIRES
    // =========================

    memoires: {

        getAll: () => api.get('/api/memoires'),

        create: (data) => api.post('/api/memoires', data),

        update: (id, data) => api.put(`/api/memoires/${id}`, data),

        delete: (id) => api.delete(`/api/memoires/${id}`),
    },

    // =========================
    // MOYENNES
    // =========================

    moyennes: {

        getAll: () => api.get('/api/moyennes'),

        create: (data) => api.post('/api/moyennes', data),

        update: (id, data) => api.put(`/api/moyennes/${id}`, data),

        delete: (id) => api.delete(`/api/moyennes/${id}`),
    },

    // =========================
    // NIVEAU
    // =========================

    niveau: {

        getAll: () => api.get('/api/niveau'),

        create: (data) => api.post('/api/niveau', data),

        update: (id, data) => api.put(`/api/niveau/${id}`, data),

        delete: (id) => api.delete(`/api/niveau/${id}`),
    },

    // =========================
    // NOTES
    // =========================

    notes: {

        getAll: () => api.get('/api/notes'),

        create: (data) => api.post('/api/notes', data),

        update: (id, data) => api.put(`/api/notes/${id}`, data),

        delete: (id) => api.delete(`/api/notes/${id}`),
    },

    // =========================
    // NOTIFICATIONS
    // =========================

    notifications: {

        getAll: () => api.get('/api/notifications'),

        create: (data) => api.post('/api/notifications', data),

        update: (id, data) => api.put(`/api/notifications/${id}`, data),

        delete: (id) => api.delete(`/api/notifications/${id}`),
    },

    // =========================
    // ORGANIGRAMMES
    // =========================

    organigrammes: {

        getAll: () => api.get('/api/organigrammes'),

        create: (data) => api.post('/api/organigrammes', data),

        update: (id, data) => api.put(`/api/organigrammes/${id}`, data),

        delete: (id) => api.delete(`/api/organigrammes/${id}`),
    },

    // =========================
    // PRESENCES
    // =========================

    presences: {

        getAll: () => api.get('/api/presences'),

        create: (data) => api.post('/api/presences', data),

        update: (id, data) => api.put(`/api/presences/${id}`, data),

        delete: (id) => api.delete(`/api/presences/${id}`),
    },

    // =========================
    // MOTS
    // =========================

    mots: {

        getAll: () => api.get('/api/mots'),

        create: (data) => api.post('/api/mots', data),

        update: (id, data) => api.put(`/api/mots/${id}`, data),

        delete: (id) => api.delete(`/api/mots/${id}`),
    },

    // =========================
    // SEMESTRES
    // =========================

    semestres: {

        getAll: () => api.get('/api/semestres'),

        create: (data) => api.post('/api/semestres', data),

        update: (id, data) => api.put(`/api/semestres/${id}`, data),

        delete: (id) => api.delete(`/api/semestres/${id}`),
    },

    // =========================
    // SLIDES
    // =========================

    slides: {

        getAll: () => api.get('/api/slides'),

        create: (data) => api.post('/api/slides', data),

        update: (id, data) => api.put(`/api/slides/${id}`, data),

        delete: (id) => api.delete(`/api/slides/${id}`),
    },

    // =========================
    // ANNEES UNIVERSITAIRES
    // =========================

    anneesUniv: {

        getAll: () => api.get('/api/anneesUniv'),

        create: (data) => api.post('/api/anneesUniv', data),

        update: (id, data) => api.put(`/api/anneesUniv/${id}`, data),

        delete: (id) => api.delete(`/api/anneesUniv/${id}`),
    },
};

export default ApiService;

// Alias nommés, au cas où une page importe { ApiService } ou { apiService }
export { ApiService };
export const apiService = ApiService;
