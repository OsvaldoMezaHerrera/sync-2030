import React, { useState } from 'react';
import { useSync } from '../../context/SyncContext';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Target, 
  Layers, 
  Sliders, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Info,
  ArrowUpRight,
  Clock,
  Heart,
  Users
} from 'lucide-react';
import ExecutiveSummaryBar from './medicion/ExecutiveSummaryBar';
import PracticesTable from './medicion/PracticesTable';
import AuditLogSection from './medicion/AuditLogSection';
import KpiCard from './medicion/KpiCard';
import KpiEditModal from './medicion/KpiEditModal';

export default function MedicionView() {
  const {
    practices,
    updatePracticePercent,
    adoptionScore,
    adoptionStatus,
    kpis,
    updateKpiValue,
    auditLogs,
    addAuditLog,
    activeUser
  } = useSync();

  // Pestañas internas del módulo
  const [activeTab, setActiveTab] = useState('adopcion'); // 'adopcion' | 'retorno'

  // Modal de edición de KPI
  const [editingKpi, setEditingKpi] = useState(null);

  // Estadísticas de retorno para cabecera de la pestaña 2
  const achievedKpisCount = kpis.filter(k => k.status === 'meta-alcanzada').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Encabezado Principal del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Medición de Aplicación e Impacto
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Módulo 4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoreo en tiempo real del porcentaje de adopción y retorno de valor gerencial en las tres sedes.
          </p>
        </div>

        {/* Selector de Pestañas Internas */}
        <div className="flex items-center bg-slate-200/60 p-1 rounded-xl self-start md:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('adopcion')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'adopcion'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Índice de Aplicación</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              adoptionStatus.color === 'verde' ? 'bg-emerald-100 text-emerald-800' :
              adoptionStatus.color === 'amarillo' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {adoptionScore}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('retorno')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'retorno'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Retorno en Cohesión e Innovación</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
              7 Indicadores
            </span>
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: ÍNDICE DE APLICACIÓN (% DE ADOPCIÓN) */}
      {activeTab === 'adopcion' && (
        <div className="space-y-6 animate-fade-in">
          {/* 1. Resumen Ejecutivo Superior */}
          <ExecutiveSummaryBar
            adoptionScore={adoptionScore}
            adoptionStatus={adoptionStatus}
            practices={practices}
          />

          {/* 2. Panel de las 8 Prácticas Ponderadas */}
          <PracticesTable
            practices={practices}
            onUpdatePercent={updatePracticePercent}
          />

          {/* 3. Registro de Auditoría Semanal por Muestreo */}
          <AuditLogSection
            practices={practices}
            auditLogs={auditLogs}
            onAddAuditLog={addAuditLog}
            activeUser={activeUser}
          />
        </div>
      )}

      {/* PESTAÑA 2: RETORNO EN COHESIÓN E INNOVACIÓN */}
      {activeTab === 'retorno' && (
        <div className="space-y-6 animate-fade-in">
          {/* Tarjeta de Síntesis Ejecutiva de Retorno */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
                    Tablero de Retorno de Inversión
                  </span>
                  <span className="text-xs text-slate-400">
                    Horizonte 2030 • 12 Semanas
                  </span>
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">
                  "No gestionamos horas. Gestionamos impacto."
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Evaluación cuantitativa de los 7 indicadores clave (5 de eficiencia operativa y 2 de innovación) comparando la línea base previa contra los supuestos proyectados a la Semana 12.
                </p>
              </div>

              {/* Métricas destacadas de síntesis */}
              <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-center">
                  <div className="text-xs text-slate-400 font-medium">Reuniones en vivo</div>
                  <div className="text-lg font-bold font-mono text-emerald-400">-50%</div>
                  <div className="text-[10px] text-slate-400">Meta: -60%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-center">
                  <div className="text-xs text-slate-400 font-medium">Bienestar Digital</div>
                  <div className="text-lg font-bold font-mono text-indigo-300">72 / 100</div>
                  <div className="text-[10px] text-slate-400">Meta: 75 / 100</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-center">
                  <div className="text-xs text-slate-400 font-medium">Metas Logradas</div>
                  <div className="text-lg font-bold font-mono text-teal-300">{achievedKpisCount} de 7</div>
                  <div className="text-[10px] text-slate-400">En trayectoria</div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de los 7 Indicadores de Impacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {kpis.map((kpi) => (
              <KpiCard
                key={kpi.id}
                kpi={kpi}
                onOpenEdit={setEditingKpi}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal de Edición de Medición de KPI */}
      {editingKpi && (
        <KpiEditModal
          kpi={editingKpi}
          onClose={() => setEditingKpi(null)}
          onSave={updateKpiValue}
          activeUser={activeUser}
        />
      )}
    </div>
  );
}
