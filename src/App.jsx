import React from 'react';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { LayoutProvider, useLayout } from './features/shared/context/LayoutContext';
import { ThemeProvider } from './features/shared/context/ThemeContext';
import { CartProvider } from './features/tienda/context/CartContext';
import Navbar from './features/shared/components/Navbar';
import Sidebar from './features/shared/components/Sidebar';
import PublicHeader from './features/shared/components/PublicHeader';
import AppRoutes from './routes/AppRoutes';

const AppShell = () => {
  const { layoutMode, sidebarCollapsed } = useLayout();
  const { usuario } = useAuth();

  if (!usuario || usuario.rol !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PublicHeader />
        <main className="container mx-auto px-4 py-8">
          <AppRoutes />
        </main>
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
          <CartProvider>
            <AppShell />
          </CartProvider>
        </LayoutProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
