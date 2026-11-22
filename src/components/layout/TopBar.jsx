import React, { useState, useRef, useEffect } from 'react';
import { useSync } from '../../context/SyncContext';
import { Settings, RotateCcw, Check } from 'lucide-react';

export default function TopBar() {
  const { activeUser, activeUserId, setActiveUserId, teamMembers, resetDemoData } = useSync();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const settingsRef = useRef(null);

  // Cerrar menú de ajustes al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
        setShowResetConfirm(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = () => {
    resetDemoData();
    setShowResetConfirm(true);
    setTimeout(() => {
      setShowResetConfirm(false);
      setIsSettingsOpen(false);
    }, 1500);
  };

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20">
      {/* Marca y Lema Oficial */}
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

      {/* Acciones y Selector de Usuario Activo */}
      <div className="flex items-center space-x-3">
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
            title="Cambiar integrante activo"
          >
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.baseCity} — {member.role})
              </option>
            ))}
          </select>
        </div>

        {/* Menú discreto de Ajustes y Restauración de Entorno */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            title="Ajustes de entorno"
            aria-label="Ajustes de entorno"
          >
            <Settings className="w-4 h-4" />
          </button>

          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-30 text-xs">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-800">Ajustes del Sistema</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Gestión de datos y preferencias</p>
              </div>

              <div className="p-2">
                <button
                  onClick={handleReset}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  {showResetConfirm ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-700">Entorno restaurado</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4 text-slate-500" />
                      <span>Restaurar datos iniciales</span>
                    </>
                  )}
                </button>
              </div>

              <div className="px-4 py-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                SYNC 2030 Enterprise • Local Data Store
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
