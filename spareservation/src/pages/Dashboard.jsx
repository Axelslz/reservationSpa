import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, TextField, Button, InputAdornment, 
  Avatar, Paper, IconButton, Chip, Popover, List, ListItem, ListItemButton, ListItemText, ListItemIcon 
} from '@mui/material';
import { 
  Search, AddCircle, History, MoreVert, CalendarToday, 
  Logout, EventAvailable 
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getTodosLosClientes } from '../services/clientService';
import RegistroCliente from '../components/RegistroCliente';
import AgendarCita from '../components/AgendarCita';
import HistorialCliente from '../components/HistorialCliente';
import CalendarioCompleto from '../components/CalendarioCompleto'; // Importante importar tu calendario

const Dashboard = () => {
  const { logout } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openRegistro, setOpenRegistro] = useState(false);
  const [openAgendar, setOpenAgendar] = useState(false);
  const [openHistorial, setOpenHistorial] = useState(false);
  const [openCalendario, setOpenCalendario] = useState(false); // Estado para el Calendario Maestro
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

  const handleNuevaCita = (cliente) => {
    setSelectedCliente(cliente);
    setOpenAgendar(true);
  };

  const handleVerHistorial = (cliente) => {
    setSelectedCliente(cliente);
    setOpenHistorial(true);
  };

  const handleOpenPopover = (event) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: colors.cream }}>
      
      {/* SIDEBAR - Le pasamos la función para abrir el calendario */}
      <Box sx={{ width: 260, display: 'flex', flexDirection: 'column', bgcolor: colors.olive, flexShrink: 0 }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.gold, letterSpacing: 2, fontFamily: 'serif' }}>NEXO</Typography>
          <Typography variant="caption" sx={{ color: colors.gold, letterSpacing: 3, display: 'block', mt: -0.5 }}>LUXURY SPA</Typography>
        </Box>
        <Sidebar onCalendarClick={() => setOpenCalendario(true)} />
      </Box>

      {/* CONTENIDO PRINCIPAL */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* HEADER */}
        <Box sx={{ height: 90, bgcolor: colors.olive, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 4 }}>
          <Box onClick={handleOpenPopover} sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
            <Box sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                <Avatar sx={{ bgcolor: colors.gold, width: 32, height: 32 }}>U</Avatar>
                <Typography variant="body2" sx={{ color: colors.gold, fontWeight: 'bold' }}>USUARIO</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Miércoles 15 De Abril</Typography>
                <CalendarToday sx={{ fontSize: 12, color: colors.gold }} />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ÁREA DE DIRECTORIO */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: '40px 60px' }, overflow: 'hidden' }}>
          <Box sx={{ flexShrink: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h4" sx={{ fontFamily: 'serif', color: '#333', fontWeight: 500 }}>Directorio de Clientes</Typography>
                <Typography variant="body2" sx={{ color: colors.gold }}>Gestiona tus citas y los datos de tus clientes</Typography>
              </Box>
              <Button 
                variant="contained" 
                startIcon={<AddCircle />}
                onClick={() => setOpenRegistro(true)} 
                sx={{ bgcolor: '#444B31', borderRadius: '20px', textTransform: 'none', px: 3, py: 0.8 }}
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

            <Box sx={{ display: 'flex', px: 3, mb: 2 }}>
              <Typography sx={{ flex: 2, color: colors.gold, fontWeight: 'bold', fontSize: '0.8rem' }}>CLIENTES</Typography>
              <Typography sx={{ flex: 1, color: colors.gold, fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center' }}>CÓDIGO</Typography>
              <Typography sx={{ flex: 1, color: colors.gold, fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center' }}>ESTADO</Typography>
              <Typography sx={{ flex: 1, color: colors.gold, fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center' }}>ACCIONES</Typography>
            </Box>
          </Box>

          {/* LISTA CON SCROLL */}
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            pr: 1,
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': { background: colors.gold, borderRadius: '10px' },
          }}>
            {clientes.map((cliente) => (
              <Paper key={cliente._id} elevation={0} sx={{ p: 1.5, mb: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.6)', border: '1px solid #EBE4D1' }}>
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#EAD8B1', color: colors.gold }}>{cliente.nombreCompleto?.[0]}</Avatar>
                  <Typography sx={{ fontWeight: 'bold' }}>{cliente.nombreCompleto}</Typography>
                </Box>
                <Typography sx={{ flex: 1, textAlign: 'center' }}>{cliente.codigoUnico}</Typography>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                   <Chip label="Activo" size="small" variant="outlined" sx={{ borderColor: colors.gold, color: colors.gold }} />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <IconButton onClick={() => handleNuevaCita(cliente)} sx={{ color: colors.gold }}><EventAvailable fontSize="small"/></IconButton>
                  <IconButton onClick={() => handleVerHistorial(cliente)} sx={{ color: colors.gold }}><History fontSize="small"/></IconButton>
                  <IconButton size="small"><MoreVert fontSize="small"/></IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* MODALES Y COMPONENTES EXTERNOS */}
      <RegistroCliente open={openRegistro} onClose={() => setOpenRegistro(false)} onSuccess={fetchDatos} />
      
      {/* CALENDARIO MAESTRO (Modal) */}
      <CalendarioCompleto 
        open={openCalendario} 
        onClose={() => setOpenCalendario(false)} 
      />

      {selectedCliente && (
        <>
          <AgendarCita open={openAgendar} onClose={() => setOpenAgendar(false)} cliente={selectedCliente} />
          <HistorialCliente open={openHistorial} onClose={() => setOpenHistorial(false)} clienteId={selectedCliente._id} />
        </>
      )}

      {/* POPOVER PERFIL */}
      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClosePopover} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <List sx={{ p: 0, width: 160 }}><ListItem disablePadding><ListItemButton onClick={logout}><ListItemIcon sx={{ minWidth: 35 }}><Logout fontSize="small" /></ListItemIcon><ListItemText primary="Cerrar Sesión" /></ListItemButton></ListItem></List>
      </Popover>
    </Box>
  );
};

export default Dashboard;