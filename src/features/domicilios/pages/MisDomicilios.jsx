import React, { useState, useMemo } from 'react';
import { useDomicilios } from '../hooks/useDomicilios';
import { MapPin, Truck, Package } from 'lucide-react';

const ESTADO_BADGE = {
  pendiente: 'badge-warning',
  en_camino: 'badge-info',
  entregado: 'badge-success',
  cancelado: 'badge-danger',
};

const ESTADO_LABEL = {
  pendiente: 'Pendiente',
  en_camino: 'En camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const MisDomicilios = () => {
  const { domicilios, loading } = useDomicilios('mis');
  const [filter, setFilter] = useState('Todos');

  const filtered = useMemo(() => {
    if (filter === 'Todos') return domicilios;
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mis Domicilios</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Seguimiento de tus pedidos con entrega a domicilio</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_camino">En camino</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <Truck className="mx-auto mb-3" size={40} />
          <p>No tienes domicilios registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((d) => (
            <div key={d.id} className="card p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Venta #{d.venta_id}</span>
                <span className={`badge ${ESTADO_BADGE[d.estado] || 'badge-info'}`}>
                  {ESTADO_LABEL[d.estado] || d.estado}
                </span>
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
                {d.telefono && (
                  <p className="text-gray-500 dark:text-gray-400">Tel: {d.telefono}</p>
                )}
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

export default MisDomicilios;
