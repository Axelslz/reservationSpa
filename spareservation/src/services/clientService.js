import api from './api';

export const registrarNuevoCliente = async (clienteData) => {
  try {
    const response = await api.post('/clientes/registro', clienteData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al conectar con el servidor' };
  }
};

export const getTodosLosClientes = async () => {
  const response = await api.get('/clientes/todos');
  return response.data;
};

export const actualizarCliente = async (id, clienteData) => {
  try {
    const response = await api.put(`/clientes/${id}`, clienteData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar el cliente' };
  }
};

export const eliminarCliente = async (id) => {
  try {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar el cliente' };
  }
};