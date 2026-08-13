import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { useLayout } from '../context/LayoutContext';
import { useTheme } from '../context/ThemeContext';
import { getNavItems } from '../navItems';
import {
  Package,
  LogOut,
  User,
  Menu,
  X,
  PanelTop,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
} from 'lucide-react';

const Sidebar = () => {
  const { usuario, logout } = useAuth();
  const { setLayoutMode, sidebarCollapsed, toggleSidebarCollapsed } = useLayout();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!usuario) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = getNavItems(usuario);

  const linkClasses = (path, collapsed) =>
    `flex items-center rounded-md text-sm font-medium transition-colors ${
      collapsed ? 'justify-center px-2 py-2' : 'space-x-3 px-3 py-2'
    } ${
      location.pathname === path
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`;

  const renderSidebarContent = (collapsed) => (
    <>
      <div className={`flex items-center h-16 border-b dark:border-gray-700 ${collapsed ? 'justify-center px-2' : 'space-x-2 px-3'}`}>
        <Package className="h-8 w-8 text-blue-600 dark:text-blue-400 shrink-0" />
        {!collapsed && <span className="text-xl font-bold text-gray-800 dark:text-gray-100">FarmaciaApp</span>}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className={linkClasses(item.path, collapsed)}
            onClick={() => setMenuOpen(false)}
          >
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="px-2 py-4 border-t dark:border-gray-700 space-y-1">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          className={`flex items-center rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full ${
            collapsed ? 'justify-center px-2 py-2' : 'space-x-3 px-3 py-2'
          }`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && <span>{theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}</span>}
        </button>
        <button
          onClick={() => setLayoutMode('header')}
          title="Cambiar a menú superior"
          className={`flex items-center rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full ${
            collapsed ? 'justify-center px-2 py-2' : 'space-x-3 px-3 py-2'
          }`}
        >
          <PanelTop size={18} />
          {!collapsed && <span>Menú superior</span>}
        </button>
        <Link
          to="/perfil"
          title={collapsed ? usuario.nombre : undefined}
          className={linkClasses('/perfil', collapsed)}
          onClick={() => setMenuOpen(false)}
        >
          <User size={18} />
          {!collapsed && <span>{usuario.nombre}</span>}
        </Link>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Salir' : undefined}
          className={`flex items-center rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 w-full ${
            collapsed ? 'justify-center px-2 py-2' : 'space-x-3 px-3 py-2'
          }`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Salir</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-4 h-16">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">FarmaciaApp</span>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex flex-col">
          {renderSidebarContent(false)}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-gray-800 shadow-md transition-all duration-200 relative ${
          sidebarCollapsed ? 'md:w-16' : 'md:w-64'
        }`}
      >
        {renderSidebarContent(sidebarCollapsed)}
        <button
          onClick={toggleSidebarCollapsed}
          title={sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
          className="absolute top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 shadow-md z-10"
        >
          {sidebarCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
