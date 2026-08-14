import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Pill,
  Tag,
  Truck,
  Store,
  ClipboardList,
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/productos', icon: Pill, label: 'Productos' },
  { path: '/categorias', icon: Tag, label: 'Categorías' },
  { path: '/ventas', icon: ShoppingCart, label: 'Ventas' },
  { path: '/domicilios', icon: Truck, label: 'Domicilios' },
  { path: '/usuarios', icon: Users, label: 'Usuarios' },
];

const USUARIO_NAV_ITEMS = [
  { path: '/tienda', icon: Store, label: 'Tienda' },
  { path: '/mis-pedidos', icon: ClipboardList, label: 'Mis Pedidos' },
  { path: '/mis-domicilios', icon: Truck, label: 'Mis Domicilios' },
];

const DOMICILIARIO_NAV_ITEMS = [
  { path: '/mis-entregas', icon: Truck, label: 'Mis Entregas' },
];

export const getNavItems = (usuario) => {
  if (usuario?.rol === 'admin') return ADMIN_NAV_ITEMS;
  if (usuario?.rol === 'domiciliario') return DOMICILIARIO_NAV_ITEMS;
  return USUARIO_NAV_ITEMS;
};
