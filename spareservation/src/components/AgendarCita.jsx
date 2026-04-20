import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Stepper, Step, 
  StepLabel, Box, Typography, Grid, Card, CardActionArea, CardContent, 
  Avatar, Chip, Paper, CircularProgress
} from '@mui/material';
import { 
  Person, AccessTime, CalendarMonth, 
  CheckCircle, ArrowForwardIos 
} from '@mui/icons-material';
import api from '../services/api'; // Asegúrate de tener tu instancia de axios

const steps = ['Horario', 'Especialista', 'Servicio'];

const AgendarCita = ({ open, onClose, clienteSeleccionado, onCitaAgendada }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Listas que vendrán del Back
  const [masajistas, setMasajistas] = useState([]);
  const [servicios, setServicios] = useState([]);

  const [cita, setCita] = useState({ 
    fecha: '', 
    hora: '', 
    masajistaId: '', 
    servicioId: '' 
  });

  const horasDisponibles = ['09:00', '10:30', '12:00', '14:00', '16:30', '18:00'];

  // Cargar datos al abrir el modal
  useEffect(() => {
    if (open) {
      const cargarCatalogos = async () => {
        try {
         const [resMasajistas, resServicios] = await Promise.all([
            api.get('/auth/especialistas'), 
            api.get('/servicios')  
          ]);
          setMasajistas(resMasajistas.data);
          setServicios(resServicios.data);
        } catch (error) {
          console.error("Error cargando especialistas o servicios", error);
        }
      };
      cargarCatalogos();
      // Resetear el formulario al abrir
      setActiveStep(0);
      setCita({ fecha: '', hora: '', masajistaId: '', servicioId: '' });
    }
  }, [open]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      const dataAEnviar = {
        clienteId: clienteSeleccionado.id,
        masajistaId: cita.masajistaId,
        servicioId: cita.servicioId,
        fecha: cita.fecha,
        hora: cita.hora,
        status: 'pendiente'
      };

      await api.post('/citas', dataAEnviar);
      
      if (onCitaAgendada) onCitaAgendada(); // Para refrescar el dashboard
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Error al agendar cita");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: 
        return (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#54350D', fontWeight: 'bold' }}>
              <CalendarMonth sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
              Selecciona Fecha y Hora
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  style={{ 
                    width: '100%', padding: '12px', borderRadius: '12px', 
                    border: '1px solid #936025', outline: 'none',
                    fontSize: '1rem', fontFamily: 'inherit', backgroundColor: '#fff'
                  }}
                  onChange={(e) => setCita({...cita, fecha: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: '#936025', fontWeight: 'bold', mb: 1, display: 'block' }}>
                  HORARIOS DISPONIBLES
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {horasDisponibles.map((h) => (
                    <Chip 
                      key={h} 
                      label={h} 
                      clickable 
                      onClick={() => setCita({...cita, hora: h})}
                      sx={{ 
                        borderRadius: 2, p: 1,
                        bgcolor: cita.hora === h ? '#936025' : '#fff',
                        color: cita.hora === h ? '#fff' : '#936025',
                        border: '1px solid #936025',
                        '&:hover': { bgcolor: cita.hora === h ? '#54350D' : '#FBF6CF' }
                      }} 
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {masajistas.map((m) => (
              <Grid item xs={12} key={m.id}>
                <Card variant="outlined" sx={{ 
                  borderRadius: 3, transition: '0.3s',
                  border: cita.masajistaId === m.id ? '2px solid #936025' : '1px solid rgba(147, 96, 37, 0.2)',
                  boxShadow: cita.masajistaId === m.id ? '0 4px 12px rgba(147, 96, 37, 0.2)' : 'none'
                }}>
                  <CardActionArea onClick={() => setCita({...cita, masajistaId: m.id})}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#BE7333' }}>
                        <Person />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#54350D' }}>{m.nombre}</Typography>
                        <Typography variant="caption" color="text.secondary">Especialista</Typography>
                      </Box>
                      {cita.masajistaId === m.id && <CheckCircle color="success" />}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {servicios.map((s) => (
              <Grid item xs={12} sm={6} key={s.id}>
                <Card variant="outlined" sx={{ 
                  borderRadius: 3, height: '100%',
                  border: cita.servicioId === s.id ? '2px solid #936025' : '1px solid rgba(147, 96, 37, 0.2)',
                  bgcolor: cita.servicioId === s.id ? '#fff' : 'transparent'
                }}>
                  <CardActionArea onClick={() => setCita({...cita, servicioId: s.id})} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#54350D' }}>{s.nombre}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="primary" fontWeight="bold">${s.precio}</Typography>
                      <Chip icon={<AccessTime sx={{ fontSize: '14px !important' }} />} label={`${s.duracion} min`} size="small" variant="outlined" />
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      default: return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5, bgcolor: '#FBF6CF', backgroundImage: 'none' } }}>
      <Box sx={{ p: 3, bgcolor: '#54350D', color: '#FBF6CF', textAlign: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Agendar Nueva Cita</Typography>
        <Paper elevation={0} sx={{ mt: 2, p: 1, bgcolor: 'rgba(251, 246, 207, 0.1)', borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 1, border: '1px solid rgba(251, 246, 207, 0.2)' }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#BE7333' }}>
            {clienteSeleccionado?.nombreCompleto?.[0] || 'C'}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {clienteSeleccionado?.nombreCompleto || 'Cliente'} ({clienteSeleccionado?.codigoUnico || 'SPA-000'})
          </Typography>
        </Paper>
      </Box>

      <DialogContent sx={{ mt: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ '& .MuiStepIcon-root.Mui-active': { color: '#936025' }, '& .MuiStepIcon-root.Mui-completed': { color: '#BE7333' } }}>
          {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
        </Stepper>
        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={loading} sx={{ color: '#54350D', fontWeight: 'bold' }}>Cancelar</Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} disabled={loading} variant="outlined" sx={{ borderColor: '#936025', color: '#936025' }}>
              Atrás
            </Button>
          )}
          <Button 
            variant="contained" 
            disabled={loading || (activeStep === 0 && (!cita.fecha || !cita.hora)) || (activeStep === 1 && !cita.masajistaId) || (activeStep === 2 && !cita.servicioId)}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForwardIos sx={{ fontSize: 14 }} />}
            onClick={activeStep === steps.length - 1 ? handleConfirmar : handleNext}
            sx={{ bgcolor: '#936025', px: 4, borderRadius: 2, '&:hover': { bgcolor: '#54350D' } }}
          >
            {activeStep === steps.length - 1 ? 'Confirmar Cita' : 'Siguiente'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AgendarCita;