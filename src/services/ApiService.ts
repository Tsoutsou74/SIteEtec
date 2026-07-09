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

        getAll: () => api.get('/api/admins'),

        create: (data) => api.post('/api/admins', data),

        update: (id, data) => api.put(`/api/admins/${id}`, data),

        delete: (id) => api.delete(`/api/admins/${id}`),
    },

    // =========================
    // ETUDIANT (hasRole ETUDIANT)
    // =========================

    etudiant: {

        getAll: () => api.get('/api/etudiants'),

        getById: (id) => api.get(`/api/etudiants/${id}`),

        create: (data) => api.post('/api/etudiants', data),

        update: (id, data) => api.put(`/api/etudiants/${id}`, data),

        delete: (id) => api.delete(`/api/etudiants/${id}`),
    },

    // =========================
    // ENSEIGNANT (hasRole ENSEIGNANT)
    // =========================

    enseignant: {

        getAll: () => api.get('/api/enseignants'),

        getById: (id) => api.get(`/api/enseignants/${id}`),

        create: (data) => api.post('/api/enseignants', data),

        update: (id, data) => api.put(`/api/enseignants/${id}`, data),

        delete: (id) => api.delete(`/api/enseignants/${id}`),
    },

    // =========================
    // RESSOURCES / COURS / CHAPITRES / DOMAINS
    // (hasRole "Etudiant" côté gateway - vérifie la casse, voir note plus bas)
    // =========================

    ressources: {

        getAll: () => api.get('/api/ressources'),

        create: (data) => api.post('/api/ressources', data),

        update: (id, data) => api.put(`/api/ressources/${id}`, data),

        delete: (id) => api.delete(`/api/ressources/${id}`),
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

    domaines: {

        getAll: () => api.get('/api/domaines'),

        create: (data) => api.post('/api/domaines', data),

        update: (id, data) => api.put(`/api/domaines/${id}`, data),

        delete: (id) => api.delete(`/api/domaines/${id}`),
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
    // FILIERES
    // =========================

    filieres: {

        getAll: () => api.get('/api/filieres'),

        create: (data) => api.post('/api/filieres', data),

        update: (id, data) => api.put(`/api/filieres/${id}`, data),

        delete: (id) => api.delete(`/api/filieres/${id}`),
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
