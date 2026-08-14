import { useState, useEffect, useCallback } from 'react';
import api from '../../../api/axiosConfig';
import toast from 'react-hot-toast';

export const useDomicilios = (scope = 'mis') => {
  const [domicilios, setDomicilios] = useState([]);
  const [loading, setLoading] = useState(false);

  const endpoint =
    scope === 'todos' ? '/domicilios'
    : scope === 'entregas' ? '/domicilios/mis-entregas'
    : '/domicilios/mis-domicilios';

  const fetchDomicilios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setDomicilios(response.data);
    } catch (error) {
      toast.error('Error al cargar domicilios');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const cambiarEstado = async (id, estado) => {
    try {
      await api.patch(`/domicilios/${id}/estado`, { estado });
      toast.success('Estado actualizado');
      await fetchDomicilios();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar el estado');
      throw error;
    }
  };

  const asignarRepartidor = async (id, repartidor_id) => {
    try {
      await api.patch(`/domicilios/${id}/asignar`, { repartidor_id });
      toast.success('Domiciliario asignado');
      await fetchDomicilios();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al asignar domiciliario');
      throw error;
    }
  };

  useEffect(() => {
    fetchDomicilios();
  }, [fetchDomicilios]);

  return { domicilios, loading, fetchDomicilios, cambiarEstado, asignarRepartidor };
};
