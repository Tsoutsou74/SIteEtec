import React, { useMemo } from 'react';
import { Building2, Mail, Phone, UserRound } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useT } from '../config/I18nProvider';

interface Member {
  id: number;
  name: string;
  role: string;
  category: 'Direction' | 'Mentions' | 'Administration' | 'Enseignants';
  email: string;
  phone: string;
  imageUrl?: string;
  order: number;
}

const CATEGORIES: Member['category'][] = ['Direction', 'Mentions', 'Administration', 'Enseignants'];

const STATIC_MEMBERS: Member[] = [
  { id: 1, name: 'Direction E-TEC', role: 'Administration générale', category: 'Direction', email: 'contact@etec.mg', phone: '+261 34 00 000 00', order: 1 },
  { id: 2, name: 'Département Génie Logiciel', role: 'Chef de mention GL', category: 'Mentions', email: 'gl@etec.mg', phone: '+261 34 00 000 01', order: 1 },
  { id: 3, name: 'Département Administration', role: 'Chef de mention ADM', category: 'Mentions', email: 'adm@etec.mg', phone: '+261 34 00 000 02', order: 2 },
  { id: 4, name: 'Département BTP', role: 'Chef de mention BTP', category: 'Mentions', email: 'btp@etec.mg', phone: '+261 34 00 000 03', order: 3 },
  { id: 5, name: 'Département Électromécanique', role: 'Chef de mention EM', category: 'Mentions', email: 'em@etec.mg', phone: '+261 34 00 000 04', order: 4 },
  { id: 6, name: 'Service Scolarité', role: 'Responsable scolarité', category: 'Administration', email: 'scolarite@etec.mg', phone: '+261 34 00 000 05', order: 1 },
  { id: 7, name: 'Service Financier', role: 'Responsable financier', category: 'Administration', email: 'finance@etec.mg', phone: '+261 34 00 000 06', order: 2 },
];

export default function Organigrammes() {
  const { darkMode } = useTheme();
  const { t } = useT();

  const groupedMembers = useMemo(() => {
    const groups: Record<Member['category'], Member[]> = {
      Direction: [],
      Mentions: [],
      Administration: [],
      Enseignants: [],
    };

    STATIC_MEMBERS.forEach((member) => {
      if (groups[member.category]) {
        groups[member.category].push(member);
      }
    });

    CATEGORIES.forEach((category) => {
      groups[category].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    return groups;
  }, []);

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.32)' : 'rgba(255,255,255,0.72)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  const categoryLabelMap: Record<Member['category'], string> = {
    Direction: t('organigram', 'direction'),
    Mentions: t('organigram', 'mentions'),
    Administration: t('organigram', 'administration'),
    Enseignants: t('organigram', 'teachers'),
  };

  return (
    <div className="animate-fade-in w-full px-4 pb-12 pt-24 sm:px-6 md:pb-16 md:pt-28 lg:px-12">
      <section className="mx-auto max-w-6xl space-y-10">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-500">
            <Building2 size={15} /> {t('organigram', 'sectionLabel')}
          </span>
          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {t('organigram', 'title1')} <span className="text-gradient">{t('organigram', 'title2')}</span>
          </h1>
          <p className="text-sm leading-relaxed opacity-70 md:text-base">
            {t('organigram', 'desc')}
          </p>
        </div>

        <div className="space-y-10">
          {CATEGORIES.map((category) => {
            const categoryMembers = groupedMembers[category];

            if (categoryMembers.length === 0) return null;

            return (
              <section key={category} className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border text-green-500" style={cardStyle}>
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest">{categoryLabelMap[category]}</h2>
                    <p className="text-[11px] font-semibold opacity-50">
                      {categoryMembers.length} {t('organigram', 'responsibles')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryMembers.map((member) => (
                    <article key={member.id} className="rounded-2xl border p-5 shadow-sm" style={cardStyle}>
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-green-500/10 text-green-500" style={{ borderColor: 'var(--border)' }}>
                          {member.imageUrl ? <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" /> : <UserRound size={22} />}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-black tracking-tight">{member.name}</h3>
                          <p className="mt-1 text-xs font-bold text-green-500">{member.role}</p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2 border-t pt-4 text-[11px] opacity-65" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex min-w-0 items-center gap-2">
                          <Mail size={12} className="shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={12} className="shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
