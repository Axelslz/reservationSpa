import api from './api';

export const getAgendaHoy = async (fecha) => {
  try {
    const response = await api.get(`/citas/dashboard${fecha ? `?fecha=${fecha}` : ''}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al cargar agenda' };
  }
};

export const getTodasLasCitas = async () => {
  try {
    const response = await api.get('/citas/dashboard'); 
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al cargar todas las citas' };
  }
};

export const cambiarEstadoCita = async (citaId, nuevoEstado) => {
  try {
    const response = await api.patch(`/citas/estado/${citaId}`, { status: nuevoEstado });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al cambiar el estado' };
  }
};

export const actualizarDetallesCita = async (citaId, citaData) => {
  try {
    const response = await api.put(`/citas/${citaId}`, citaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar la cita' };
  }
};

export const getServicios = async () => {
  try {
    const response = await api.get('/servicios');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al cargar los servicios' };
  }
};

export const getEspecialistas = async () => {
  try {
    const response = await api.get('/auth/especialistas');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al cargar los especialistas' };
  }
};