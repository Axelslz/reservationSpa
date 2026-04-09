import React, { useState } from 'react';
import { 
  Box, CssBaseline, Button, Typography, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, Grid, IconButton, Tooltip, Paper, Avatar 
} from '@mui/material';
import { 
  Search, AddCircle, EventAvailable, History, AccessTime, 
  ContactPage, ArrowForwardIos
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

  const clientesEjemplo = [
    { id: 1, nombre: 'Ana García', telefono: '961 123 4455', codigo: 'SPA-AXJ210', status: 'Activo' },
    { id: 2, nombre: 'Karla López', telefono: '961 998 1122', codigo: 'SPA-BKL993', status: 'Nuevo' },
    { id: 3, nombre: 'Roberto Solis', telefono: '961 445 6677', codigo: 'SPA-RST442', status: 'Activo' },
  ];

  const handleOpenAgenda = (cliente) => {
    setSelectedCliente(cliente);
    setOpenAgenda(true);
  };

  const handleOpenHistorial = (cliente) => {
    setSelectedCliente(cliente);
    setOpenHistorial(true);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      bgcolor: '#FBF6CF', 
      height: '100vh', 
      width: '100vw',
      flexDirection: 'column', 
      overflow: 'hidden' 
    }}>
      <CssBaseline />
      <Navbar userName={user?.nombre} role={user?.rol} onLogout={logout} />
      
      <Box component="main" sx={{ 
        flexGrow: 1, 
        mt: '64px', 
        width: '100%', 
        height: 'calc(100vh - 64px)',
        display: 'flex'
      }}> 
        <Grid container sx={{ height: '100%', width: '100%' }}>
          
          {/* PANEL IZQUIERDO: GESTIÓN DE CLIENTES */}
          <Grid item xs={12} lg={7} sx={{ 
            height: '100%', 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: 5, 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              boxShadow: '0 10px 40px rgba(84, 53, 13, 0.05)',
              border: 'none',
              bgcolor: '#fff',
              overflow: 'hidden'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#54350D', letterSpacing: '-0.5px' }}>
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
                    bgcolor: '#936025', 
                    borderRadius: 3, 
                    px: 4, py: 1.5, 
                    fontWeight: 'bold',
                    boxShadow: '0 4px 14px rgba(147, 96, 37, 0.3)',
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
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search sx={{ color: '#936025' }} /></InputAdornment>,
                }}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#FBF6CF44' } 
                }}
              />

              <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: '#fff', color: '#54350D', fontWeight: 800 }}>CLIENTE</TableCell>
                      <TableCell sx={{ bgcolor: '#fff', color: '#54350D', fontWeight: 800 }}>CÓDIGO ÚNICO</TableCell>
                      <TableCell sx={{ bgcolor: '#fff', color: '#54350D', fontWeight: 800 }}>ESTADO</TableCell>
                      <TableCell align="center" sx={{ bgcolor: '#fff', color: '#54350D', fontWeight: 800 }}>ACCIONES</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clientesEjemplo.map((cliente) => (
                      <TableRow key={cliente.id} sx={{ '&:hover': { bgcolor: '#FBF6CF22' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#936025' }}>{cliente.nombre[0]}</Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#54350D' }}>{cliente.nombre}</Typography>
                              <Typography variant="caption" sx={{ color: '#BE7333' }}>{cliente.telefono}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={cliente.codigo} sx={{ bgcolor: '#54350D', color: '#FBF6CF', fontWeight: 'bold' }} />
                        </TableCell>
                        <TableCell>
                          <Chip label={cliente.status} variant="outlined" sx={{ fontWeight: 'bold' }} />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleOpenAgenda(cliente)} sx={{ color: '#936025' }}>
                            <EventAvailable />
                          </IconButton>
                          <IconButton onClick={() => handleOpenHistorial(cliente)} sx={{ color: '#BE7333' }}><History /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          {/* PANEL DERECHO: AGENDA (Modificado según lo solicitado) */}
          <Grid item xs={12} lg={5} sx={{ height: '100%', p: 2 }}> {/* p: 2 agrega el margen de ~2cm */}
            <Paper sx={{ 
              height: '100%', 
              borderRadius: 6, // Bordes redondeados para que no se vea tan rígido
              bgcolor: '#54350D', 
              color: '#FBF6CF', 
              p: 5, 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
              border: 'none'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccessTime sx={{ fontSize: 32 }} /> Agenda de Hoy
                </Typography>
                <Chip label="3 Citas" sx={{ bgcolor: '#FBF6CF', color: '#54350D', fontWeight: 'bold' }} />
              </Box>
              
              <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                border: '2px dashed rgba(251, 246, 207, 0.2)', 
                borderRadius: 6, 
                p: 4, 
                textAlign: 'center'
              }}>
                <Avatar sx={{ bgcolor: 'rgba(251, 246, 207, 0.1)', width: 80, height: 80, mb: 3 }}>
                  <ContactPage sx={{ fontSize: 40, color: '#FBF6CF' }} />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Sin citas pendientes</Typography>
                <Typography variant="body2" sx={{ opacity: 0.6 }}>
                  Selecciona un cliente del directorio para agendar una nueva cita.
                </Typography>
              </Box>

              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => setOpenCalendario(true)}
                endIcon={<ArrowForwardIos fontSize="small" />}
                sx={{ 
                  color: '#FBF6CF', 
                  borderColor: 'rgba(251, 246, 207, 0.3)', 
                  mt: 5, py: 2, borderRadius: 3, fontWeight: 'bold',
                  '&:hover': { borderColor: '#FBF6CF', bgcolor: 'rgba(251, 246, 207, 0.1)' }
                }}
              >
                VER CALENDARIO COMPLETO
              </Button>
            </Paper>
          </Grid>

        </Grid>
      </Box>

      <RegistroCliente open={openRegistro} onClose={() => setOpenRegistro(false)} />
      <AgendarCita open={openAgenda} onClose={() => setOpenAgenda(false)} clienteSeleccionado={selectedCliente} />
      <HistorialCliente open={openHistorial} onClose={() => setOpenHistorial(false)} cliente={selectedCliente} />
      <CalendarioCompleto open={openCalendario} onClose={() => setOpenCalendario(false)} />
    </Box>
  );
};

export default Dashboard;