import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, Box, Typography, CircularProgress, Paper, Grid 
} from '@mui/material';
import { PersonAdd, Fingerprint, CheckCircleOutline } from '@mui/icons-material';

const RegistroCliente = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState({ nombre: '', telefono: '', email: '' });
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
    <Dialog open={open} onClose={step === 1 ? onClose : null} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: '#FBF6CF' } }}>
      <DialogTitle sx={{ 
        bgcolor: step === 1 ? '#FBF6CF' : '#e8f5e9', 
        color: '#54350D',
        fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 
      }}>
        {step === 1 ? <PersonAdd sx={{ color: '#936025' }} /> : <CheckCircleOutline color="success" />}
        {step === 1 ? 'Nuevo Registro de Cliente' : '¡Registro Exitoso!'}
      </DialogTitle>
      
      <DialogContent dividers sx={{ borderColor: '#93602533' }}>
        {step === 1 ? (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Nombre Completo" name="nombre"
                value={cliente.nombre} onChange={handleChange}
                variant="outlined" required 
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Teléfono" name="telefono"
                value={cliente.telefono} onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Correo Electrónico" name="email"
                value={cliente.email} onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
              />
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#54350D', mb: 2 }}>Código Generado</Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#fff', border: '2px dashed #936025', borderRadius: 3, mb: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', letterSpacing: 4, color: '#936025', fontFamily: 'monospace' }}>
                {codigoGenerado}
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {step === 1 ? (
          <>
            <Button onClick={onClose} sx={{ color: '#54350D' }}>Cancelar</Button>
            <Button 
              onClick={manejarRegistro} variant="contained" 
              disabled={!cliente.nombre || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Fingerprint />}
              sx={{ bgcolor: '#936025', '&:hover': { bgcolor: '#54350D' } }}
            >
              Registrar Cliente
            </Button>
          </>
        ) : (
          <Button fullWidth onClick={reiniciarYSalir} variant="contained" color="success" sx={{ py: 1.5, fontWeight: 'bold' }}>
            Finalizar y Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RegistroCliente;