import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Divider, 
  Alert, 
  CircularProgress,
  Paper,
  Grid 
} from '@mui/material';
import { PersonAdd, Fingerprint, CheckCircleOutline } from '@mui/icons-material';

const RegistroCliente = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });
  const [codigoGenerado, setCodigoGenerado] = useState('');

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const manejarRegistro = () => {
    setLoading(true);
    setTimeout(() => {
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      const numPart = Math.floor(100 + Math.random() * 900);
      const nuevoCodigo = `SPA-${randomPart}${numPart}`;
      
      setCodigoGenerado(nuevoCodigo);
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const reiniciarYSalir = () => {
    setStep(1);
    setCliente({ nombre: '', telefono: '', email: '' });
    setCodigoGenerado('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={step === 1 ? onClose : null} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ 
        bgcolor: step === 1 ? '#f3e5f5' : '#e8f5e9', 
        fontWeight: 'bold', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1 
      }}>
        {step === 1 ? <PersonAdd color="primary" /> : <CheckCircleOutline color="success" />}
        {step === 1 ? 'Nuevo Registro' : '¡Registro Exitoso!'}
      </DialogTitle>
      
      <DialogContent dividers>
        {step === 1 ? (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Completa los datos del cliente para generar su acceso.
              </Typography>
            </Grid>
            <Grid size={12}>
              <TextField 
                fullWidth 
                label="Nombre Completo" 
                name="nombre"
                value={cliente.nombre}
                onChange={handleChange}
                variant="outlined" 
                required 
              />
            </Grid>
            <Grid size={12}>
              <TextField 
                fullWidth 
                label="Teléfono" 
                name="telefono"
                value={cliente.telefono}
                onChange={handleChange}
                variant="outlined" 
              />
            </Grid>
            <Grid size={12}>
              <TextField 
                fullWidth 
                label="Correo Electrónico" 
                name="email"
                value={cliente.email}
                onChange={handleChange}
                variant="outlined" 
              />
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Código de Identificación
            </Typography>
            <Paper elevation={0} sx={{ 
              p: 3, 
              bgcolor: '#f1f8e9', 
              border: '2px dashed #4caf50',
              borderRadius: 3,
              mb: 2
            }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 'bold', 
                letterSpacing: 4, 
                color: '#2e7d32',
                fontFamily: 'monospace' 
              }}>
                {codigoGenerado}
              </Typography>
            </Paper>
            <Typography variant="body2" color="textSecondary">
              Entrega este código al cliente en su tarjeta física.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {step === 1 ? (
          <>
            <Button onClick={onClose} color="inherit">Cancelar</Button>
            <Button 
              onClick={manejarRegistro} 
              variant="contained" 
              disabled={!cliente.nombre || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Fingerprint />}
              sx={{ bgcolor: '#7b1fa2' }}
            >
              {loading ? 'Guardando...' : 'Registrar'}
            </Button>
          </>
        ) : (
          <Button 
            fullWidth 
            onClick={reiniciarYSalir} 
            variant="contained" 
            color="success"
            sx={{ py: 1.5, fontWeight: 'bold' }}
          >
            Finalizar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RegistroCliente;