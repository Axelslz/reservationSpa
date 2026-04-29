import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Select, MenuItem, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, IconButton,
  Popover, List, ListItem, ListItemButton, ListItemText, ListItemIcon,
  useMediaQuery, useTheme, Divider
} from '@mui/material';
import { 
  ChevronLeft, ChevronRight, PersonOutline, Menu as MenuIcon, 
  CalendarToday, Logout, Visibility, AccessTime, AttachMoney, 
  Spa, AssignmentInd 
} from '@mui/icons-material';
import { getAgendaHoy, cambiarEstadoCita } from '../services/appointmentService';
import Sidebar from '../components/Sidebar';
import CalendarioCompleto from '../components/CalendarioCompleto';
import { useAuth } from '../context/AuthContext';

// Paleta de colores
const colors = {
  olive: '#5B6346',
  gold: '#C5A059',
  cream: '#FDF7E7',
  white: '#FFFFFF',
  text: '#333333',
  green: '#22C55E',
  red: '#EF4444',
  orange: '#F59E0B',
  gray: '#6B7280'
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Confirmada': return colors.green;
    case 'Cancelada': return colors.red;
    case 'Pendiente': return colors.orange;
    case 'Completada': return colors.gray;
    default: return colors.gray;
  }
};

const CitasDelDia = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  
  const isAdmin = user?.role === 'admin'; 

  const [citas, setCitas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCalendario, setOpenCalendario] = useState(false);
  
  // Estado para el Popover del perfil (Cerrar sesión)
  const [anchorEl, setAnchorEl] = useState(null);

  // ESTADOS PARA EL POPOVER DE INFORMACIÓN DE LA CITA
  const [infoAnchorEl, setInfoAnchorEl] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const fechaFormateada = selectedDate.toISOString().split('T')[0];

  const fechaHoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const fechaHeader = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1);

  useEffect(() => {
    cargarCitas();
  }, [fechaFormateada]);

  const cargarCitas = async () => {
    setLoading(true);
    try {
      const data = await getAgendaHoy(fechaFormateada);
      setCitas(data);
    } catch (error) {
      console.error("Error al cargar las citas del día:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (citaId, nuevoEstado) => {
    const citasAnteriores = [...citas];
    setCitas(citas.map(cita => 
      (cita.id === citaId || cita._id === citaId) ? { ...cita, status: nuevoEstado } : cita
    ));

    try {
      await cambiarEstadoCita(citaId, nuevoEstado);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setCitas(citasAnteriores);
      alert("Hubo un error al cambiar el estado.");
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpenPopover = (event) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);

  // MANEJADORES DEL POPOVER DE INFO
  const handleOpenInfo = (event, cita) => {
    console.log("Datos de la cita seleccionada:", cita);
    setCitaSeleccionada(cita);
    setInfoAnchorEl(event.currentTarget);
  };
  const handleCloseInfo = () => {
    setInfoAnchorEl(null);
    setCitaSeleccionada(null);
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const handleDayClick = (day) => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(<Box key={`empty-${i}`} sx={{ width: '14%' }} />);
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear();
      days.push(
        <Box 
          key={day} 
          onClick={() => handleDayClick(day)}
          sx={{
            width: '14%', textAlign: 'center', py: 1, cursor: 'pointer',
            bgcolor: isSelected ? colors.gold : 'transparent',
            color: 'white', borderRadius: 1, fontWeight: isSelected ? 'bold' : 'normal',
            '&:hover': { bgcolor: isSelected ? colors.gold : 'rgba(255,255,255,0.1)' }
          }}
        >
          {day}
        </Box>
      );
    }
    return days;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.cream, position: 'relative' }}>
      
      {isAdmin && (
        <Box sx={{ width: { md: 260 }, flexShrink: 0 }}>
          <Sidebar 
            mobileOpen={mobileOpen} 
            onDrawerToggle={handleDrawerToggle} 
            onCalendarClick={() => setOpenCalendario(true)} 
          />
        </Box>
      )}

      <Box component="main" sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        
        {/* HEADER */}
        <Box sx={{ height: 90, bgcolor: colors.olive, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, md: 4 }, flexShrink: 0, zIndex: 10 }}>
          <Box>
            {isAdmin && isMobile && (
              <IconButton onClick={handleDrawerToggle} sx={{ color: colors.gold }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
          <Box onClick={handleOpenPopover} sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
            <Box sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                <Avatar sx={{ bgcolor: colors.gold, width: 32, height: 32, fontSize: '0.9rem' }}>
                  {user?.nombreCompleto?.[0] || user?.nombre?.[0] || 'U'}
                </Avatar>
                <Typography variant="body2" sx={{ color: colors.gold, fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
                  {user?.nombreCompleto || user?.nombre || 'USUARIO'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
                  {fechaHeader}
                </Typography>
                <CalendarToday sx={{ fontSize: 12, color: colors.gold }} />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* CONTENIDO INTERNO (Con scroll ajustado para móviles) */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, overflowY: { xs: 'auto', md: 'hidden' }, overflowX: 'hidden' }}>
          
          {/* TABLA PRINCIPAL (Ajustada para no encogerse en móviles) */}
          <Box sx={{ flexGrow: 1, flexShrink: { xs: 0, md: 1 }, p: { xs: 2, md: 6 }, display: 'flex', flexDirection: 'column', overflowY: { xs: 'visible', md: 'auto' } }}>
            <Typography variant="h4" sx={{ color: colors.text, fontWeight: 500, fontFamily: 'serif', mb: 4, letterSpacing: 1 }}>
              {isAdmin ? 'Citas del Día' : `Tus Citas: ${fechaFormateada.split('-').reverse().join('-')}`}
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{ border: `2px solid ${colors.gold}`, borderRadius: 2, bgcolor: colors.white }}>
              <Table sx={{ '& th, & td': { borderBottom: `1px solid ${colors.cream}` } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: colors.gold, fontWeight: 'bold', borderBottom: `2px solid ${colors.gold} !important` }}>NOMBRE</TableCell>
                    <TableCell sx={{ color: colors.gold, fontWeight: 'bold', borderBottom: `2px solid ${colors.gold} !important` }}>FECHA</TableCell>
                    <TableCell align="center" sx={{ color: colors.gold, fontWeight: 'bold', borderBottom: `2px solid ${colors.gold} !important` }}>ESTADO</TableCell>
                    <TableCell align="center" sx={{ color: colors.gold, fontWeight: 'bold', borderBottom: `2px solid ${colors.gold} !important` }}>INFO</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>Cargando...</TableCell></TableRow>
                  ) : citas.length === 0 ? (
                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No hay citas para esta fecha.</TableCell></TableRow>
                  ) : (
                    citas.map((cita) => (
                      <TableRow key={cita.id || cita._id} hover>
                        <TableCell sx={{ fontWeight: 'bold', color: colors.text }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: colors.cream, color: colors.gold }}><PersonOutline /></Avatar>
                            {cita.cliente?.nombreCompleto || 'Cliente Sin Nombre'}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: colors.text, fontWeight: '500' }}>
                          {fechaFormateada.split('-').reverse().join('-')}
                        </TableCell>
                        <TableCell align="center">
                          <Select
                            value={cita.status || 'Pendiente'}
                            onChange={(e) => handleEstadoChange(cita.id || cita._id, e.target.value)}
                            sx={{
                              bgcolor: getStatusColor(cita.status),
                              color: 'white', fontWeight: 'bold', borderRadius: '8px',
                              height: '35px', fontSize: '0.85rem', textTransform: 'uppercase',
                              minWidth: '140px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              '& .MuiSelect-select': { py: 0.5, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' },
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                              '& .MuiSvgIcon-root': { display: 'none' }
                            }}
                          >
                            <MenuItem value="Pendiente">Pendiente</MenuItem>
                            <MenuItem value="Confirmada">Confirmada</MenuItem>
                            <MenuItem value="Completada">Completada</MenuItem>
                            <MenuItem value="Cancelada">Cancelada</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            onClick={(e) => handleOpenInfo(e, cita)}
                            sx={{ color: colors.olive, '&:hover': { color: colors.gold, bgcolor: colors.cream } }}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* SIDEBAR VERDE OLIVA (Resumen y Calendario) */}
          <Box sx={{ width: { xs: '100%', md: '380px' }, bgcolor: colors.olive, p: 4, display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto', borderLeft: `1px solid rgba(255,255,255,0.1)` }}>
            <Box sx={{ border: `1px solid ${colors.gold}`, borderRadius: 3, p: 2, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, color: 'white' }}>
                <IconButton onClick={handlePrevMonth} sx={{ color: 'white' }} size="small"><ChevronLeft /></IconButton>
                <Typography sx={{ fontWeight: 'bold' }}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</Typography>
                <IconButton onClick={handleNextMonth} sx={{ color: 'white' }} size="small"><ChevronRight /></IconButton>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <Typography key={d} sx={{ width: '14%', textAlign: 'center', color: colors.gold, fontSize: '0.8rem' }}>{d}</Typography>
                ))}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>{renderCalendarDays()}</Box>
            </Box>

            <Typography variant="subtitle1" sx={{ color: colors.gold, fontFamily: 'serif', mb: 2, letterSpacing: 1 }}>
              RESUMEN
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              {citas.map((cita) => (
                <Box key={`resumen-${cita.id || cita._id}`} sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'white' }}>
                  <Avatar sx={{ bgcolor: 'transparent', border: '1px solid white', width: 35, height: 35, mr: 2 }}><PersonOutline fontSize="small" /></Avatar>
                  <Typography sx={{ flexGrow: 1, fontSize: '0.95rem' }}>{cita.cliente?.nombreCompleto || 'Cliente'}</Typography>
                  <Typography sx={{ fontSize: '0.9rem' }}>{cita.hora.substring(0, 5)}</Typography>
                </Box>
              ))}
            </Box>

            {isAdmin && (
              <Button 
                variant="contained" 
                sx={{ bgcolor: colors.gold, color: 'white', mt: 4, alignSelf: 'center', borderRadius: '20px', textTransform: 'none', px: 4, py: 1, '&:hover': { bgcolor: '#B08D4C' } }}
              >
                Agregar Cita
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* COMPONENTES FLOTANTES */}
      <CalendarioCompleto open={openCalendario} onClose={() => setOpenCalendario(false)} />

      {/* POPOVER CERRAR SESIÓN */}
      <Popover 
        open={Boolean(anchorEl)} 
        anchorEl={anchorEl} 
        onClose={handleClosePopover} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <List sx={{ p: 0, width: 160 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon sx={{ minWidth: 35 }}><Logout fontSize="small" /></ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>

      {/* POPOVER INFORMACIÓN DE LA CITA */}
      <Popover
        open={Boolean(infoAnchorEl)}
        anchorEl={infoAnchorEl}
        onClose={handleCloseInfo}
        anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
        transformOrigin={{ vertical: 'center', horizontal: 'right' }}
        PaperProps={{
          sx: { borderRadius: 3, width: 320, p: 2, border: `1px solid ${colors.gold}`, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }
        }}
      >
        {citaSeleccionada && (
          <Box>
            <Typography variant="h6" sx={{ color: colors.olive, fontWeight: 'bold', mb: 1, fontFamily: 'serif' }}>
              Detalles de la Cita
            </Typography>
            <Divider sx={{ mb: 2, borderColor: colors.cream }} />

            <List disablePadding sx={{ '& .MuiListItem-root': { py: 1, px: 0 } }}>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 35 }}><AccessTime sx={{ color: colors.gold }} /></ListItemIcon>
                <ListItemText 
                  primary="Horario" 
                  secondary={citaSeleccionada.hora ? citaSeleccionada.hora.substring(0, 5) : 'No asignado'} 
                  primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  secondaryTypographyProps={{ variant: 'body1', color: colors.text, fontWeight: '500' }}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon sx={{ minWidth: 35 }}><Spa sx={{ color: colors.gold }} /></ListItemIcon>
                <ListItemText 
                  primary="Servicio" 
                  secondary={citaSeleccionada.servicio?.nombre || 'No especificado'} 
                  primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  secondaryTypographyProps={{ variant: 'body1', color: colors.text, fontWeight: '500' }}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: 35 }}><AttachMoney sx={{ color: colors.gold }} /></ListItemIcon>
                <ListItemText 
                  primary="Precio" 
                  secondary={citaSeleccionada.servicio?.precio ? `$${citaSeleccionada.servicio.precio} MXN` : 'N/A'} 
                  primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  secondaryTypographyProps={{ variant: 'body1', color: colors.text, fontWeight: '500' }}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: 35 }}><AssignmentInd sx={{ color: colors.gold }} /></ListItemIcon>
                <ListItemText 
                  primary="Especialista" 
                  secondary={citaSeleccionada.especialista?.nombreCompleto || citaSeleccionada.especialista?.nombre || 'No asignado'} 
                  primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  secondaryTypographyProps={{ variant: 'body1', color: colors.text, fontWeight: '500' }}
                />
              </ListItem>
            </List>
          </Box>
        )}
      </Popover>

    </Box>
  );
};

export default CitasDelDia;