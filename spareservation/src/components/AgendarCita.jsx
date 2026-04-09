import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Stepper, Step, 
  StepLabel, Box, Typography, Grid, TextField, MenuItem, Card, 
  CardActionArea, CardContent, Avatar, Chip 
} from '@mui/material';
import { Person, AccessTime, InfoOutlined } from '@mui/icons-material';

const steps = ['Datos Básicos', 'Masajista', 'Servicio'];

const AgendarCita = ({ open, onClose, clienteSeleccionado }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [cita, setCita] = useState({ clienteId: '', fecha: '', hora: '', masajistaId: '', servicioId: '' });


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
      case 0:
        return (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                select fullWidth label="Cliente" 
                defaultValue={clienteSeleccionado?.id || ""}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
              >
                <MenuItem value="1">Ana García (SPA-AXJ210)</MenuItem>
                <MenuItem value="2">Karla López (SPA-BKL993)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="date" label="Fecha" InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="time" label="Hora" InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }} />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {masajistas.map((m) => (
                <Grid item xs={12} key={m.id}>
                  <Card variant="outlined" sx={{ 
                    border: cita.masajistaId === m.id ? '2px solid #936025' : '1px solid #ddd',
                    bgcolor: cita.masajistaId === m.id ? '#fff' : 'transparent'
                  }}>
                    <CardActionArea onClick={() => setCita({...cita, masajistaId: m.id})} disabled={!m.disponible}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: m.disponible ? '#936025' : '#ccc' }}><Person /></Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{m.nombre}</Typography>
                          <Typography variant="caption">{m.especialidad}</Typography>
                        </Box>
                        <Chip label={m.disponible ? "Disponible" : "Ocupada"} size="small" color={m.disponible ? "success" : "default"} />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {servicios.map((s) => (
                <Grid item xs={6} key={s.id}>
                  <Card variant="outlined" onClick={() => setCita({...cita, servicioId: s.id})} sx={{ border: cita.servicioId === s.id ? '2px solid #936025' : '1px solid #ddd' }}>
                    <CardActionArea sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{s.nombre}</Typography>
                      <Typography variant="body2" color="primary">{s.precio} - {s.duracion}</Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      default: return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: '#FBF6CF' } }}>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#54350D', textAlign: 'center', pt: 3 }}>
        Agendar Nueva Cita
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: '#93602533' }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, mt: 2, '& .MuiStepIcon-root.Mui-active': { color: '#936025' }, '& .MuiStepIcon-root.Mui-completed': { color: '#BE7333' } }}>
          {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
        </Stepper>
        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Button onClick={onClose} sx={{ color: '#54350D' }}>Cancelar</Button>
        <Box>
          {activeStep !== 0 && <Button onClick={handleBack} sx={{ mr: 1, color: '#936025' }}>Atrás</Button>}
          <Button 
            variant="contained" 
            onClick={activeStep === steps.length - 1 ? onClose : handleNext}
            sx={{ bgcolor: '#936025', '&:hover': { bgcolor: '#54350D' } }}
          >
            {activeStep === steps.length - 1 ? 'Confirmar Cita' : 'Siguiente'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AgendarCita;