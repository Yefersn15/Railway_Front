import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProductos } from '../../productos/hooks/useProductos';
import { Trash2, ShoppingCart, Package } from 'lucide-react';

const Carrito = () => {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { productos, loading } = useProductos();
  const navigate = useNavigate();

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

  const handleQuantityChange = (productoId, value, stock) => {
    let cantidad = parseInt(value, 10);
    if (isNaN(cantidad) || cantidad < 1) cantidad = 1;
    if (cantidad > stock) cantidad = stock;
    updateQuantity(productoId, cantidad);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (itemsConProducto.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={48} />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Agrega productos desde la tienda para continuar.</p>
        <Link
          to="/tienda"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Carrito de compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {itemsConProducto.map(({ producto, cantidad }) => (
            <div key={producto.id} className="card p-4 flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Package className="text-gray-400 dark:text-gray-500" size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{producto.nombre}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ${Number(producto.precio).toFixed(2)} c/u
                </p>
              </div>
              <input
                type="number"
                min={1}
                max={producto.stock}
                value={cantidad}
                onChange={(e) => handleQuantityChange(producto.id, e.target.value, producto.stock)}
                className="w-16 px-2 py-1 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="w-20 text-right font-semibold text-gray-900 dark:text-gray-100">
                ${(Number(producto.precio) * cantidad).toFixed(2)}
              </span>
              <button
                onClick={() => removeFromCart(producto.id)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="card p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Resumen</h2>
          <div className="flex justify-between text-gray-700 dark:text-gray-300 mb-2">
            <span>Productos</span>
            <span>{itemsConProducto.length}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100 border-t dark:border-gray-700 pt-3 mt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
