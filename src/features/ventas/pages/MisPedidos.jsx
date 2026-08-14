import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShoppingBag, Truck } from 'lucide-react';

const ESTADO_LABEL = {
  pendiente: 'Pendiente',
  en_camino: 'En camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const ESTADO_BADGE = {
  pendiente: 'badge-warning',
  en_camino: 'badge-info',
  entregado: 'badge-success',
  cancelado: 'badge-danger',
};

const MisPedidos = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisCompras = async () => {
      try {
        const response = await api.get('/ventas/mis-compras');
        setCompras(response.data);
      } catch (error) {
        toast.error('Error al cargar tus pedidos');
      } finally {
        setLoading(false);
      }
    };
    fetchMisCompras();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Mis Pedidos</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Historial de tus compras</p>

      {compras.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <ShoppingBag className="mx-auto mb-3" size={40} />
          <p>Todavía no has realizado ninguna compra.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {compras.map((venta) => (
            <div key={venta.id} className="card p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Pedido #{venta.id}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(venta.fecha), "d 'de' MMMM, yyyy HH:mm", { locale: es })}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  Pago: {venta.metodo_pago}
                </p>
                {venta.domicilio_estado && (
                  <p className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Truck size={14} className="mr-1" />
                    {venta.domicilio_direccion}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  ${Number(venta.total).toFixed(2)}
                </p>
                {venta.domicilio_estado && (
                  <span className={`badge ${ESTADO_BADGE[venta.domicilio_estado] || 'badge-info'}`}>
                    {ESTADO_LABEL[venta.domicilio_estado] || venta.domicilio_estado}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
