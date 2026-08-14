import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductos } from '../../productos/hooks/useProductos';
import { useCategorias } from '../../categorias/hooks/useCategorias';
import { useCart } from '../context/CartContext';
import { getOptimizedUrl } from '../../../utils/cloudinary';
import { Search, Package, X, ShoppingCart, Tag } from 'lucide-react';

const Tienda = () => {
  const { categoriaId } = useParams();
  const { productos, loading } = useProductos();
  const { categorias } = useCategorias();
  const { addToCart } = useCart();

  const [search, setSearch] = useState('');
  const [filterCategoria, setFilterCategoria] = useState(categoriaId || '');
  const [sortBy, setSortBy] = useState('');
  const [selected, setSelected] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    setFilterCategoria(categoriaId || '');
  }, [categoriaId]);

  const categoriaActual = categoriaId
    ? categorias.find((c) => String(c.id) === String(categoriaId))
    : null;

  const productosFiltrados = useMemo(() => {
    let lista = productos.filter((p) => p.stock > 0);

    if (filterCategoria) {
      lista = lista.filter((p) => String(p.categoria_id) === String(filterCategoria));
    }

    if (search) {
      const q = search.toLowerCase();
      lista = lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q)
      );
    }

    if (sortBy) {
      lista = [...lista].sort((a, b) => {
        switch (sortBy) {
          case 'nombre': return a.nombre.localeCompare(b.nombre);
          case '-nombre': return b.nombre.localeCompare(a.nombre);
          case 'precio': return a.precio - b.precio;
          case '-precio': return b.precio - a.precio;
          default: return 0;
        }
      });
    }

    return lista;
  }, [productos, filterCategoria, search, sortBy]);

  const openModal = (producto) => {
    setSelected(producto);
    setCantidad(1);
  };

  const closeModal = () => {
    setSelected(null);
    setCantidad(1);
  };

  const categoriaNombre = (id) => categorias.find((c) => String(c.id) === String(id))?.nombre || '—';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {categoriaActual ? categoriaActual.nombre : 'Tienda'}
        </h1>
        {categoriaActual?.descripcion ? (
          <p className="text-gray-600 dark:text-gray-400 mt-1">{categoriaActual.descripcion}</p>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 mt-1">Explora nuestro catálogo de productos</p>
        )}
        {categoriaId && (
          <Link to="/tienda" className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            ← Ver todos los productos
          </Link>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
          disabled={Boolean(categoriaId)}
          className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Ordenar...</option>
          <option value="nombre">Nombre (A-Z)</option>
          <option value="-nombre">Nombre (Z-A)</option>
          <option value="precio">Precio (menor a mayor)</option>
          <option value="-precio">Precio (mayor a menor)</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <Package className="mx-auto mb-3" size={40} />
          <p>No hay productos disponibles con esos filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              onClick={() => openModal(producto)}
              title={producto.nombre}
              className="product-card cursor-pointer relative aspect-square flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition"
            >
              {producto.imagen_url ? (
                <img
                  src={getOptimizedUrl(producto.imagen_url, { width: 300, height: 300 })}
                  alt={producto.nombre}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="text-gray-400 dark:text-gray-500" size={48} />
              )}
              {producto.stock < 10 && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                  {producto.stock} u.
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selected.nombre}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                {selected.imagen_url ? (
                  <img
                    src={getOptimizedUrl(selected.imagen_url, { width: 600, height: 400 })}
                    alt={selected.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="text-gray-400 dark:text-gray-500" size={64} />
                )}
              </div>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <Tag size={14} className="mr-1" />
                {categoriaNombre(selected.categoria_id)}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {selected.descripcion || 'Sin descripción disponible.'}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${Number(selected.precio).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{selected.stock} unidades disponibles</span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={selected.stock}
                  value={cantidad}
                  onChange={(e) => {
                    const v = parseInt(e.target.value || '1', 10);
                    setCantidad(Math.max(1, Math.min(selected.stock, isNaN(v) ? 1 : v)));
                  }}
                  className="w-20 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    addToCart(selected, cantidad);
                    closeModal();
                  }}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tienda;