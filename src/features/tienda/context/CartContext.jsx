import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { usuario } = useAuth();
  const storageKey = usuario ? `carrito_${usuario.id}` : null;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!storageKey) {
      setItems([]);
      return;
    }
    try {
      const stored = localStorage.getItem(storageKey);
      setItems(stored ? JSON.parse(stored) : []);
    } catch (error) {
      setItems([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, storageKey]);

  const addToCart = (producto, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto_id === producto.id);
      const nuevaCantidad = Math.min(
        (existente?.cantidad || 0) + cantidad,
        producto.stock
      );

      if (existente) {
        return prev.map((i) =>
          i.producto_id === producto.id ? { ...i, cantidad: nuevaCantidad } : i
        );
      }
      return [...prev, { producto_id: producto.id, cantidad: nuevaCantidad }];
    });
    toast.success('Producto agregado al carrito');
  };

  const updateQuantity = (productoId, cantidad) => {
    setItems((prev) =>
      prev.map((i) => (i.producto_id === productoId ? { ...i, cantidad } : i))
    );
  };

  const removeFromCart = (productoId) => {
    setItems((prev) => prev.filter((i) => i.producto_id !== productoId));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export default CartContext;
