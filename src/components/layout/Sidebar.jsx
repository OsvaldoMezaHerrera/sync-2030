import React from 'react';
import { useSync } from '../../context/SyncContext';
import { Globe, Bot, Kanban, BarChart3, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const { currentView, setCurrentView } = useSync();

  const navItems = [
    {
      id: 'panel-global',
      label: 'Panel Global y Juntas',
      description: 'Relojes, horario rotativo y salas',
      icon: Globe,
    },
    {
      id: 'gemelo-sincronia',
      label: 'Gemelo de Sincronía',
      description: 'Asistente de IA y ausencias',
      icon: Bot,
    },
    {
      id: 'tablero-valor',
      label: 'Tablero por Valor',
      description: 'Kanban y Semáforo Cultural',
      icon: Kanban,
    },
    {
      id: 'medicion',
      label: 'Medición e Impacto',
      description: '% Aplicación y Retorno',
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-full overflow-y-auto">
      {/* Navegación Principal */}
      <div className="p-4 space-y-6">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3">
            Módulos del Sistema
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-start space-x-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-sm leading-tight">{item.label}</div>
                    <div className={`text-[11px] leading-tight mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Resumen de Garantías Culturales */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center space-x-2 text-indigo-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wide">Escudo Activo</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Mensajes fuera de horario se programan a la mañana del destinatario. Máximo 2h inmersivas continuas.
          </p>
          <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
            <span>IA Gemelo:</span>
            <span className="flex items-center space-x-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% Offline</span>
            </span>
          </div>
        </div>
      </div>

      {/* Pie del Menú */}
      <div className="p-4 border-t border-slate-800 text-slate-400 text-[11px] space-y-1">
        <div className="flex items-center justify-between font-medium text-slate-300">
          <span>SYNC 2030 Enterprise</span>
          <span className="text-[10px] text-emerald-400 font-semibold">Producción</span>
        </div>
        <p className="text-slate-400">
          Tokio (UTC+9) • Berlín (UTC+1) • Guadalajara (UTC-6)
        </p>
      </div>
    </aside>
  );
}
