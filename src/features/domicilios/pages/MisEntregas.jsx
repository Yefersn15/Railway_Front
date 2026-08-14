import React, { useState, useMemo } from 'react';
import { useDomicilios } from '../hooks/useDomicilios';
import { MapPin, Truck, Package } from 'lucide-react';

const ESTADOS = ['pendiente', 'en_camino', 'entregado', 'cancelado'];

const ESTADO_LABEL = {
  pendiente: 'Pendiente',
  en_camino: 'En camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const ESTADO_SELECT_CLASS = {
  pendiente: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  en_camino: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  entregado: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  cancelado: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

const MisEntregas = () => {
  const { domicilios, loading, cambiarEstado } = useDomicilios('entregas');
  const [filter, setFilter] = useState('activas');

  const filtered = useMemo(() => {
    if (filter === 'Todos') return domicilios;
    if (filter === 'activas') return domicilios.filter((d) => !['entregado', 'cancelado'].includes(d.estado));
    if (filter === 'historial') return domicilios.filter((d) => ['entregado', 'cancelado'].includes(d.estado));
    return domicilios.filter((d) => d.estado === filter);
  }, [domicilios, filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mis Entregas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Domicilios asignados a ti</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="activas">Activas</option>
          <option value="historial">Historial</option>
          <option value="Todos">Todos los estados</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <Truck className="mx-auto mb-3" size={40} />
          <p>No tienes entregas en esta vista.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((d) => (
            <div key={d.id} className="card p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Venta #{d.venta_id}</span>
                <select
                  value={d.estado}
                  onChange={(e) => cambiarEstado(d.id, e.target.value)}
                  className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${ESTADO_SELECT_CLASS[d.estado] || ''}`}
                >
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {ESTADO_LABEL[estado]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p className="flex items-start">
                  <MapPin size={14} className="mr-1.5 mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>
                    {d.direccion}
                    {d.direccion2 && `, ${d.direccion2}`}
                    {d.barrio && ` — ${d.barrio}`}
                    {d.ciudad && `, ${d.ciudad}`}
                  </span>
                </p>
                {d.telefono && <p className="text-gray-500 dark:text-gray-400">Tel: {d.telefono}</p>}
                <p className="text-gray-500 dark:text-gray-400">Cliente: {d.usuario_nombre || 'N/A'}</p>
                <p className="flex items-center text-gray-500 dark:text-gray-400">
                  <Package size={14} className="mr-1.5" />
                  Total del pedido: ${Number(d.total).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisEntregas;
