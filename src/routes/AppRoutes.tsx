import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardEtudiants from '../layouts/DashboardEtudiants';
import DashboardEnseignants from '../layouts/DashboardEnseignants';
import HomPages from "../pages/HomPages";
import AboutPage from "../pages/AboutPage";
import AdmissionPage from "../pages/AdmissionPage";
import ContactPage from "../pages/ContactPage";
import Auth from "../pages/Auth";
import EtudiantsInscription from "../feature/auth/pages/EtudiantsInscription";
import FiliersPage from "../pages/FiliersPage";

// ── Espace étudiant ────────────────────────────────────
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
        <Route path="/admin" element={<DashboardLayout />} />


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


      // ── Route enseignant ────────────────────────────────────
        <Route path="/enseignants" element={<DashboardEnseignants />} />
      </Routes>
    </BrowserRouter>
  );
}