import React from 'react';
import TopBar from '../components/layout/TopBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-400" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      
      <TopBar />

      <Navbar />

      <main className="flex-grow pt-0">
        {/*{children}*/}
        <Outlet />
      </main>

      <Footer />
      
    </div>
  );
}