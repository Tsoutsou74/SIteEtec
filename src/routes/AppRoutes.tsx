import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardEnseignants from '../layouts/DashboardEnseignants';
import HomPages from "../pages/HomPages";
import AboutPage from "../pages/AboutPage";
import AdmissionPage from "../pages/AdmissionPage";
import ContactPage from "../pages/ContactPage";
import Auth from "../pages/Auth";
import EtudiantsInscription from "../feature/auth/pages/EtudiantsInscription";
import FiliersPage from "../pages/FiliersPage";

// ── Espace Administration ────────────────────────────────────

import AdminHome from "../layouts/DashbordAdmin/AdminHome";
import AdminEtudiants from "../layouts/DashbordAdmin/Etudiants/AdmineEtudiants";
import Inscriptions from "../layouts/DashbordAdmin/Etudiants/Inscriptions";
import AResultats from "../layouts/DashbordAdmin/Etudiants/Resultats";
import LDT from "../layouts/DashbordAdmin/Etudiants/ListeDEtudiants";
import EDT from "../layouts/DashbordAdmin/Etudiants/EmploisDuTemps";
import Enseignants from "../layouts/DashbordAdmin/Enseignant/AdminEnseignants";
import EMDTE from "../layouts/DashbordAdmin/Enseignant/EmploisDTemps";

import Programmes from "../layouts/DashbordAdmin/Formations/Programmes";
import Modules from "../layouts/DashbordAdmin/Formations/Modules";
import Filiers from "../layouts/DashbordAdmin/Formations/Filiers";
import FormationsContinue from "../layouts/DashbordAdmin/Formations/Continue";
import FormationsEnLigne from "../layouts/DashbordAdmin/Formations/Enligne";
import FormationsInitiale from "../layouts/DashbordAdmin/Formations/Initiale";
import Coures from "../layouts/DashbordAdmin/Formations/Cours";

import EmploisDTemps from "../layouts/DashbordAdmin/EmploisDTemps";
import NotesResultats from "../layouts/DashbordAdmin/Notes&Resultats";
import Actualites from "../layouts/DashbordAdmin/Actualites";
import MotPresidents from "../layouts/DashbordAdmin/MPresidents";
import Statistiques from "../layouts/DashbordAdmin/Statistiques";
import Notifications from "../layouts/DashbordAdmin/Notifications";
import Parametres from "../layouts/DashbordAdmin/Parametres";
import Slide from "../layouts/DashbordAdmin/Slide";
import Organigrammes from "../layouts/DashbordAdmin/Organigram";
import Historiques from "../layouts/DashbordAdmin/Historique";
import InscriptionsOuverts from "../layouts/DashbordAdmin/InscriptionOuvert";


{/*── Espace enseignant ────────────────────────────────────*/}

import Enseignant from "../layouts/DashboardEnseignants/Enseignant";
import Cours from "../layouts/DashboardEnseignants/Cours";
import EDTE from "../layouts/DashboardEnseignants/EDT";
import Evaluations from "../layouts/DashboardEnseignants/Evaluations";
import Niveaux from "../layouts/DashboardEnseignants/Niveaux";
import Notification from "../layouts/DashboardEnseignants/Notifications";
import Parametre from "../layouts/DashboardEnseignants/Parametres";
import Ressource from "../layouts/DashboardEnseignants/Ressource";


{/*── Espace enseignant ────────────────────────────────────*/}


import DashboardEtudiant from "../layouts/DashboardEtudiants";
import EtudiantHome               from "../layouts/DashboardEtud/etudiant";
import MesNotes               from "../layouts/DashboardEtud/etudiantNotes";
import EmploiDuTemps          from "../layouts/DashboardEtud/employeDuTemps";
import MesCours                from "../layouts/DashboardEtud/cours";
import Documents               from "../layouts/DashboardEtud/documents";
import Resultats                from "../layouts/DashboardEtud/resultats";
import NotificationsEtudiant   from "../layouts/DashboardEtud/notifications";
import ParametresEtudiant       from "../layouts/DashboardEtud/parametres";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
          <Route element={<MainLayout />}>
          <Route path="/" element={<HomPages />} /> 
          <Route path="about" element={<AboutPage />} />
          <Route path="admission" element={<AdmissionPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="log_in" element={<Auth />} />
          <Route path="/Inscriptions" element={<EtudiantsInscription />} />
          <Route path="/formations" element={<FiliersPage />} />
        </Route>

        // ── Route admin ────────────────────────────────────
        
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index                             element={<AdminHome />} />
          <Route path="etudiants"                  element={<AdminEtudiants />} />
          <Route path="Etudiants/inscriptions"     element={<Inscriptions />} />
          <Route path="Etudiants/resultats"        element={<AResultats />} />
          <Route path="Enseignant/AdmineEnseignants"        element={<Enseignants />} />
          <Route path="Enseignant/EmploisDTemps"            element={<EMDTE />} />

          <Route path="Formations/Programmes"      element={<Programmes />} />
          <Route path="Formations/Modules"         element={<Modules />} />
          <Route path="Formations/Filiers"         element={<Filiers />} />
          <Route path="Formations/formationcontinu" element={<FormationsContinue />} />
          <Route path="Formations/formationenligne" element={<FormationsEnLigne />} />
          <Route path="Formations/formationinitiale" element={<FormationsInitiale />} />
          <Route path="Formations/coures" element={<Coures />} />

          <Route path="edt"                        element={<EDT />} />
          <Route path="Notes&Resultats"                     element={<NotesResultats />} />
          <Route path="actualites"                 element={<Actualites />} />
          <Route path="statistiques"               element={<Statistiques />} />
          <Route path="notifications"              element={<Notifications />} />
          <Route path="parametres"                 element={<Parametres />} />
          <Route path="slide"                 element={<Slide />} />
          <Route path="universite/organigramme"            element={<Organigrammes />} />
          <Route path="universite/historique"              element={<Historiques />} />
          <Route path="universite/mpresidents"              element={<MotPresidents />} />
          <Route path="iouverts"              element={<InscriptionsOuverts />} />

        </Route>
 

        // ── Route étudiant ────────────────────────────────────
         <Route path="/etudiants" element={<DashboardEtudiant />}>
          <Route index                  element={<EtudiantHome />} />
          <Route path="notes"           element={<MesNotes />} />
          <Route path="edt"             element={<EmploiDuTemps />} />
          <Route path="cours"           element={<MesCours />} />
          <Route path="documents"       element={<Documents />} />
          <Route path="resultats"       element={<Resultats />} />
          <Route path="notifications"   element={<NotificationsEtudiant />} />
          <Route path="parametres"      element={<ParametresEtudiant />} />
        </Route>

        {/* ===== ENSEIGNANT ===== */}
        <Route path="/enseignants" element={<DashboardEnseignants />}>
          <Route index element={<Enseignant />} />
          <Route path="Evaluations"   element={<Evaluations />} />
          <Route path="EDTE"           element={<EDTE />} />
          <Route path="Cours"         element={<Cours />} />
          <Route path="Niveaux"       element={<Niveaux />} />
          <Route path="Ressource"     element={<Ressource />} />
          <Route path="Notification" element={<Notifications />} />
          <Route path="Parametre"    element={<Parametres />} />
        </Route>

      </Routes>

    </BrowserRouter>
  );
}