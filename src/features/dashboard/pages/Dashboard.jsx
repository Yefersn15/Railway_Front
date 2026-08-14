import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import DashboardCards from '../components/DashboardCards';
import ProductChart from '../components/ProductChart';
import RecentSales from '../components/RecentSales';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  const { stats, loading, error } = useDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 py-8">
        Error al cargar el dashboard
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Resumen general de la farmacia</p>
      </div>

      {/* Cards */}
      <DashboardCards data={stats} />

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Productos más vendidos</h2>
          <ProductChart data={stats.productosTop || []} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Ventas Recientes</h2>
          <RecentSales />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/ventas', { state: { openForm: true } })}
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
          >
            Nueva Venta
          </button>
          <button
            onClick={() => navigate('/productos', { state: { openForm: true } })}
            className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition"
          >
            Agregar Producto
          </button>
          <button
            onClick={() => navigate('/productos')}
            className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 p-4 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition"
          >
            Actualizar Stock
          </button>
          <button
            onClick={() => navigate('/reportes')}
            className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 p-4 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
          >
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;