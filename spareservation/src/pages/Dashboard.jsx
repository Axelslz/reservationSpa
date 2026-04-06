import React, { useState } from 'react';
import { 
  Box, CssBaseline, Toolbar, Drawer, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Container, 
  Grid, Paper, Button, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { 
  CalendarMonth, People, Search, AddCircle, 
  EventAvailable, AssignmentInd 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import RegistroCliente from '../components/RegistroCliente';

const drawerWidth = 260;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo para visualizar la profesionalidad de la tabla
  const clientesEjemplo = [
    { id: 1, nombre: 'Ana García', telefono: '961 123 4455', codigo: 'SPA-AXJ210', status: 'Activo' },
    { id: 2, nombre: 'Karla López', telefono: '961 998 1122', codigo: 'SPA-BKL993', status: 'Nuevo' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f7f9', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar userName={user?.nombre} role={user?.rol} onLogout={logout} />

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: '4px 0px 10px rgba(0,0,0,0.05)'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 3, px: 2 }}>
          <List>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton selected sx={{ borderRadius: 2, bgcolor: '#f3e5f5 !important' }}>
                <ListItemIcon><CalendarMonth color="primary" /></ListItemIcon>
                <ListItemText primary="Panel Principal" sx={{ fontWeight: 'bold' }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton sx={{ borderRadius: 2 }}>
                <ListItemIcon><People /></ListItemIcon>
                <ListItemText primary="Historial de Clientes" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Toolbar />
        <Container maxWidth="xl">
          {/* Header de la sección */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50', mb: 0.5 }}>
                Gestión de Servicios
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Registra clientes y gestiona sus citas en un solo lugar.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddCircle />} 
              onClick={() => setOpenModal(true)}
              sx={{ 
                borderRadius: 2, 
                px: 3, 
                py: 1.2, 
                textTransform: 'none', 
                fontWeight: 'bold',
                boxShadow: '0 4px 14px 0 rgba(123, 31, 162, 0.39)'
              }}
            >
              Nuevo Cliente
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Buscador y Tabla de Clientes */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AssignmentInd color="action" />
                  <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>Directorio de Clientes</Typography>
                  <TextField 
                    size="small"
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 300 }}
                  />
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Código Único</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clientesEjemplo.map((cliente) => (
                        <TableRow key={cliente.id} hover>
                          <TableCell sx={{ fontWeight: 'medium' }}>{cliente.nombre}</TableCell>
                          <TableCell color="textSecondary">{cliente.telefono}</TableCell>
                          <TableCell>
                            <Chip label={cliente.codigo} size="small" sx={{ fontFamily: 'monospace', fontWeight: 'bold', bgcolor: '#f3e5f5' }} />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={cliente.status} 
                              color={cliente.status === 'Nuevo' ? 'secondary' : 'default'} 
                              size="small" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button variant="outlined" size="small" startIcon={<EventAvailable />}>
                              Agendar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Sidebar de Resumen de Agenda */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Agenda de Hoy
                </Typography>
                {/* Aquí iría un mini listado de las próximas 3-4 citas */}
                <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#fcfcfc', borderRadius: 2, border: '1px dashed #ddd' }}>
                  <CalendarMonth sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    No hay citas confirmadas para hoy.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <RegistroCliente open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  );
};

export default Dashboard;