import React from 'react';

export default function FacultiesGrid() {
  const departments = [
    { code: "ENI", label: "Informatique" },
    { code: "EMIT", label: "Management & Tech" },
    { code: "ENS", label: "Normale Supérieure" },
    { code: "Sciences", label: "Faculté des Sciences" },
    { code: "Médecine", label: "Faculté de Médecine" },
    { code: "Droit", label: "Droit & Économie" }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black tracking-tight">Nos Écoles & Facultés</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {departments.map((dept, i) => (
          <div key={i} className="p-5 rounded-2xl border flex flex-col justify-between h-36 card-hover" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs bg-gray-500/5 text-gradient">
              {dept.code[0]}
            </div>
            <div>
              <h4 className="text-xs font-bold">{dept.code}</h4>
              <p className="text-[10px] opacity-60 line-clamp-1">{dept.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}