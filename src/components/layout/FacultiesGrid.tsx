import React from 'react';
import { useT } from '../../config/I18nProvider';

export default function FacultiesGrid() {
  const { t } = useT();
  const departments = [
    { code: 'ENI', label: 'Informatique' },
    { code: 'EMIT', label: 'Management & Tech' },
    { code: 'ENS', label: 'Normale Superieure' },
    { code: 'Sciences', label: 'Faculte des Sciences' },
    { code: 'Medecine', label: 'Faculte de Medecine' },
    { code: 'Droit', label: 'Droit & Economie' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black tracking-tight">{t('about', 'sectionLabel')}</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {departments.map((dept) => (
          <div key={dept.code} className="card-hover flex h-36 flex-col justify-between rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500/5 text-xs font-black text-gradient">
              {dept.code[0]}
            </div>
            <div>
              <h4 className="text-xs font-bold">{dept.code}</h4>
              <p className="line-clamp-1 text-[10px] opacity-60">{dept.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
