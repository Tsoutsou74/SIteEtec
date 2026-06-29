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
        </Route>
        <Route path="/admin" element={<DashboardLayout />} />
        <Route path="/etudiants" element={<DashboardEtudiants />} />
        <Route path="/enseignants" element={<DashboardEnseignants />} />
        <Route path="/Inscriptions" element={<EtudiantsInscription />} />
      </Routes>
    </BrowserRouter>
  );
}