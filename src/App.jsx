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
    <div className="h-screen overflow-hidden flex flex-col bg-slate-50 text-slate-800">
      {/* Barra Superior Institucional Fija */}
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Barra Lateral Izquierda Fija */}
        <Sidebar />

        {/* Único contenedor principal con scroll independiente */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {currentView === 'panel-global' && <PanelGlobalView />}
          {currentView === 'gemelo-sincronia' && <GemeloSincroniaView />}
          {currentView === 'tablero-valor' && <TableroValorView />}
          {currentView === 'medicion' && <MedicionView />}
        </main>
      </div>
    </div>
  );
}
