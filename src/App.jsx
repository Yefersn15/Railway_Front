import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { LayoutProvider, useLayout } from './features/shared/context/LayoutContext';
import { ThemeProvider } from './features/shared/context/ThemeContext';
import ProtectedRoute from './features/shared/components/ProtectedRoute';
import Navbar from './features/shared/components/Navbar';
import Sidebar from './features/shared/components/Sidebar';

// Auth Pages
import AuthPage from './features/auth/pages/AuthPage';

// Dashboard
import Dashboard from './features/dashboard/pages/Dashboard';

// Productos
import Productos from './features/productos/pages/Productos';

// Categorías
import Categorias from './features/categorias/pages/Categorias';

// Ventas
import Ventas from './features/ventas/pages/Ventas';

// Usuarios
import Usuarios from './features/usuarios/pages/Usuarios';
import Perfil from './features/usuarios/pages/Perfil';

// Componente para páginas en construcción
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
    {/* Rutas públicas */}
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<AuthPage />} />
    <Route path="/register" element={<AuthPage />} />

    {/* Rutas protegidas */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/perfil" element={<Perfil />} />

      {/* Rutas adicionales (en construcción) */}
      <Route path="/reportes" element={<PageInConstruction />} />
      <Route path="/configuracion" element={<PageInConstruction />} />
    </Route>

    {/* Ruta 404 */}
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
);

const AppShell = () => {
  const { layoutMode, sidebarCollapsed } = useLayout();
  const { usuario } = useAuth();

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppRoutes />
      </div>
    );
  }

  if (layoutMode === 'sidebar') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className={sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}>
          <div className="container mx-auto px-4 py-8">
            <AppRoutes />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LayoutProvider>
          <AppShell />
        </LayoutProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;