import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogActions, Button, 
  TextField, Box, Typography, CircularProgress, Paper,
  InputAdornment, Fade, Zoom, IconButton, useMediaQuery, useTheme
} from '@mui/material';
import { 
  CheckCircleOutline, Close, PersonAddAlt1, 
  LocalPhone, MailOutline, ContentCopy, PersonOutline 
} from '@mui/icons-material';
import { registrarNuevoCliente } from '../services/clientService';

const RegistroCliente = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cliente, setCliente] = useState({ nombre: '', telefono: '', email: '' });
  const [codigoGenerado, setCodigoGenerado] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const colors = {
    olive: '#5B6346',
    gold: '#C5A059',
    cream: '#FDF7E7',
    white: '#FFFFFF'
  };

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const manejarRegistro = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await registrarNuevoCliente({
        nombreCompleto: cliente.nombre, 
        telefono: cliente.telefono,
        email: cliente.email
      });
      setCodigoGenerado(data.codigoUnico);
      setStep(2);
    } catch (err) {
      setError(err.error || err.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
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
      fullScreen={isMobile} 
      TransitionComponent={Fade}
      PaperProps={{ 
        sx: { 
          borderRadius: isMobile ? 0 : '15px', 
          bgcolor: colors.cream, 
          overflow: 'hidden',
          border: isMobile ? 'none' : `1px solid ${colors.gold}`,
          maxHeight: isMobile ? '100%' : '90vh'
        } 
      }}
    >
      <Box sx={{ 
        bgcolor: colors.olive, 
        p: isMobile ? 3 : 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {step === 1 ? (
            <PersonAddAlt1 sx={{ color: colors.gold, fontSize: isMobile ? 24 : 30 }} />
          ) : (
            <CheckCircleOutline sx={{ color: colors.gold, fontSize: isMobile ? 24 : 30 }} />
          )}
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ color: colors.white, fontFamily: 'serif', fontWeight: '500', letterSpacing: 1 }}>
            {step === 1 ? 'MEMBRESÍA NUEVA' : 'CLIENTE REGISTRADO'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: colors.white, position: 'absolute', right: 8 }}>
          <Close fontSize="small" />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ 
        p: isMobile ? 3 : 4, 
        overflowY: 'auto', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {step === 1 ? (
          <Box component="form" sx={{ width: '100%' }}>
            <Typography variant="body2" sx={{ mb: 2, color: colors.olive, textAlign: 'center', fontWeight: '500' }}>
              Completa los datos para generar el código único de acceso
            </Typography>

            <Typography variant="h6" sx={{ mb: 3, color: colors.olive, textAlign: 'center', fontFamily: 'serif' }}>
              Ingrese datos del cliente
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 3 }}>
              <TextField 
                fullWidth name="nombre"
                placeholder="ej. Ana García López"
                value={cliente.nombre} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonOutline sx={{ color: colors.gold }} /></InputAdornment>,
                }}
                sx={inputStyle(colors)}
              />
              <TextField 
                fullWidth name="telefono"
                placeholder="Teléfono (10 dígitos)"
                value={cliente.telefono} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LocalPhone sx={{ color: colors.gold }} /></InputAdornment>,
                }}
                sx={inputStyle(colors)}
              />
              <TextField 
                fullWidth name="email"
                placeholder="cliente@gmail.com"
                value={cliente.email} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><MailOutline sx={{ color: colors.gold }} /></InputAdornment>,
                }}
                sx={inputStyle(colors)}
              />
            </Box>

            {error && (
              <Typography color="error" variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', fontWeight: 'bold' }}>
                {error}
              </Typography>
            )}
          </Box>
        ) : (
          <Zoom in={step === 2}>
            <Box sx={{ textAlign: 'center', py: 2, width: '100%' }}>
              <Typography variant="body1" sx={{ color: colors.olive, mb: 1 }}>
                Registro completado para: <br/><strong>{cliente.nombre}</strong>
              </Typography>
              
              <Paper elevation={0} sx={{ 
                p: 3, mt: 2, bgcolor: 'rgba(197, 160, 89, 0.1)', 
                border: `2px dashed ${colors.gold}`, 
                borderRadius: '12px',
                position: 'relative'
              }}>
                <Typography variant="caption" sx={{ color: colors.olive, fontWeight: 'bold', display: 'block', mb: 1 }}>
                  CÓDIGO DE ACCESO
                </Typography>
                <Typography variant={isMobile ? "h4" : "h3"} sx={{ 
                  fontWeight: '900', 
                  letterSpacing: 4, 
                  color: colors.olive, 
                  fontFamily: 'monospace'
                }}>
                  {codigoGenerado}
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ position: 'absolute', top: 5, right: 5, color: colors.gold }}
                  onClick={() => navigator.clipboard.writeText(codigoGenerado)}
                >
                  <ContentCopy fontSize="inherit" />
                </IconButton>
              </Paper>
            </Box>
          </Zoom>
        )}
      </DialogContent>

      <DialogActions sx={{ p: isMobile ? 3 : 4, pt: 0, justifyContent: 'center', flexShrink: 0 }}>
        {step === 1 ? (
          <Button 
            onClick={manejarRegistro} 
            variant="contained" 
            disabled={!cliente.nombre || loading}
            sx={{ 
              bgcolor: colors.olive, 
              color: colors.white,
              py: 1.5,
              px: 6,
              borderRadius: '30px',
              fontWeight: 'bold',
              fontSize: isMobile ? '1rem' : '1.1rem',
              border: `2px solid ${colors.gold}`,
              '&:hover': { bgcolor: '#4a5139', border: `2px solid ${colors.white}` },
              textTransform: 'none',
              width: isMobile ? '100%' : 'auto',
              minWidth: '200px'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar Cliente'}
          </Button>
        ) : (
          <Button 
            fullWidth 
            onClick={reiniciarYSalir} 
            variant="contained" 
            sx={{ 
              bgcolor: colors.olive, 
              color: colors.white,
              py: 1.8, 
              borderRadius: '15px', 
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#4a5139' }
            }}
          >
            VOLVER AL DASHBOARD
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const inputStyle = (colors) => ({
  '& .MuiOutlinedInput-root': { 
    borderRadius: '40px', 
    bgcolor: colors.white,
    transition: '0.3s',
    '& fieldset': { borderColor: colors.gold },
    '&:hover fieldset': { borderColor: colors.olive },
    '&.Mui-focused fieldset': { borderColor: colors.olive, borderWidth: '2px' },
  },
  '& .MuiInputBase-input': {
    color: colors.olive,
    textAlign: 'center',
    fontSize: '0.95rem',
    '&::placeholder': { color: '#aaa', opacity: 1 }
  }
});

export default RegistroCliente;