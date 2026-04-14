import React from 'react';
import { 
  Dialog, AppBar, Toolbar, IconButton, Typography, 
  Slide, Box, Paper, Chip 
} from '@mui/material';
import { Close, EventNote } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CalendarioCompleto = ({ open, onClose }) => {
  
  const eventosEjemplo = [
    { title: 'Facial - Ana García', start: '2026-04-05T10:30:00', color: '#936025' },
    { title: 'Masaje - Karla López', start: '2026-04-09T14:00:00', color: '#54350D' },
    { title: 'Corte - Roberto Solis', start: '2026-04-10T11:00:00', color: '#BE7333' },
  ];

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative', bgcolor: '#54350D' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" fontWeight="bold">
            Calendario Maestro de Citas
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="Pasadas" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
            <Chip label="Próximas" sx={{ bgcolor: '#FBF6CF', color: '#54350D', fontWeight: 'bold' }} />
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, bgcolor: '#FBF6CF', height: '100vh', overflowY: 'auto' }}>
        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            locale="es"
            events={eventosEjemplo}
            height="75vh"
            eventClick={(info) => alert('Cita: ' + info.event.title)}
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día'
            }}
          />
        </Paper>
      </Box>
    </Dialog>
  );
};

export default CalendarioCompleto;