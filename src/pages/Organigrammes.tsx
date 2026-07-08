import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Mail, Phone, UserRound } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ApiService from '../services/ApiService';

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

const FALLBACK_MEMBERS: Member[] = [
  {
    id: 1,
    name: 'Direction E-TEC',
    role: 'Administration generale',
    category: 'Direction',
    email: 'contact@etec.mg',
    phone: '+261 34 00 000 00',
    order: 1,
  },
];

export default function Organigrammes() {
  const { darkMode } = useTheme();
  const [members, setMembers] = useState<Member[]>(FALLBACK_MEMBERS);

  useEffect(() => {
    let isMounted = true;

    const loadOrganigramme = async () => {
      try {
        const response = await ApiService.organigrammes.getAll();
        const data = response.data;

        if (isMounted && Array.isArray(data) && data.length > 0) {
          setMembers(data);
        }
      } catch {
        if (isMounted) {
          setMembers(FALLBACK_MEMBERS);
        }
      }
    };

    loadOrganigramme();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedMembers = useMemo(() => {
    const groups: Record<Member['category'], Member[]> = {
      Direction: [],
      Mentions: [],
      Administration: [],
      Enseignants: [],
    };

    members.forEach((member) => {
      if (groups[member.category]) {
        groups[member.category].push(member);
      }
    });

    CATEGORIES.forEach((category) => {
      groups[category].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    return groups;
  }, [members]);

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.32)' : 'rgba(255,255,255,0.72)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 pt-28 md:pt-32 pb-16 animate-fade-in">
      <section className="max-w-6xl mx-auto space-y-10">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-green-500">
            <Building2 size={15} /> Organisation
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Organigramme de <span className="text-gradient">E-TEC University</span>
          </h1>
          <p className="text-sm md:text-base opacity-70 leading-relaxed">
            Retrouvez les responsables de la direction, des mentions, de l'administration et des equipes pedagogiques.
          </p>
        </div>

        <div className="space-y-10">
          {CATEGORIES.map((category) => {
            const categoryMembers = groupedMembers[category];

            if (categoryMembers.length === 0) return null;

            return (
              <section key={category} className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-9 h-9 rounded-xl border flex items-center justify-center text-green-500" style={cardStyle}>
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest">{category}</h2>
                    <p className="text-[11px] opacity-50 font-semibold">{categoryMembers.length} responsable(s)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categoryMembers.map((member) => (
                    <article key={member.id} className="rounded-2xl border p-5 shadow-sm" style={cardStyle}>
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border flex items-center justify-center shrink-0 bg-green-500/10 text-green-500" style={{ borderColor: 'var(--border)' }}>
                          {member.imageUrl ? (
                            <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserRound size={22} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm font-black tracking-tight truncate">{member.name}</h3>
                          <p className="text-xs font-bold text-green-500 mt-1">{member.role}</p>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t space-y-2 text-[11px] opacity-65" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2 min-w-0">
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
