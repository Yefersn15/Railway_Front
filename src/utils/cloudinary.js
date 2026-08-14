const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MAX_SIZE_MB = 5;

export const isCloudinaryConfigured = () => Boolean(CLOUD_NAME && UPLOAD_PRESET);

// Sube la imagen directo desde el navegador a Cloudinary (nunca pasa por nuestro
// backend), usando un upload preset "unsigned". Devuelve la URL segura (https)
// que se guarda en el producto.
export const uploadImage = async (file) => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary no está configurado. Define VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`La imagen no puede pesar más de ${MAX_SIZE_MB}MB`);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error?.message || 'Error al subir la imagen a Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
};

// Inserta transformaciones de Cloudinary en la URL (redimensionar, recortar,
// comprimir con calidad automática y servir el formato más liviano soportado
// por el navegador) para no cargar la imagen original de alta resolución en
// cada tarjeta/miniatura. No consume cuota extra: Cloudinary genera y cachea
// esa variante la primera vez que se pide.
export const getOptimizedUrl = (url, { width = 400, height = 400 } = {}) => {
  if (!url || !url.includes('/upload/')) return url;
  const transform = `w_${width},h_${height},c_fill,q_auto,f_auto`;
  return url.replace('/upload/', `/upload/${transform}/`);
};
