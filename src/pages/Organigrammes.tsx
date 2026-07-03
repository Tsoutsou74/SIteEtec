import React from 'react';
import { BriefcaseBusiness, GraduationCap, Mail, Network, Phone, Shield, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Member {
  name: string;
  role: string;
  email: string;
  phone: string;
  initials: string;
}

const direction: Member[] = [
  {
    name: 'Dr. Fanilo Rakoto',
    role: 'Directeur General',
    email: 'direction@etec.mg',
    phone: '+261 34 00 123 45',
    initials: 'FR',
  },
  {
    name: 'Mme Miora Andriana',
    role: 'Directrice des Etudes',
    email: 'etudes@etec.mg',
    phone: '+261 32 00 123 46',
    initials: 'MA',
  },
];

const academic: Member[] = [
  {
    name: 'M. Niavo Ranaivo',
    role: 'Responsable Informatique et Reseaux',
    email: 'informatique@etec.mg',
    phone: '+261 33 00 555 01',
    initials: 'NR',
  },
  {
    name: 'Dr. Sylvain Randria',
    role: 'Responsable BTP et Electromecanique',
    email: 'technique@etec.mg',
    phone: '+261 34 00 555 02',
    initials: 'SR',
  },
];

const administration: Member[] = [
  {
    name: 'Mme Justine Rabe',
    role: 'Responsable Scolarite',
    email: 'scolarite@etec.mg',
    phone: '+261 32 00 777 88',
    initials: 'JR',
  },
  {
    name: 'M. Toky Randria',
    role: 'Relations Entreprises',
    email: 'stages@etec.mg',
    phone: '+261 33 00 777 99',
    initials: 'TR',
  },
];

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="rounded-2xl border p-4 md:p-5 shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center text-xs font-black shrink-0">
          {member.initials}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-black tracking-tight">{member.name}</h3>
          <p className="text-[11px] font-bold uppercase tracking-wide text-green-500 mt-1">{member.role}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t space-y-2 text-[11px] opacity-65" style={{ borderColor: 'var(--border)' }}>
        <p className="flex items-center gap-2 min-w-0">
          <Mail size={13} className="shrink-0" />
          <span className="truncate">{member.email}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone size={13} className="shrink-0" />
          <span>{member.phone}</span>
        </p>
      </div>
    </div>
  );
}

function Department({ title, icon: Icon, members }: { title: string; icon: React.ElementType; members: Member[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center">
          <Icon size={17} />
        </div>
        <h2 className="text-sm font-black uppercase tracking-wider">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.map((member) => (
          <MemberCard key={member.email} member={member} />
        ))}
      </div>
    </section>
  );
}

export default function Organigrammes() {
  const { darkMode } = useTheme();

  const panelStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.72)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 pt-28 md:pt-32 pb-16 animate-fade-in">
      <section className="max-w-6xl mx-auto space-y-10">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-green-500">
            <Network size={15} /> Gouvernance
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Organigramme de <span className="text-gradient">E-TEC University</span>
          </h1>
          <p className="text-sm md:text-base opacity-70 leading-relaxed">
            Une organisation claire pour accompagner les etudiants, coordonner les formations et developper les partenariats.
          </p>
        </div>

        <div className="rounded-3xl border p-5 md:p-8 shadow-sm space-y-8" style={panelStyle}>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-green-600 text-white flex items-center justify-center shadow-md">
              <Shield size={28} />
            </div>
            <div className="h-8 w-px bg-green-500/30" />
            <div className="rounded-2xl border px-6 py-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-xs font-black uppercase tracking-widest text-green-500">Direction Generale</p>
              <h2 className="text-lg font-black mt-1">Pilotage institutionnel</h2>
            </div>
          </div>

          <Department title="Direction" icon={BriefcaseBusiness} members={direction} />
          <Department title="Pole pedagogique" icon={GraduationCap} members={academic} />
          <Department title="Services administratifs" icon={Users} members={administration} />
        </div>
      </section>
    </div>
  );
}
