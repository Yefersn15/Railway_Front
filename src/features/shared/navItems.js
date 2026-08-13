import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Pill,
  Tag,
} from 'lucide-react';

export const getNavItems = (usuario) => [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/productos', icon: Pill, label: 'Productos' },
  { path: '/categorias', icon: Tag, label: 'Categorías' },
  { path: '/ventas', icon: ShoppingCart, label: 'Ventas' },
  ...(usuario?.rol === 'admin' ? [{ path: '/usuarios', icon: Users, label: 'Usuarios' }] : []),
];
