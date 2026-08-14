import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Pill,
  Tag,
  Truck,
  Store,
  ShoppingBag,
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
  { path: '/carrito', icon: ShoppingBag, label: 'Carrito' },
  { path: '/mis-domicilios', icon: Truck, label: 'Mis Domicilios' },
];

export const getNavItems = (usuario) =>
  usuario?.rol === 'admin' ? ADMIN_NAV_ITEMS : USUARIO_NAV_ITEMS;
