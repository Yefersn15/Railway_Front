import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

const GUEST_KEY = 'carrito_guest';

const readCart = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

const mergeCarts = (base, extra) => {
  const merged = [...base];
  extra.forEach((item) => {
    const idx = merged.findIndex((i) => i.producto_id === item.producto_id);
    if (idx > -1) {
      merged[idx] = { ...merged[idx], cantidad: merged[idx].cantidad + item.cantidad };
    } else {
      merged.push(item);
    }
  });
  return merged;
};

export const CartProvider = ({ children }) => {
  const { usuario } = useAuth();
  const storageKey = usuario ? `carrito_${usuario.id}` : GUEST_KEY;
  const [items, setItems] = useState([]);

  // Al iniciar sesión, fusiona lo que se agregó como invitado con el carrito del usuario.
  useEffect(() => {
    if (!usuario) {
      setItems(readCart(GUEST_KEY));
      return;
    }

    const guestItems = readCart(GUEST_KEY);
    const userItems = readCart(`carrito_${usuario.id}`);

    if (guestItems.length > 0) {
      const merged = mergeCarts(userItems, guestItems);
      localStorage.removeItem(GUEST_KEY);
      setItems(merged);
    } else {
      setItems(userItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
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
