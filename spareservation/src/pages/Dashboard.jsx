import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, TextField, Button, InputAdornment, 
  Avatar, Paper, IconButton, Chip, Popover, List, ListItem, 
  ListItemButton, ListItemText, ListItemIcon, useMediaQuery, useTheme 
} from '@mui/material';
import { 
  Search, AddCircle, History, MoreVert, CalendarToday, 
  Logout, EventAvailable, Menu as MenuIcon 
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getTodosLosClientes } from '../services/clientService';
import RegistroCliente from '../components/RegistroCliente';
import AgendarCita from '../components/AgendarCita';
import HistorialCliente from '../components/HistorialCliente';
import CalendarioCompleto from '../components/CalendarioCompleto';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout, user } = useAuth();

  const [clientes, setClientes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false); 
  const [openRegistro, setOpenRegistro] = useState(false);
  const [openAgendar, setOpenAgendar] = useState(false);
  const [openHistorial, setOpenHistorial] = useState(false);
  const [openCalendario, setOpenCalendario] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const colors = {
    olive: '#5B6346',
    gold: '#C5A059',
    cream: '#FDF7E7',
    inputBg: '#E1D9C1'
  };

  const fetchDatos = useCallback(async () => {
    try {
      const data = await getTodosLosClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  }, []);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpenPopover = (event) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.cream, position: 'relative' }}>
      
        <Box sx={{ width: { md: 260 }, flexShrink: 0 }}>
      <Sidebar 
        mobileOpen={mobileOpen} 
        onDrawerToggle={handleDrawerToggle} 
        onCalendarClick={() => setOpenCalendario(true)} 
      />
    </Box>

    {/* CONTENIDO PRINCIPAL - ESTO HARÁ QUE SE VEA BIEN */}
    <Box component="main" sx={{ 
      flexGrow: 1, 
      height: '100vh',
      display: 'flex', 
      flexDirection: 'column',
      minWidth: 0, // CRÍTICO: Evita que el contenido desborde al flexbox
      overflowX: 'hidden'
    }}>
        
        {/* HEADER */}
      <Box sx={{ 
        height: 90, 
        bgcolor: colors.olive, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        px: { xs: 2, md: 4 },
        flexShrink: 0,
        zIndex: 10
      }}>
          <Box>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle} sx={{ color: colors.gold }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          <Box onClick={handleOpenPopover} sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
            <Box sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                <Avatar sx={{ bgcolor: colors.gold, width: 32, height: 32, fontSize: '0.9rem' }}>
                  {user?.nombreCompleto?.[0] || 'U'}
                </Avatar>
                <Typography variant="body2" sx={{ color: colors.gold, fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
                  {user?.nombreCompleto || 'USUARIO'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
                  Miércoles 15 De Abril
                </Typography>
                <CalendarToday sx={{ fontSize: 12, color: colors.gold }} />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ÁREA DE DIRECTORIO */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: '40px 60px' }, overflow: 'hidden' }}>
          <Box sx={{ flexShrink: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontFamily: 'serif', color: '#333', fontWeight: 500, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                  Directorio de Clientes
                </Typography>
                <Typography variant="body2" sx={{ color: colors.gold }}>
                  Gestiona tus citas y los datos de tus clientes
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                startIcon={<AddCircle />}
                onClick={() => setOpenRegistro(true)} 
                sx={{ bgcolor: '#444B31', borderRadius: '20px', textTransform: 'none', px: 3, py: 0.8, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
              >
                NUEVO CLIENTE
              </Button>
            </Box>

            <TextField
              fullWidth
              placeholder="Buscar por nombre, código o teléfono"
              sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '50px', bgcolor: colors.inputBg, height: '45px' }, '& fieldset': { border: 'none' } }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Search sx={{ color: '#777', ml: 1 }} /></InputAdornment>) }}
            />

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, px: 3, mb: 2 }}>
              <Typography sx={{ flex: 2, color: colors.gold, fontWeight: 'bold', fontSize: '0.8rem' }}>CLIENTES</Typography>
              <Typography sx={{ flex: 1, color: colors.gold, fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center' }}>CÓDIGO</Typography>
              <Typography sx={{ flex: 1, color: colors.gold, fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center' }}>ESTADO</Typography>
              <Typography sx={{ flex: 1, color: colors.gold, fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center' }}>ACCIONES</Typography>
            </Box>
          </Box>

          {/* LISTA CON SCROLL MEJORADO */}
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            pr: { xs: 0, md: 1 },
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': { background: colors.gold, borderRadius: '10px' },
          }}>
            {clientes.map((cliente, index) => (
                <Paper 
                  key={cliente._id || `cliente-${index}`} 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, mb: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', 
                    bgcolor: 'rgba(255,255,255,0.6)', border: '1px solid #EBE4D1',
                    flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 }
                  }}
                >
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Avatar sx={{ bgcolor: '#EAD8B1', color: colors.gold }}>{cliente.nombreCompleto?.[0]}</Avatar>
                  <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1rem' } }}>{cliente.nombreCompleto}</Typography>
                </Box>
                <Typography variant="body2" sx={{ flex: 1, textAlign: 'center', color: '#666' }}>{cliente.codigoUnico}</Typography>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                   <Chip label="Activo" size="small" variant="outlined" sx={{ borderColor: colors.gold, color: colors.gold, height: '20px', fontSize: '0.7rem' }} />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  <IconButton onClick={() => { setSelectedCliente(cliente); setOpenAgendar(true); }} sx={{ color: colors.gold }}><EventAvailable fontSize="small"/></IconButton>
                  <IconButton onClick={() => { setSelectedCliente(cliente); setOpenHistorial(true); }} sx={{ color: colors.gold }}><History fontSize="small"/></IconButton>
                  <IconButton size="small"><MoreVert fontSize="small"/></IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* DIÁLOGOS Y MODALES */}
      <RegistroCliente open={openRegistro} onClose={() => setOpenRegistro(false)} onSuccess={fetchDatos} />
      <CalendarioCompleto open={openCalendario} onClose={() => setOpenCalendario(false)} />
      {selectedCliente && (
        <>
          <AgendarCita open={openAgendar} onClose={() => setOpenAgendar(false)} cliente={selectedCliente} />
          <HistorialCliente open={openHistorial} onClose={() => setOpenHistorial(false)} cliente={selectedCliente} />
        </>
      )}

      {/* POPOVER PERFIL */}
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
    </Box>
  );
};

export default Dashboard;