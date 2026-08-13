import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { useLayout } from '../../shared/context/LayoutContext';
import { useTheme } from '../../shared/context/ThemeContext';
import { authService } from '../../auth/authService';
import { User, Mail, Calendar, Shield, PanelTop, PanelLeft, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Perfil = () => {
  const { usuario } = useAuth();
  const { layoutMode, setLayoutMode } = useLayout();
  const { theme, setTheme } = useTheme();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await authService.getPerfil();
        setPerfil(data);
      } catch (error) {
        toast.error('Error al cargar perfil');
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-3">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">{perfil?.nombre}</h1>
              <p className="text-blue-100">Mi Perfil</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{perfil?.nombre}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{perfil?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rol</p>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  perfil?.rol === 'admin'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {perfil?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Miembro desde</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {perfil?.created_at
                    ? new Date(perfil.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Preferencias</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Elige dónde quieres ver el menú de navegación.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setLayoutMode('header')}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 text-left transition-colors ${
                  layoutMode === 'header'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <PanelTop className={layoutMode === 'header' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Menú superior</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Barra de navegación arriba</p>
                </div>
              </button>
              <button
                onClick={() => setLayoutMode('sidebar')}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 text-left transition-colors ${
                  layoutMode === 'sidebar'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <PanelLeft className={layoutMode === 'sidebar' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Menú lateral</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Barra de navegación a la izquierda</p>
                </div>
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Elige el tema visual de la aplicación.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 text-left transition-colors ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Sun className={theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Tema claro</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fondo claro, texto oscuro</p>
                </div>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 text-left transition-colors ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Moon className={theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Tema oscuro</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fondo oscuro, texto claro</p>
                </div>
              </button>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Estadísticas</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">Rol</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-300">
                  {perfil?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">ID de Usuario</p>
                <p className="text-lg font-bold text-green-900 dark:text-green-300">#{perfil?.id}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm text-purple-600 dark:text-purple-400">Estado</p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-300">Activo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
