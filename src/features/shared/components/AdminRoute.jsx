import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';

const AdminRoute = () => {
  const { usuario } = useAuth();

  return usuario?.rol === 'admin' ? <Outlet /> : <Navigate to="/tienda" replace />;
};

export default AdminRoute;
