import React from "react";
import { Users, GraduationCap, BookOpen, UserCheck } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  count: string;
  label: string;
}

export function StatCard({ icon, count, label }: StatCardProps) {
  return (
    <div
      className="p-4 md:p-6 rounded-2xl flex items-center gap-4 md:gap-5 border card-hover shadow-md backdrop-blur-md transition-all duration-300"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        color: 'var(--text)',
      }}
    >
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-gray-500/5 shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xl md:text-2xl font-black tracking-tight leading-none mb-1">{count}</div>
        <div className="text-xs font-medium opacity-60">{label}</div>
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 -mt-8 sm:-mt-10 md:-mt-14 relative z-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 animate-fade-up">
      <StatCard icon={<Users size={20} className="text-blue-500" />}       count="12,000+" label="Étudiants"   />
      <StatCard icon={<GraduationCap size={20} style={{ color: 'var(--primary)' }} />} count="8"       label="Facultés"   />
      <StatCard icon={<BookOpen size={20} className="text-amber-500" />}   count="150+"   label="Formations" />
      <StatCard icon={<UserCheck size={20} className="text-teal-500" />}   count="500+"   label="Enseignants" />
    </section>
  );
}