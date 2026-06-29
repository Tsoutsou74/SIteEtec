import React from 'react';

export default function EventsSidebar() {
  const events = [
    { day: "25", month: "MAI", title: "Journée portes ouvertes Faravohitra" },
    { day: "02", month: "JUIN", title: "Conférence Innovation & Communication" }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black tracking-tight">À venir</h3>
      <div className="space-y-4">
        {events.map((ev, i) => (
          <div key={i} className="p-4 rounded-2xl border flex items-center gap-5 card-hover" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="text-white rounded-xl w-12 h-12 flex flex-col items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}>
              <span className="text-base font-black leading-none">{ev.day}</span>
              <span className="text-[8px] font-bold mt-0.5">{ev.month}</span>
            </div>
            <h4 className="text-xs font-bold line-clamp-2 leading-tight">{ev.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}