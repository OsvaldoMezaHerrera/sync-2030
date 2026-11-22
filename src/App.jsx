import React from 'react';
import { useSync } from './context/SyncContext';
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import PanelGlobalView from './components/views/PanelGlobalView';
import GemeloSincroniaView from './components/views/GemeloSincroniaView';
import TableroValorView from './components/views/TableroValorView';
import MedicionView from './components/views/MedicionView';

export default function App() {
  const { currentView } = useSync();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Barra Superior Institucional */}
      <TopBar />

      <div className="flex flex-1">
        {/* Barra Lateral de Navegación */}
        <Sidebar />

        {/* Área de Contenido Principal */}
        <main className="flex-1 overflow-y-auto">
          {currentView === 'panel-global' && <PanelGlobalView />}
          {currentView === 'gemelo-sincronia' && <GemeloSincroniaView />}
          {currentView === 'tablero-valor' && <TableroValorView />}
          {currentView === 'medicion' && <MedicionView />}
        </main>
      </div>
    </div>
  );
}
