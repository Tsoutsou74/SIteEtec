import React from 'react';
import { Users, GraduationCap, BookOpen, UserCheck } from 'lucide-react';
import { useT } from '../../config/I18nProvider';

interface StatCardProps {
  icon: React.ReactNode;
  count: string;
  label: string;
}

function StatCard({ icon, count, label }: StatCardProps) {
  return (
    <div
      className="card-hover flex items-center gap-4 rounded-2xl border p-4 shadow-md backdrop-blur-md transition-all duration-300 md:gap-5 md:p-6"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-500/5 md:h-12 md:w-12">
        {icon}
      </div>
      <div>
        <div className="mb-1 text-xl font-black leading-none tracking-tight md:text-2xl">{count}</div>
        <div className="text-xs font-medium opacity-60">{label}</div>
      </div>
    </div>
  );
}

export default function StatsSection() {
  const { t } = useT();

  return (
    <section className="relative z-20 mx-auto -mt-8 grid max-w-7xl grid-cols-2 gap-3 px-4 animate-fade-up sm:-mt-10 sm:px-8 md:-mt-14 md:gap-5 md:px-12 md:grid-cols-4">
      <StatCard icon={<Users size={20} className="text-blue-500" />} count="12,000+" label={t('stats', 'students')} />
      <StatCard icon={<GraduationCap size={20} style={{ color: 'var(--primary)' }} />} count="8" label={t('stats', 'faculties')} />
      <StatCard icon={<BookOpen size={20} className="text-amber-500" />} count="150+" label={t('stats', 'programs')} />
      <StatCard icon={<UserCheck size={20} className="text-teal-500" />} count="500+" label={t('stats', 'teachers')} />
    </section>
  );
}
