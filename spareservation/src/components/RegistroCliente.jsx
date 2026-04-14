import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, Box, Typography, CircularProgress, Paper, Grid,
  InputAdornment, Fade, Zoom, IconButton
} from '@mui/material';
import { 
  PersonAdd, Fingerprint, CheckCircleOutline, Close, 
  Badge, LocalPhone, MailOutline, ContentCopy 
} from '@mui/icons-material';

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
    }, 2000);
  };

  const reiniciarYSalir = () => {
    setStep(1);
    setCliente({ nombre: '', telefono: '', email: '' });
    setCodigoGenerado('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={step === 1 ? onClose : null} 
      maxWidth="xs" 
      fullWidth 
      TransitionComponent={Fade}
      PaperProps={{ 
        sx: { 
          borderRadius: 5, 
          bgcolor: '#FFF', 
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(84, 53, 13, 0.2)'
        } 
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: step === 1 ? '#54350D' : '#553813', 
        color: '#FBF6CF',
        p: 3,
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {step === 1 ? <PersonAdd /> : <CheckCircleOutline />}
          <Typography variant="h6" fontWeight="800">
            {step === 1 ? 'Membresía Nueva' : '¡Bienvenido a la Familia!'}
          </Typography>
        </Box>
        {step === 1 && (
          <IconButton onClick={onClose} sx={{ color: '#FBF6CF' }}>
            <Close fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, mt: 2 }}>
        {step === 1 ? (
          <Box component="form">
            <Typography variant="body2" sx={{ mb: 3, color: '#936025', fontStyle: 'italic' }}>
              Completa los datos para generar el código único de acceso del cliente.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth label="Nombre Completo" name="nombre"
                  placeholder="Ej. Ana García López"
                  value={cliente.nombre} onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Badge sx={{ color: '#936025' }} /></InputAdornment>,
                  }}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth label="Teléfono" name="telefono"
                  placeholder="961 000 0000"
                  value={cliente.telefono} onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LocalPhone sx={{ color: '#936025' }} /></InputAdornment>,
                  }}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth label="Correo Electrónico" name="email"
                  placeholder="cliente@ejemplo.com"
                  value={cliente.email} onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><MailOutline sx={{ color: '#936025' }} /></InputAdornment>,
                  }}
                  sx={inputStyle}
                />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Zoom in={step === 2}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body1" sx={{ color: '#54350D', mb: 1 }}>
                Registro completado para <strong>{cliente.nombre}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Este código es único e intransferible
              </Typography>
              
              <Paper elevation={0} sx={{ 
                p: 4, mt: 3, bgcolor: '#FBF6CF44', 
                border: '2px dashed #936025', 
                borderRadius: 4,
                position: 'relative'
              }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: '900', 
                  letterSpacing: 6, 
                  color: '#936025', 
                  fontFamily: 'monospace',
                  textShadow: '1px 1px 0px #fff'
                }}>
                  {codigoGenerado}
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ position: 'absolute', top: 8, right: 8, color: '#936025' }}
                  onClick={() => navigator.clipboard.writeText(codigoGenerado)}
                >
                  <ContentCopy fontSize="inherit" />
                </IconButton>
              </Paper>
            </Box>
          </Zoom>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 0 }}>
        {step === 1 ? (
          <Button 
            fullWidth
            onClick={manejarRegistro} 
            variant="contained" 
            disabled={!cliente.nombre || loading}
            sx={{ 
              bgcolor: '#936025', 
              py: 1.8,
              borderRadius: 3,
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 8px 20px rgba(147, 96, 37, 0.3)',
              '&:hover': { bgcolor: '#54350D' },
              textTransform: 'none'
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={24} color="inherit" />
                <Typography>Generando Código...</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Fingerprint /> Generar Alta de Cliente
              </Box>
            )}
          </Button>
        ) : (
          <Button 
            fullWidth 
            onClick={reiniciarYSalir} 
            variant="contained" 
            color="success" 
            sx={{ 
              py: 2, 
              borderRadius: 3, 
              fontWeight: '900',
              boxShadow: '0 8px 20px rgba(151, 92, 16, 0.67)'
            }}
          >
            LISTO, VOLVER AL DASHBOARD
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const inputStyle = {
  '& .MuiOutlinedInput-root': { 
    borderRadius: 3, 
    bgcolor: '#FBF6CF22',
    transition: '0.3s',
    '&:hover': { bgcolor: '#FBF6CF44' },
    '&.Mui-focused': { bgcolor: '#fff' }
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#936025' },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#936025',
    borderWidth: '2px'
  }
};

export default RegistroCliente;