import api from './api';

export const getAgendaHoy = async (fecha) => {
  try {
    const response = await api.get(`/citas/dashboard${fecha ? `?fecha=${fecha}` : ''}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al cargar agenda' };
  }
};

export const cambiarEstadoCita = async (citaId, nuevoEstado) => {
  const response = await api.patch(`/citas/estado/${citaId}`, { status: nuevoEstado });
  return response.data;
};