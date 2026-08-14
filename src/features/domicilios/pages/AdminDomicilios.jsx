import React from 'react';
import { useDomicilios } from '../hooks/useDomicilios';
import { useUsuarios } from '../../usuarios/hooks/useUsuarios';
import { Truck, RefreshCw } from 'lucide-react';

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

const AdminDomicilios = () => {
  const { domicilios, loading, fetchDomicilios, cambiarEstado, asignarRepartidor } = useDomicilios('todos');
  const { usuarios } = useUsuarios();

  const domiciliarios = usuarios.filter((u) => u.rol === 'domiciliario');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Domicilios</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona las entregas a domicilio</p>
        </div>
        <button
          onClick={fetchDomicilios}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center"
        >
          <RefreshCw size={20} className="mr-2" />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : domicilios.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <Truck className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay domicilios registrados</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Venta</th>
                <th>Cliente</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Total</th>
                <th>Domiciliario</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {domicilios.map((d) => (
                <tr key={d.id}>
                  <td>#{d.venta_id}</td>
                  <td>{d.usuario_nombre || 'Usuario'}</td>
                  <td>
                    {d.direccion}
                    {d.barrio && ` — ${d.barrio}`}
                    {d.ciudad && `, ${d.ciudad}`}
                  </td>
                  <td>{d.telefono || '—'}</td>
                  <td className="font-semibold">${Number(d.total).toFixed(2)}</td>
                  <td>
                    <select
                      value={d.repartidor_id || ''}
                      onChange={(e) => asignarRepartidor(d.id, e.target.value ? Number(e.target.value) : null)}
                      className="text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sin asignar</option>
                      {domiciliarios.map((rep) => (
                        <option key={rep.id} value={rep.id}>{rep.nombre}</option>
                      ))}
                    </select>
                  </td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDomicilios;
