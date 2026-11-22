import React from 'react';
import { useSync } from '../../context/SyncContext';
import { RotateCcw, User, ShieldCheck, Clock } from 'lucide-react';

export default function TopBar() {
  const { activeUser, activeUserId, setActiveUserId, teamMembers, resetDemoData } = useSync();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Marca y Lema */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
          S
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-slate-900 tracking-tight text-lg">SYNC 2030</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Horizonte 2030
            </span>
          </div>
          <p className="text-xs text-slate-500 italic hidden sm:block">
            "No gestionamos horas. Gestionamos impacto."
          </p>
        </div>
      </div>

      {/* Acciones y Selector de Usuario */}
      <div className="flex items-center space-x-4">
        {/* Botón de Reinicio Demo */}
        <button
          onClick={resetDemoData}
          title="Restaura todos los datos al estado semilla de la demo"
          className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reiniciar datos demo</span>
        </button>

        {/* Selector de integrante activo */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 pl-3">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {activeUser.name}
            </span>
            <span className="text-[11px] text-slate-500 leading-tight">
              {activeUser.baseCity} ({activeUser.scope})
            </span>
          </div>
          <div className={`w-8 h-8 rounded-full ${activeUser.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
            {activeUser.avatarInitials}
          </div>
          <select
            value={activeUserId}
            onChange={(e) => setActiveUserId(e.target.value)}
            className="text-xs bg-transparent border-0 text-slate-700 font-medium focus:ring-0 cursor-pointer ml-1"
            title="Cambiar integrante activo para la prueba de interacción"
          >
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.baseCity} — {member.role})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
