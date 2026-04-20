import api from './api';

export const registrarNuevoCliente = async (clienteData) => {
  try {
    // clienteData debe traer: nombreCompleto, telefono, email
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