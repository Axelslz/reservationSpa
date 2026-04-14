import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Stepper, Step, 
  StepLabel, Box, Typography, Grid, Card, CardActionArea, CardContent, 
  Avatar, Chip, Paper, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { 
  Person, AccessTime, CalendarMonth, 
  CheckCircle, ArrowForwardIos 
} from '@mui/icons-material';

const steps = ['Horario', 'Especialista', 'Servicio'];

const AgendarCita = ({ open, onClose, clienteSeleccionado }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [cita, setCita] = useState({ 
    fecha: '', 
    hora: '', 
    masajistaId: '', 
    servicioId: '' 
  });

  // Datos simulados (Idealmente vendrían de una API)
  const horasDisponibles = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '04:30 PM', '06:00 PM'];
  
  const masajistas = [
    { id: 1, nombre: 'Elena Ríos', especialidad: 'Masajes Suecos', disponible: true },
    { id: 2, nombre: 'Marina Soler', especialidad: 'Uñas & Arte', disponible: false },
    { id: 3, nombre: 'Sofia Luna', especialidad: 'Tejido Profundo', disponible: true },
  ];

  const servicios = [
    { id: 1, nombre: 'Masaje Relajante', precio: '$500', duracion: '60 min' },
    { id: 2, nombre: 'Uñas Acrílicas', precio: '$350', duracion: '90 min' },
  ];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // NUEVA INTERFAZ DE FECHA Y HORA
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
                  style={{ 
                    width: '100%', padding: '12px', borderRadius: '12px', 
                    border: '1px solid #936025', outline: 'none',
                    fontSize: '1rem', fontFamily: 'inherit'
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
                        borderRadius: 2, 
                        p: 1,
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
                  borderRadius: 3,
                  transition: '0.3s',
                  border: cita.masajistaId === m.id ? '2px solid #936025' : '1px solid rgba(147, 96, 37, 0.2)',
                  boxShadow: cita.masajistaId === m.id ? '0 4px 12px rgba(147, 96, 37, 0.2)' : 'none'
                }}>
                  <CardActionArea onClick={() => setCita({...cita, masajistaId: m.id})} disabled={!m.disponible}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: m.disponible ? '#BE7333' : '#ccc' }}>
                        <Person />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#54350D' }}>{m.nombre}</Typography>
                        <Typography variant="caption" color="text.secondary">{m.especialidad}</Typography>
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
                  borderRadius: 3,
                  border: cita.servicioId === s.id ? '2px solid #936025' : '1px solid rgba(147, 96, 37, 0.2)',
                  bgcolor: cita.servicioId === s.id ? '#fff' : 'transparent'
                }}>
                  <CardActionArea onClick={() => setCita({...cita, servicioId: s.id})} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#54350D' }}>{s.nombre}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="primary" fontWeight="bold">{s.precio}</Typography>
                      <Chip icon={<AccessTime sx={{ fontSize: '14px !important' }} />} label={s.duracion} size="small" variant="outlined" />
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
          <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#BE7333' }}>{clienteSeleccionado?.nombre?.[0] || 'C'}</Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {clienteSeleccionado?.nombre || 'Cliente General'} ({clienteSeleccionado?.codigo || 'SPA-000'})
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
        <Button onClick={onClose} sx={{ color: '#54350D', fontWeight: 'bold' }}>Cancelar</Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} variant="outlined" sx={{ borderColor: '#936025', color: '#936025' }}>
              Atrás
            </Button>
          )}
          <Button 
            variant="contained" 
            endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForwardIos sx={{ fontSize: 14 }} />}
            onClick={activeStep === steps.length - 1 ? onClose : handleNext}
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