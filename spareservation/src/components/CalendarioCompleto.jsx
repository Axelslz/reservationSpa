import React, { useState, useEffect } from 'react';
import { 
  Dialog, AppBar, Toolbar, IconButton, Typography, 
  Slide, Box, Paper, Button, useMediaQuery, useTheme 
} from '@mui/material';
import { Close } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { getTodasLasCitas } from '../services/appointmentService';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CalendarioCompleto = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [events, setEvents] = useState([]);
  const [shouldRenderCalendar, setShouldRenderCalendar] = useState(false);

  const colors = {
    olive: '#5B6346',
    gold: '#C5A059',
    cream: '#FDF7E7',
    text: '#333'
  };

  const fetchCitas = async () => {
    try {
      const data = await getTodasLasCitas(); 
      const formattedEvents = data.map(cita => ({
        id: cita._id,
        title: cita.cliente?.nombreCompleto || 'Cita', 
        start: cita.fecha, 
        backgroundColor: '#E3F2FD', 
        textColor: '#2196F3',
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error al obtener citas:", error);
    }
  };

  useEffect(() => {
    if (open) {
      document.getSelection()?.removeAllRanges();
      
      const timer = setTimeout(() => {
        setShouldRenderCalendar(true);
        fetchCitas();
      }, 450); 
      return () => clearTimeout(timer);
    } else {
      setShouldRenderCalendar(false);
    }
  }, [open]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      disableEnforceFocus
      disableAutoFocus
    >
      <AppBar sx={{ position: 'relative', bgcolor: colors.olive, boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
             <Box sx={{ mr: 2 }}>
                <Typography variant="h6" sx={{ color: colors.gold, lineHeight: 1, fontWeight: 'bold', fontFamily: 'serif' }}>NEXO</Typography>
                <Typography variant="caption" sx={{ color: colors.gold, letterSpacing: 2 }}>LUXURY SPA</Typography>
             </Box>
          </Box>
          
          <Typography variant="h5" sx={{ 
            color: colors.gold, 
            fontFamily: 'serif', 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)'
          }}>
            CALENDARIO
          </Typography>

          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close" sx={{ color: colors.gold }}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ 
        height: 'calc(100vh - 64px)', 
        p: { xs: 1, md: 2 }, 
        bgcolor: colors.cream,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden' 
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            border: `2px solid ${colors.gold}`,
            bgcolor: '#fff',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden', 
            '& .fc': { 
              fontFamily: 'inherit',
              height: '100% !important', 
            },
            '& .fc-scroller': {
              overflow: 'hidden !important' 
            },
            '& .fc-toolbar-title': { 
                color: colors.gold, 
                textTransform: 'capitalize', 
                fontFamily: 'serif', 
                fontSize: { xs: '1rem', md: '1.4rem' } 
            },
            '& .fc-button-primary': { bgcolor: colors.gold, borderColor: 'transparent' },
            '& .fc-daygrid-day-number': { color: colors.text, fontSize: '0.8rem', textDecoration: 'none' },
            '& .fc-col-header-cell-cushion': { color: '#999', fontSize: '0.75rem', textDecoration: 'none' },
            '& .fc-scrollgrid': { border: 'none' }
          }}
        >
          {shouldRenderCalendar ? (
            <>
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}> 
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  locale={esLocale}
                  events={events}
                  height="100%" 
                  aspectRatio={2} 
                  stickyHeaderDates={true}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                  }}
                  eventContent={(eventInfo) => (
                    <Box sx={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      color: '#2196F3',
                      bgcolor: '#E3F2FD',
                      borderRadius: '3px',
                      fontSize: '0.6rem',
                      px: 0.5,
                      borderLeft: '3px solid #2196F3'
                    }}>
                      {eventInfo.event.title}
                    </Box>
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    bgcolor: colors.gold, 
                    color: '#fff', 
                    borderRadius: '8px', 
                    px: 3, py: 0.5, 
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    '&:hover': { bgcolor: colors.olive }
                  }}
                >
                  AGENDAR CITA
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: colors.gold }}>Cargando...</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Dialog>
  );
};

export default CalendarioCompleto;