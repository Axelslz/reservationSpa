import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, TextField, Button, InputAdornment, 
  Avatar, Paper, IconButton, Chip, Menu, MenuItem, 
  Dialog, DialogTitle, DialogContent, DialogContentText, 
  DialogActions, FormControl, InputLabel, Select, useMediaQuery, useTheme
} from '@mui/material';
import { 
  Search, AddCircle, History, MoreVert, EventAvailable, Edit, Delete, Menu as MenuIcon 
} from '@mui/icons-material';

import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getTodosLosClientes, actualizarCliente, eliminarCliente } from '../services/clientService';
import RegistroCliente from '../components/RegistroCliente';
import AgendarCita from '../components/AgendarCita';
import HistorialCliente from '../components/HistorialCliente';
import CalendarioCompleto from '../components/CalendarioCompleto';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout, user } = useAuth(); 
  const [clientes, setClientes] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false); 
  const [openRegistro, setOpenRegistro] = useState(false);
  const [openAgendar, setOpenAgendar] = useState(false);
  const [openHistorial, setOpenHistorial] = useState(false);
  const [openCalendario, setOpenCalendario] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [clienteMenu, setClienteMenu] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({ nombreCompleto: '', telefono: '', email: '', status: '' });
  const [anchorElUser, setAnchorElUser] = useState(null);

  const colors = {
    olive: '#5B6346',
    gold: '#C5A059',
    cream: '#FDF7E7',
    inputBg: '#E1D9C1',
    red: '#EF4444'
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

  const handleOpenMenu = (event, cliente) => {
    setAnchorElMenu(event.currentTarget);
    setClienteMenu(cliente);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const handleAbrirEditar = () => {
    setEditForm({
      nombreCompleto: clienteMenu.nombreCompleto,
      telefono: clienteMenu.telefono,
      email: clienteMenu.email,
      status: clienteMenu.status || 'Nuevo'
    });
    setOpenEditDialog(true);
    handleCloseMenu();
  };

  const handleAbrirEliminar = () => {
    setOpenDeleteDialog(true);
    handleCloseMenu();
  };

  const handleGuardarEdicion = async () => {
    try {
      await actualizarCliente(clienteMenu.id, editForm);
      setOpenEditDialog(false);
      fetchDatos(); 
    } catch (error) {
      console.error("Error al editar:", error);
      alert("Hubo un error al editar el cliente.");
    }
  };

  const handleConfirmarEliminar = async () => {
    try {
      await eliminarCliente(clienteMenu.id);
      setOpenDeleteDialog(false);
      fetchDatos(); 
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Hubo un error al eliminar el cliente.");
    }
  };

  const fechaActual = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const fechaFormateada = fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.cream, position: 'relative' }}>
      
      <Box sx={{ width: { md: 260 }, flexShrink: 0 }}>
        <Sidebar 
          mobileOpen={mobileOpen} 
          onDrawerToggle={handleDrawerToggle} 
          onCalendarClick={() => setOpenCalendario(true)} 
        />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        
        {/* --- NUEVO ENCABEZADO MINIMALISTA (Reemplaza al antiguo Navbar) --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, md: '20px 60px 0 60px' } }}>
          
          {/* Botón de menú para móviles */}
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, color: colors.olive }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} /> {/* Espaciador */}

          {/* Sección de Perfil de Usuario */}
          <Box 
            onClick={(e) => setAnchorElUser(e.currentTarget)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          >
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
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
            PaperProps={{ sx: { borderRadius: 2, minWidth: '150px', mt: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}
          >
            <MenuItem 
              onClick={() => { 
                setAnchorElUser(null); 
                logout(); 
              }} 
              sx={{ color: colors.red, justifyContent: 'center', fontWeight: 'bold' }}
            >
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: '20px 60px 40px 60px' }, overflow: 'hidden' }}>
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

          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            pr: { xs: 0, md: 1 },
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': { background: colors.gold, borderRadius: '10px' },
          }}>
            {clientes.map((cliente) => (
                <Paper 
                  key={cliente.id} 
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
                   <Chip 
                     label={cliente.status || 'Nuevo'} 
                     size="small" 
                     variant="outlined" 
                     sx={{ 
                       borderColor: cliente.status === 'Inactivo' ? colors.red : colors.gold, 
                       color: cliente.status === 'Inactivo' ? colors.red : colors.gold, 
                       height: '20px', fontSize: '0.7rem' 
                     }} 
                   />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  <IconButton onClick={() => { setSelectedCliente(cliente); setOpenAgendar(true); }} sx={{ color: colors.gold }}><EventAvailable fontSize="small"/></IconButton>
                  <IconButton onClick={() => { setSelectedCliente(cliente); setOpenHistorial(true); }} sx={{ color: colors.gold }}><History fontSize="small"/></IconButton>
                  <IconButton onClick={(e) => handleOpenMenu(e, cliente)} size="small" sx={{ color: '#666' }}><MoreVert fontSize="small"/></IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* MENÚ DESPLEGABLE DE 3 PUNTOS */}
      <Menu
        anchorEl={anchorElMenu}
        open={Boolean(anchorElMenu)}
        onClose={handleCloseMenu}
        PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}
      >
        <MenuItem onClick={handleAbrirEditar} sx={{ color: colors.olive, gap: 1 }}>
          <Edit fontSize="small" /> Editar Información
        </MenuItem>
        <MenuItem onClick={handleAbrirEliminar} sx={{ color: colors.red, gap: 1 }}>
          <Delete fontSize="small" /> Eliminar Cliente
        </MenuItem>
      </Menu>

      {/* DIÁLOGO DE EDICIÓN */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: colors.olive, fontWeight: 'bold', fontFamily: 'serif' }}>Editar Cliente</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField 
              label="Nombre Completo" 
              fullWidth 
              value={editForm.nombreCompleto}
              onChange={(e) => setEditForm({ ...editForm, nombreCompleto: e.target.value })}
            />
            <TextField 
              label="Teléfono" 
              fullWidth 
              value={editForm.telefono}
              onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
            />
            <TextField 
              label="Correo Electrónico" 
              fullWidth 
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={editForm.status}
                label="Estado"
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <MenuItem value="Nuevo">Nuevo</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEditDialog(false)} sx={{ color: '#666' }}>Cancelar</Button>
          <Button onClick={handleGuardarEdicion} variant="contained" sx={{ bgcolor: colors.gold, '&:hover': { bgcolor: '#A3844A' } }}>
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIÁLOGO DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ color: colors.red, fontWeight: 'bold' }}>¿Eliminar Cliente?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar a <strong>{clienteMenu?.nombreCompleto}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: '#666' }}>Cancelar</Button>
          <Button onClick={handleConfirmarEliminar} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* OTROS DIÁLOGOS EXISTENTES */}
      <RegistroCliente open={openRegistro} onClose={() => setOpenRegistro(false)} onSuccess={fetchDatos} />
      <CalendarioCompleto open={openCalendario} onClose={() => setOpenCalendario(false)} />
      {selectedCliente && (
        <>
          <AgendarCita open={openAgendar} onClose={() => setOpenAgendar(false)} cliente={selectedCliente} />
          <HistorialCliente open={openHistorial} onClose={() => setOpenHistorial(false)} cliente={selectedCliente} />
        </>
      )}
    </Box>
  );
};

export default Dashboard;