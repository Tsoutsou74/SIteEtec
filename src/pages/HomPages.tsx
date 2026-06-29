import React from "react";
// import MainLayout from "../layouts/MainLayout";
import StatsSection from "../components/layout/StatsSection";
import AboutPage from "./AboutPage";
import NewsPage from "./NewsPage";
import AdmissionPage from "./AdmissionPage";
import FiliersPage from "./FiliersPage";
import ContactPage from "./ContactPage";
import HeroBanner from "../components/layout/HeroBanner";
import { ArrowRight, ChevronRight, Radio, Image as ImageIcon, Play } from "lucide-react";

export default function HomPages() {
  return (
    <>
      
      <HeroBanner />

      {/* BLOC DES STATS */}
      <StatsSection />

      {/* SECTION BENTO & PRÉSENTATION */}
      <div className="w-full px-12 py-5">
        
        <AboutPage />

        <NewsPage />

        <FiliersPage />

      </div>
    </>
  );
}