import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Card, Typography, Select, MenuItem, Avatar,
  IconButton, Menu, useMediaQuery, useTheme
} from '@mui/material';
import { 
  PeopleAlt, CalendarToday, AccessTime, AttachMoney, 
  Person, Menu as MenuIcon, EventAvailable
} from '@mui/icons-material';

import Sidebar from '../components/Sidebar';
import CalendarioCompleto from '../components/CalendarioCompleto'; // <-- Importamos el calendario
import { useAuth } from '../context/AuthContext';
import { getTodasLasCitas, getServicios } from '../services/appointmentService';

const Estadisticas = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { logout, user } = useAuth(); 
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  // <-- Estado para controlar si el calendario está abierto
  const [openCalendario, setOpenCalendario] = useState(false); 

  // Estados para nuestros datos calculados
  const [estadisticas, setEstadisticas] = useState({
    totalCitasCompletadas: 0,
    ingresosTotales: 0,
    gananciaSpa: 0,
    gananciaEmpleadas: 0
  });
  const [citasProximas, setCitasProximas] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    bg: '#FAF8F3', cream: '#FDF7E7', olive: '#5B6346',
    darkGreen: '#334235', gold: '#C5A059', lightGold: '#F4EFE6',
    cardBorder: '#f0f0f0', red: '#EF4444'
  };

  useEffect(() => {
    const calcularDatos = async () => {
      try {
        const [citasData, serviciosData] = await Promise.all([
          getTodasLasCitas(),
          getServicios()
        ]);

        let completadas = 0;
        let ingresos = 0;
        let spa = 0;
        let empleadas = 0;
        let proximas = [];

        const hoy = new Date().toISOString().split('T')[0];

        citasData.forEach(cita => {
          const servicio = serviciosData.find(s => s.id === cita.servicioId || s._id === cita.servicioId || s.nombre === cita.servicio?.nombre);
          const nombreServicio = servicio ? servicio.nombre.toLowerCase() : '';
          const precioServicio = servicio?.precio || cita.precio || 0; 
          const estadoCita = (cita.status || cita.estado || '').toLowerCase();

          // CÁLCULO FINANCIERO
          if (estadoCita === 'completada' || estadoCita === 'completado') {
            completadas++;
            if (nombreServicio.includes('masaje completo')) {
              ingresos += 2500;
              spa += 1000;
              empleadas += 1500;
            } else {
              ingresos += precioServicio;
              spa += (precioServicio / 2);
              empleadas += (precioServicio / 2);
            }
          }

          // FILTRO CITAS PRÓXIMAS
          if ((estadoCita === 'pendiente' || estadoCita === 'agendada') && cita.fecha >= hoy) {
            proximas.push({
              id: cita.id || cita._id,
              nombre: cita.cliente?.nombreCompleto || 'Cliente',
              servicio: servicio?.nombre || 'Servicio',
              fecha: cita.fecha,
              hora: cita.hora
            });
          }
        });

        proximas.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));
        
        setEstadisticas({
          totalCitasCompletadas: completadas,
          ingresosTotales: ingresos,
          gananciaSpa: spa,
          gananciaEmpleadas: empleadas
        });
        setCitasProximas(proximas.slice(0, 5));

      } catch (err) {
        console.error('Error al calcular estadísticas', err);
      } finally {
        setLoading(false);
      }
    };
    calcularDatos();
  }, []);

  const formatearDinero = (cantidad) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN', minimumFractionDigits: 0
    }).format(cantidad);
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const fechaActual = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const fechaFormateada = fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1);

  if (loading) return <Box p={4} textAlign="center" color={colors.gold}>Calculando finanzas reales...</Box>;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.bg, position: 'relative' }}>
      
      <Box sx={{ width: { md: 260 }, flexShrink: 0 }}>
        {/* <-- Se agregó la prop onCalendarClick al Sidebar --> */}
        <Sidebar 
          mobileOpen={mobileOpen} 
          onDrawerToggle={handleDrawerToggle} 
          onCalendarClick={() => setOpenCalendario(true)} 
        />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, md: '20px 60px 0 60px' } }}>
          <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ display: { md: 'none' }, color: colors.olive }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} /> 
          <Box onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
            <Avatar sx={{ bgcolor: colors.gold, color: '#fff', width: 40, height: 40 }}>
              {user?.nombre?.[0]?.toUpperCase() || 'A'}
            </Avatar>
            <Box>
              <Typography sx={{ color: '#af7140', fontWeight: 'bold', fontSize: '0.9rem', lineHeight: 1.2 }}>
                {user?.nombre || 'Administrador General'}
              </Typography>
              <Typography sx={{ color: '#888', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                {fechaFormateada} <EventAvailable sx={{ fontSize: '0.9rem' }}/>
              </Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={() => setAnchorElUser(null)}
            PaperProps={{ sx: { borderRadius: 2, minWidth: '150px', mt: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}
          >
            <MenuItem onClick={() => { setAnchorElUser(null); logout(); }} sx={{ color: colors.red, justifyContent: 'center', fontWeight: 'bold' }}>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: '20px 60px 40px 60px' }, overflowY: 'auto' }}>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: 'serif', color: colors.darkGreen, mb: 0.5, fontWeight: 'bold' }}>
                Resumen Financiero
              </Typography>
              <Typography variant="body2" sx={{ color: colors.gold }}>Datos reales calculados según esquema de comisiones</Typography>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, borderRadius: 4, boxShadow: 'none', border: `1px solid ${colors.cardBorder}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: colors.lightGold, color: colors.gold, mr: 2, width: 48, height: 48 }}><PeopleAlt /></Avatar>
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1 }}>CITAS COMPLETADAS</Typography>
                    <Typography variant="h4" sx={{ fontFamily: 'serif', color: colors.darkGreen, fontWeight: 'bold' }}>{estadisticas.totalCitasCompletadas}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, borderRadius: 4, boxShadow: 'none', border: `1px solid ${colors.cardBorder}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: colors.lightGold, color: colors.gold, mr: 2, width: 48, height: 48 }}><CalendarToday /></Avatar>
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1 }}>GANANCIA SPA</Typography>
                    <Typography variant="h4" sx={{ fontFamily: 'serif', color: colors.darkGreen, fontWeight: 'bold' }}>{formatearDinero(estadisticas.gananciaSpa)}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, borderRadius: 4, boxShadow: 'none', border: `1px solid ${colors.cardBorder}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: colors.lightGold, color: colors.gold, mr: 2, width: 48, height: 48 }}><AccessTime /></Avatar>
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1 }}>PAGO EMPLEADAS</Typography>
                    <Typography variant="h4" sx={{ fontFamily: 'serif', color: colors.darkGreen, fontWeight: 'bold' }}>{formatearDinero(estadisticas.gananciaEmpleadas)}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, borderRadius: 4, boxShadow: 'none', border: `1px solid ${colors.cardBorder}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: colors.lightGold, color: colors.gold, mr: 2, width: 48, height: 48 }}><AttachMoney /></Avatar>
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1 }}>INGRESOS TOTALES</Typography>
                    <Typography variant="h4" sx={{ fontFamily: 'serif', color: colors.darkGreen, fontWeight: 'bold' }}>{formatearDinero(estadisticas.ingresosTotales)}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: 4, boxShadow: 'none', border: `1px solid ${colors.cardBorder}`, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: colors.darkGreen }}>CITAS PRÓXIMAS</Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1 }}>
                  {citasProximas.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', color: '#999', mt: 4 }}>No hay citas próximas agendadas.</Typography>
                  ) : (
                    citasProximas.map((cita, i) => (
                      <Box key={cita.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: i !== citasProximas.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: colors.lightGold, color: colors.gold, mr: 2, width: 32, height: 32 }}><Person fontSize="small" /></Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: colors.darkGreen }}>{cita.nombre}</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{cita.servicio}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontSize: '0.75rem', color: colors.gold, fontWeight: 'bold' }}>{cita.fecha}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled', fontWeight: 'medium' }}>{cita.hora}</Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, borderRadius: 4, boxShadow: 'none', border: `1px solid ${colors.cardBorder}`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: '#999' }}>El gráfico se activará cuando haya más datos históricos.</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* <-- Aquí agregamos el componente del Modal del Calendario --> */}
      <CalendarioCompleto open={openCalendario} onClose={() => setOpenCalendario(false)} />

    </Box>
  );
};

export default Estadisticas;