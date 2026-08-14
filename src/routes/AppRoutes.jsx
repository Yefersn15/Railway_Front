import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Auth
import AuthPage from '../features/auth/pages/AuthPage';

// Admin
import Dashboard from '../features/dashboard/pages/Dashboard';
import Productos from '../features/productos/pages/Productos';
import Categorias from '../features/categorias/pages/Categorias';
import Ventas from '../features/ventas/pages/Ventas';
import Usuarios from '../features/usuarios/pages/Usuarios';
import AdminDomicilios from '../features/domicilios/pages/AdminDomicilios';

// Cualquier usuario autenticado
import Perfil from '../features/usuarios/pages/Perfil';

// Tienda (pública, cualquiera puede navegar y agregar al carrito sin loguearse)
import Tienda from '../features/tienda/pages/Tienda';
import Carrito from '../features/tienda/pages/Carrito';
import Checkout from '../features/tienda/pages/Checkout';
import MisPedidos from '../features/ventas/pages/MisPedidos';
import MisDomicilios from '../features/domicilios/pages/MisDomicilios';

// Domiciliario
import MisEntregas from '../features/domicilios/pages/MisEntregas';

const PageInConstruction = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            <span className="font-medium">¡Atención!</span> Esta página está en construcción.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const AppRoutes = () => (
  <Routes>
    {/* Rutas públicas: el catálogo es la página de inicio, sin necesidad de login */}
    <Route path="/" element={<Tienda />} />
    <Route path="/tienda" element={<Tienda />} />
    <Route path="/tienda/categoria/:categoriaId" element={<Tienda />} />
    <Route path="/carrito" element={<Carrito />} />
    <Route path="/login" element={<AuthPage />} />
    <Route path="/register" element={<AuthPage />} />

    {/* Cualquier usuario autenticado (admin, usuario o domiciliario) puede comprar */}
    <Route element={<PrivateRoute />}>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/mis-pedidos" element={<MisPedidos />} />
      <Route path="/mis-domicilios" element={<MisDomicilios />} />
      <Route path="/perfil" element={<Perfil />} />
    </Route>

    {/* Domiciliario */}
    <Route element={<PrivateRoute roles={['domiciliario']} />}>
      <Route path="/mis-entregas" element={<MisEntregas />} />
    </Route>

    {/* Administración */}
    <Route element={<PrivateRoute roles={['admin']} />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/domicilios" element={<AdminDomicilios />} />
      <Route path="/reportes" element={<PageInConstruction />} />
      <Route path="/configuracion" element={<PageInConstruction />} />
    </Route>

    {/* Ruta 404: vuelve al catálogo */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
