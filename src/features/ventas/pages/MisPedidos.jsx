import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ShoppingBag,
  Truck,
  Eye,
  X,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  CheckCircle2,
  Circle,
  XCircle,
  StickyNote,
} from 'lucide-react';
import { getOptimizedUrl } from '../../../utils/cloudinary';

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

const PASOS_ENTREGA = [
  { key: 'pendiente', label: 'Confirmado' },
  { key: 'en_camino', label: 'En camino' },
  { key: 'entregado', label: 'Entregado' },
];

const EntregaStepper = ({ estado }) => {
  if (estado === 'cancelado') {
    return (
      <div className="flex items-center text-red-600 dark:text-red-400 text-sm font-medium">
        <XCircle size={16} className="mr-1.5" />
        Este pedido fue cancelado
      </div>
    );
  }

  const pasoActual = PASOS_ENTREGA.findIndex((p) => p.key === estado);

  return (
    <div className="flex items-center">
      {PASOS_ENTREGA.map((paso, index) => {
        const completado = index <= pasoActual;
        return (
          <React.Fragment key={paso.key}>
            <div className="flex flex-col items-center">
              {completado ? (
                <CheckCircle2 size={22} className="text-green-600 dark:text-green-400" />
              ) : (
                <Circle size={22} className="text-gray-300 dark:text-gray-600" />
              )}
              <span
                className={`mt-1 text-xs text-center ${
                  completado
                    ? 'text-gray-900 dark:text-gray-100 font-medium'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {paso.label}
              </span>
            </div>
            {index < PASOS_ENTREGA.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-4 ${
                  index < pasoActual ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const MisPedidos = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

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

  const handleVerDetalle = async (id) => {
    setLoadingDetalle(true);
    try {
      const response = await api.get(`/ventas/${id}`);
      setSelectedVenta(response.data);
    } catch (error) {
      toast.error('Error al obtener el detalle del pedido');
    } finally {
      setLoadingDetalle(false);
    }
  };

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
            <button
              key={venta.id}
              onClick={() => handleVerDetalle(venta.id)}
              disabled={loadingDetalle}
              className="card p-5 w-full flex items-center justify-between text-left hover:ring-2 hover:ring-blue-500 transition disabled:opacity-60"
            >
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
              <div className="text-right flex flex-col items-end gap-2">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  ${Number(venta.total).toFixed(2)}
                </p>
                {venta.domicilio_estado && (
                  <span className={`badge ${ESTADO_BADGE[venta.domicilio_estado] || 'badge-info'}`}>
                    {ESTADO_LABEL[venta.domicilio_estado] || venta.domicilio_estado}
                  </span>
                )}
                <span className="flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium">
                  <Eye size={14} className="mr-1" />
                  Ver detalle
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal de detalle del pedido */}
      {selectedVenta && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <ShoppingBag className="text-white" size={22} />
                </div>
                <h2 className="text-xl font-bold text-white">Pedido #{selectedVenta.id}</h2>
              </div>
              <button
                onClick={() => setSelectedVenta(null)}
                className="text-white/80 hover:text-white transition p-2 hover:bg-white/20 rounded-full"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Info general */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar size={16} className="mr-2 shrink-0" />
                  {format(new Date(selectedVenta.fecha), "d 'de' MMMM, yyyy HH:mm", { locale: es })}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 capitalize">
                  <CreditCard size={16} className="mr-2 shrink-0" />
                  {selectedVenta.metodo_pago}
                </div>
              </div>

              {/* Entrega */}
              {selectedVenta.domicilio ? (
                <div className="mb-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="mb-4">
                    <EntregaStepper estado={selectedVenta.domicilio.estado} />
                  </div>
                  <div className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-start">
                      <MapPin size={16} className="mr-2 mt-0.5 shrink-0 text-gray-400" />
                      <span>
                        {selectedVenta.domicilio.direccion}
                        {selectedVenta.domicilio.direccion2 ? `, ${selectedVenta.domicilio.direccion2}` : ''}
                        {selectedVenta.domicilio.barrio ? ` · ${selectedVenta.domicilio.barrio}` : ''}
                        {selectedVenta.domicilio.ciudad ? ` · ${selectedVenta.domicilio.ciudad}` : ''}
                      </span>
                    </div>
                    {selectedVenta.domicilio.telefono && (
                      <div className="flex items-center">
                        <Phone size={16} className="mr-2 shrink-0 text-gray-400" />
                        {selectedVenta.domicilio.telefono}
                      </div>
                    )}
                    {selectedVenta.domicilio.notas && (
                      <div className="flex items-start">
                        <StickyNote size={16} className="mr-2 mt-0.5 shrink-0 text-gray-400" />
                        {selectedVenta.domicilio.notas}
                      </div>
                    )}
                  </div>
                  {Number(selectedVenta.domicilio.costo_envio) > 0 && (
                    <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span>Costo de envío</span>
                      <span className="font-medium">
                        ${Number(selectedVenta.domicilio.costo_envio).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Package size={16} className="mr-2" />
                  Compra recogida en tienda, sin domicilio.
                </div>
              )}

              {/* Productos */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Productos</h3>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  {(selectedVenta.detalles || []).map((detalle, index) => (
                    <div key={index} className="flex items-center gap-3 px-4 py-3">
                      <div className="h-12 w-12 shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                        {detalle.producto_imagen ? (
                          <img
                            src={getOptimizedUrl(detalle.producto_imagen, { width: 96, height: 96 })}
                            alt={detalle.producto_nombre}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="text-gray-400 dark:text-gray-500" size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {detalle.producto_nombre || `Producto ${detalle.producto_id}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {detalle.cantidad} x ${Number(detalle.precio_unitario).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        ${Number(detalle.subtotal).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-gray-100 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span>${Number(selectedVenta.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
