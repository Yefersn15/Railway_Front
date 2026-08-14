import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProductos } from '../../productos/hooks/useProductos';
import api from '../../../api/axiosConfig';
import toast from 'react-hot-toast';
import { Package } from 'lucide-react';

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { productos, loading: loadingProductos } = useProductos();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [direccion2, setDireccion2] = useState('');
  const [barrio, setBarrio] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [notas, setNotas] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const itemsConProducto = items
    .map((item) => ({
      ...item,
      producto: productos.find((p) => p.id === item.producto_id),
    }))
    .filter((item) => item.producto);

  const total = itemsConProducto.reduce(
    (sum, item) => sum + Number(item.producto.precio) * item.cantidad,
    0
  );

  useEffect(() => {
    if (!loadingProductos && itemsConProducto.length === 0) {
      navigate('/carrito');
    }
  }, [loadingProductos, itemsConProducto.length, navigate]);

  const validate = () => {
    const newErrors = {};
    if (delivery) {
      if (!direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';
      if (!telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        metodo_pago: metodoPago,
        detalles: itemsConProducto.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
        })),
      };

      if (delivery) {
        payload.domicilio = { direccion, direccion2, barrio, ciudad, telefono, notas };
      }

      await api.post('/ventas', payload);
      toast.success('¡Compra realizada con éxito!');
      clearCart();
      navigate(delivery ? '/mis-domicilios' : '/tienda');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al procesar la compra');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProductos) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (itemsConProducto.length === 0) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Finalizar compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 card p-6 space-y-5">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="delivery"
              checked={delivery}
              onChange={(e) => setDelivery(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="delivery" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Solicitar entrega a domicilio
            </label>
          </div>

          {delivery && (
            <div className="space-y-4 border-t dark:border-gray-700 pt-4">
              <div>
                <label className="input-label">Dirección *</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Calle 123 #45-67"
                  className="input-field"
                />
                {errors.direccion && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.direccion}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Apto / Referencia (opcional)</label>
                  <input
                    type="text"
                    value={direccion2}
                    onChange={(e) => setDireccion2(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Barrio</label>
                  <input
                    type="text"
                    value={barrio}
                    onChange={(e) => setBarrio(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Ciudad</label>
                  <input
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Teléfono *</label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="input-field"
                  />
                  {errors.telefono && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.telefono}</p>}
                </div>
              </div>

              <div>
                <label className="input-label">Notas para la entrega (opcional)</label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows="2"
                  className="input-field"
                  placeholder="Instrucciones especiales..."
                />
              </div>
            </div>
          )}

          <div className="border-t dark:border-gray-700 pt-4">
            <label className="input-label">Método de pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="input-field"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta de Crédito/Débito</option>
              <option value="transferencia">Transferencia Bancaria</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
          >
            {submitting ? 'Procesando...' : `Confirmar compra - $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="card p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Resumen del pedido</h2>
          <div className="space-y-3 mb-4">
            {itemsConProducto.map(({ producto, cantidad }) => (
              <div key={producto.id} className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                  <Package className="text-gray-400 dark:text-gray-500" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{producto.nombre}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {cantidad} x ${Number(producto.precio).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100 border-t dark:border-gray-700 pt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
