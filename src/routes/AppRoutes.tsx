import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomPages from "../pages/HomPages";
import AboutPage from "../pages/AboutPage";
import AdmissionPage from "../pages/AdmissionPage";
import ContactPage from "../pages/ContactPage";
import Auth from "../pages/Auth";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<MainLayout />}>
          <Route index element={<HomPages />} /> 
          
          <Route path="about" element={<AboutPage />} />
          <Route path="admission" element={<AdmissionPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="log_in" element={<Auth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}