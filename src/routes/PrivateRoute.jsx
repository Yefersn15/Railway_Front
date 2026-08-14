import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

export const roleHome = (rol) => {
  if (rol === 'admin') return '/dashboard';
  if (rol === 'domiciliario') return '/mis-entregas';
  return '/tienda';
};

// Ruta protegida por autenticación y, opcionalmente, por rol.
// Sin `roles`: cualquier usuario autenticado puede entrar.
// Con `roles`: solo los roles listados; el resto es redirigido a su home.
const PrivateRoute = ({ roles }) => {
  const { usuario, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to={roleHome(usuario.rol)} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
