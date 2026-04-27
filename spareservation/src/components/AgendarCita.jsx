import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, Button, Box, Typography, 
  MenuItem, Select, FormControl, CircularProgress, Avatar, useMediaQuery, useTheme
} from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../services/api'; 

const AgendarCita = ({ open, onClose, cliente, onCitaAgendada }) => {
  const [loading, setLoading] = useState(false);
  const [masajistas, setMasajistas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [cita, setCita] = useState({ 
    hora: '', 
    masajistaId: '', 
    servicioId: '' 
  });

  const colors = {
    olive: '#5B6346',
    gold: '#C5A059',
    cream: '#FDF7E7',
    red: '#F05454',
    white: '#FFFFFF'
  };

  const horasDisponibles = ['09:00 a.m.', '10:00 a.m.', '11:00 a.m.', '01:00 p.m.', '03:00 p.m.'];

  useEffect(() => {
    if (open) {
      const cargarCatalogos = async () => {
        try {
          const [resM, resS] = await Promise.all([
            api.get('/auth/especialistas'), 
            api.get('/servicios')  
          ]);
          setMasajistas(resM.data);
          setServicios(resS.data);
        } catch (error) { console.error(error); }
      };
      cargarCatalogos();
    }
  }, [open]);

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      const dataAEnviar = {
        clienteId: cliente._id || cliente.id,
        especialistaId: cita.masajistaId, 
        servicioId: cita.servicioId,
        fecha: fechaSeleccionada.toISOString().split('T')[0],
        hora: cita.hora
      };
      await api.post('/citas/agendar', dataAEnviar);
      onCitaAgendada?.();
      onClose();
    } catch (error) {
      alert("Error al agendar");
      console.error(error);
    } finally { setLoading(false); }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          borderRadius: '15px', 
          bgcolor: colors.cream, 
          overflow: 'hidden',
          backgroundImage: 'none' 
        } 
      }}
    >
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        
        <Box sx={{ py: 2, textAlign: 'center', bgcolor: colors.cream }}>
          <Typography variant="h4" sx={{ color: colors.gold, fontFamily: 'serif', letterSpacing: 2, fontWeight: 'bold' }}>
            AGENDAR CITA
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          borderTop: `1px solid ${colors.gold}` 
        }}>
          
          <Box sx={{ 
            flex: 1, 
            bgcolor: colors.olive, 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2 
          }}>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              p: 1.5, 
              borderRadius: '12px',
              border: `1px solid rgba(197, 160, 89, 0.4)`
            }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: colors.gold, color: colors.olive, fontWeight: 'bold' }}>
                {cliente?.nombreCompleto?.[0] || 'C'}
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {cliente?.nombreCompleto || 'Cliente'}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.gold, fontWeight: 'bold' }}>
                  {cliente?.codigoUnico || 'SPA-XXXX'}
                </Typography>
              </Box>
            </Box>

            {/* CALENDARIO */}
            <Box sx={{ 
              width: '100%',
              '& .react-calendar': { 
                bg: 'transparent', 
                border: 'none', 
                color: 'white', 
                width: '100%',
                fontFamily: 'inherit',
                background: 'transparent'
              },
              '& .react-calendar__navigation button': { 
                color: colors.gold, 
                minWidth: '44px',
                background: 'none',
                fontSize: '1.1rem',
                '&:enabled:hover, &:enabled:focus': { bgcolor: 'rgba(255,255,255,0.1)' }
              },
              '& .react-calendar__month-view__weekdays': { 
                color: colors.gold, 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.7rem'
              },
              '& .react-calendar__tile': { 
                color: 'white', 
                padding: '10px 5px',
                '&:disabled': { 
                    color: 'rgba(255,255,255,0.2) !important', 
                    background: 'none' 
                }
              },
              '& .react-calendar__tile--now': { 
                background: 'rgba(197, 160, 89, 0.2)',
                borderRadius: '8px'
              },
              '& .react-calendar__tile--active': { 
                bgcolor: `${colors.gold} !important`, 
                color: `${colors.olive} !important`,
                fontWeight: 'bold',
                borderRadius: '8px'
              }
            }}>
              <Calendar 
                onChange={setFechaSeleccionada} 
                value={fechaSeleccionada}
                locale="es-ES"
                minDate={new Date()} 
              />
            </Box>
          </Box>

          <Box sx={{ 
            flex: 1.2, 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3,
            justifyContent: 'center' 
          }}>
            
            {[
              { label: 'HORA DISPONIBLE', field: 'hora', options: horasDisponibles, isStatic: true },
              { label: 'ESPECIALISTA', field: 'masajistaId', options: masajistas },
              { label: 'SERVICIO', field: 'servicioId', options: servicios }
            ].map((item) => (
              <Box key={item.field}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: colors.olive, mb: 1, display: 'block' }}>
                  {item.label}
                </Typography>
                <FormControl fullWidth>
                  <Select 
                    value={cita[item.field]} 
                    onChange={(e) => setCita({...cita, [item.field]: e.target.value})} 
                    size="small" 
                    sx={{ borderRadius: '25px', bgcolor: 'white', border: `1px solid ${colors.gold}` }}
                  >
                    {item.options.map(opt => (
                      <MenuItem key={item.isStatic ? opt : (opt._id || opt.id)} value={item.isStatic ? opt : (opt._id || opt.id)}>
                        {item.isStatic ? opt : opt.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                fullWidth
                onClick={handleConfirmar}
                disabled={loading || !cita.hora || !cita.masajistaId || !cita.servicioId}
                sx={{ 
                  borderRadius: '25px', border: `2px solid ${colors.gold}`, color: colors.olive, fontWeight: 'bold',
                  '&:hover': { bgcolor: colors.gold, color: 'white' }
                }}
              >
                {loading ? <CircularProgress size={20} /> : "CONFIRMAR"}
              </Button>
              <Button 
                fullWidth
                onClick={onClose}
                sx={{ borderRadius: '10px', bgcolor: colors.red, color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#d32f2f' } }}
              >
                CANCELAR
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AgendarCita;