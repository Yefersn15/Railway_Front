import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../../api/axiosConfig';
import { uploadImage, isCloudinaryConfigured } from '../../../utils/cloudinary';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TODAY_STRING = getTodayString();
const TODAY_DATE = new Date(`${TODAY_STRING}T00:00:00`);

const schema = yup.object({
  nombre: yup.string().required('Nombre requerido').min(3, 'Mínimo 3 caracteres'),
  descripcion: yup.string(),
  precio: yup.number()
    .typeError('Debe ser un número')
    .positive('Debe ser mayor a 0')
    .required('Precio requerido'),
  stock: yup.number()
    .typeError('Debe ser un número')
    .integer('Debe ser un número entero')
    .min(0, 'No puede ser negativo')
    .required('Stock requerido'),
  categoria_id: yup.number().typeError('Selecciona una categoría'),
  codigo_barras: yup.string(),
  imagen_url: yup.string().nullable(),
  fecha_vencimiento: yup.date()
    .transform((value, originalValue) => (originalValue ? value : undefined))
    .typeError('Fecha inválida')
    .min(TODAY_DATE, 'La fecha de vencimiento no puede ser anterior a hoy'),
});

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {}
  });

  const imagenUrl = watch('imagen_url');
  const cloudinaryReady = isCloudinaryConfigured();

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setValue('imagen_url', url, { shouldDirty: true });
      toast.success('Imagen subida correctamente');
    } catch (error) {
      toast.error(error.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <input type="hidden" {...register('imagen_url')} />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Imagen del producto
        </label>
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 shrink-0 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden relative">
            {imagenUrl ? (
              <>
                <img src={imagenUrl} alt="Vista previa" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setValue('imagen_url', '', { shouldDirty: true })}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"
                  title="Quitar imagen"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <ImagePlus className="text-gray-400 dark:text-gray-500" size={28} />
            )}
          </div>
          <div className="flex-1">
            <label
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border cursor-pointer transition ${
                cloudinaryReady
                  ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              {uploading ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <ImagePlus className="mr-2" size={16} />
              )}
              {uploading ? 'Subiendo...' : 'Elegir imagen'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={!cloudinaryReady || uploading}
                onChange={handleImageChange}
              />
            </label>
            {!cloudinaryReady && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Configura VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET para habilitar la subida de imágenes.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre *
          </label>
          <input
            {...register('nombre')}
            type="text"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.nombre && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Código de Barras
          </label>
          <input
            {...register('codigo_barras')}
            type="text"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.codigo_barras && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.codigo_barras.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Precio *
          </label>
          <input
            {...register('precio')}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.precio && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.precio.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stock *
          </label>
          <input
            {...register('stock')}
            type="number"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.stock && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoría
          </label>
          <select
            {...register('categoria_id')}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sin categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors.categoria_id && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.categoria_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de Vencimiento
          </label>
          <input
            {...register('fecha_vencimiento')}
            type="date"
            min={TODAY_STRING}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.fecha_vencimiento && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.fecha_vencimiento.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción
        </label>
        <textarea
          {...register('descripcion')}
          rows="3"
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.descripcion && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;