import React, { useState } from 'react';
import { 
  Box, CssBaseline, Button, Typography, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, IconButton, Paper, Avatar, Menu, MenuItem, ListItemIcon
} from '@mui/material';
import { 
  Search, AddCircle, EventAvailable, History, AccessTime, 
  ContactPage, ArrowForwardIos, MoreVert, CheckCircle, 
  PlayCircleOutline, DoneAll, Block, LocalAtm
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import RegistroCliente from '../components/RegistroCliente';
import AgendarCita from '../components/AgendarCita';
import HistorialCliente from '../components/HistorialCliente';
import CalendarioCompleto from '../components/CalendarioCompleto';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [openAgenda, setOpenAgenda] = useState(false);
  const [openHistorial, setOpenHistorial] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [openCalendario, setOpenCalendario] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCita, setSelectedCita] = useState(null);

  const handleMenuOpen = (event, cita) => {
    setAnchorEl(event.currentTarget);
    setSelectedCita(cita);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCita(null);
  };

  const clientesEjemplo = [
    { id: 1, nombre: 'Ana García', telefono: '961 123 4455', codigo: 'SPA-AXJ210', status: 'Activo' },
    { id: 2, nombre: 'Karla López', telefono: '961 998 1122', codigo: 'SPA-BKL993', status: 'Nuevo' },
    { id: 3, nombre: 'Roberto Solis', telefono: '961 445 6677', codigo: 'SPA-RST442', status: 'Activo' },
  ];

  const [citasHoy, setCitasHoy] = useState([
    { id: 101, hora: '09:00 AM', cliente: 'Ana García', servicio: 'Masaje Sueco', masajista: 'Elena Ríos', estado: 'pendiente' },
    { id: 102, hora: '10:30 AM', cliente: 'Karla López', servicio: 'Facial Hidratante', masajista: 'Sofia Luna', estado: 'check-in' },
    { id: 103, hora: '12:00 PM', cliente: 'Roberto Solis', servicio: 'Aromaterapia', masajista: 'Elena Ríos', estado: 'en-servicio' },
  ]);

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'check-in': return '#4caf50'; 
      case 'en-servicio': return '#2196f3'; 
      case 'finalizada': return '#9e9e9e'; 
      case 'no-asistio': return '#f44336'; 
      default: return '#BE7333'; 
    }
  };

  const handleOpenAgenda = (cliente) => {
    setSelectedCliente(cliente);
    setOpenAgenda(true);
  };

  const handleOpenHistorial = (cliente) => {
    setSelectedCliente(cliente);
    setOpenHistorial(true);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#FBF6CF', minHeight: '100vh', width: '100vw', flexDirection: 'column' }}>
      <CssBaseline />
      <Navbar userName={user?.nombre} role={user?.rol} onLogout={logout} />
      
      <Box component="main" sx={{ 
        flexGrow: 1, 
        mt: '64px', 
        p: { xs: 2, md: 3 }, 
        height: { md: 'calc(100vh - 64px)' }, 
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' }, 
        gap: 3,
        overflow: 'hidden'
      }}> 
        
        <Box sx={{ 
          flex: { lg: '0 0 60%' }, 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%'
        }}>
          <Paper sx={{ 
            p: { xs: 2, md: 4 }, 
            borderRadius: 5, 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%', 
            boxShadow: '0 10px 40px rgba(84, 53, 13, 0.05)', 
            bgcolor: '#fff', 
            overflow: 'hidden' 
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              mb: 4,
              gap: 2
            }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#54350D', letterSpacing: '-0.5px', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                  Directorio de Clientes
                </Typography>
                <Typography variant="body1" sx={{ color: '#936025', opacity: 0.8 }}>
                  Gestiona tu base de datos y agenda citas rápidas
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                startIcon={<AddCircle />} 
                onClick={() => setOpenRegistro(true)} 
                sx={{ 
                  bgcolor: '#936025', borderRadius: 3, px: 4, py: 1.5, fontWeight: 'bold',
                  '&:hover': { bgcolor: '#54350D' } 
                }}
              >
                Nuevo Cliente
              </Button>
            </Box>

            <TextField 
              fullWidth 
              placeholder="Buscar por nombre, código o teléfono..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#936025' }} /></InputAdornment> }}
              sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#FBF6CF44' } }}
            />

            <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: '#fff', color: '#54350D', fontWeight: 800 }}>CLIENTE</TableCell>
                    <TableCell sx={{ bgcolor: '#fff', color: '#54350D', fontWeight: 800 }}>CÓDIGO</TableCell>
                    <TableCell sx={{ bgcolor: '#fff', color: '#54350D', fontWeight: 800 }}>ESTADO</TableCell>
                    <TableCell align="center" sx={{ bgcolor: '#fff', color: '#54350D', fontWeight: 800 }}>ACCIONES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientesEjemplo.map((cliente) => (
                    <TableRow key={cliente.id} sx={{ '&:hover': { bgcolor: '#FBF6CF22' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: '#936025', width: 32, height: 32 }}>{cliente.nombre[0]}</Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#54350D' }}>{cliente.nombre}</Typography>
                            <Typography variant="caption" sx={{ color: '#BE7333' }}>{cliente.telefono}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={cliente.codigo} size="small" sx={{ bgcolor: '#54350D', color: '#FBF6CF', fontWeight: 'bold' }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={cliente.status} variant="outlined" size="small" sx={{ fontWeight: 'bold' }} />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleOpenAgenda(cliente)} sx={{ color: '#936025' }} size="small"><EventAvailable fontSize="small" /></IconButton>
                        <IconButton onClick={() => handleOpenHistorial(cliente)} sx={{ color: '#BE7333' }} size="small"><History fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <Paper sx={{ 
            height: '100%', 
            borderRadius: 6, 
            bgcolor: '#54350D', 
            color: '#FBF6CF', 
            p: { xs: 3, md: 4 }, 
            display: 'flex', 
            flexDirection: 'column', 
            boxShadow: '0 15px 50px rgba(0,0,0,0.2)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ fontSize: 22 }} /> Agenda de Hoy
              </Typography>
              <Chip 
                label={`${citasHoy.length} Citas`} 
                size="small"
                sx={{ bgcolor: '#FBF6CF', color: '#54350D', fontWeight: 'bold' }} 
              />
            </Box>
            
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
              {citasHoy.length > 0 ? (
                citasHoy.map((cita) => (
                  <Paper key={cita.id} sx={{ 
                    mb: 2, 
                    p: 2,    
                    borderRadius: 3, 
                    bgcolor: 'rgba(251, 246, 207, 0.05)', 
                    borderLeft: `5px solid ${getEstadoColor(cita.estado)}`, 
                    transition: '0.3s', 
                    '&:hover': { bgcolor: 'rgba(251, 246, 207, 0.1)' } 
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#BE7333', fontWeight: 900, display: 'block' }}>{cita.hora}</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#FBF6CF', lineHeight: 1.2 }}>{cita.cliente}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.6, fontSize: '0.75rem' }}>{cita.servicio}</Typography>
                      </Box>
                      <IconButton size="small" sx={{ color: '#FBF6CF' }} onClick={(e) => handleMenuOpen(e, cita)}>
                        <MoreVert fontSize="inherit" />
                      </IconButton>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.4 }}>
                  <ContactPage sx={{ fontSize: 50, mb: 1 }} />
                  <Typography variant="body2">No hay citas agendadas</Typography>
                </Box>
              )}
            </Box>

            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => setOpenCalendario(true)} 
              endIcon={<ArrowForwardIos sx={{ fontSize: 12 }} />} 
              sx={{ 
                color: '#FBF6CF', borderColor: 'rgba(251, 246, 207, 0.3)', mt: 2, py: 1.5, 
                borderRadius: 3, fontWeight: 'bold', fontSize: '0.8rem',
                '&:hover': { borderColor: '#FBF6CF', bgcolor: 'rgba(251, 246, 207, 0.1)' }
              }}
            >
              VER CALENDARIO COMPLETO
            </Button>
          </Paper>
        </Box>

      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}><ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon> Check-in</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ bgcolor: '#FBF6CF' }}><ListItemIcon><LocalAtm fontSize="small" /></ListItemIcon> Cobrar</MenuItem>
      </Menu>

      <RegistroCliente open={openRegistro} onClose={() => setOpenRegistro(false)} />
      <AgendarCita open={openAgenda} onClose={() => setOpenAgenda(false)} clienteSeleccionado={selectedCliente} />
      <HistorialCliente open={openHistorial} onClose={() => setOpenHistorial(false)} cliente={selectedCliente} />
      <CalendarioCompleto open={openCalendario} onClose={() => setOpenCalendario(false)} />
    </Box>
  );
};

export default Dashboard;