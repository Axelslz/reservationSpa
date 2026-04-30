import React from 'react';
import { 
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, IconButton, Divider
} from '@mui/material';
import { Contacts, CalendarMonth, AccessTime, Close } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onCalendarClick, mobileOpen, onDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const drawerWidth = 260;

  const colors = {
    gold: '#C5A059',
    sidebar: '#5B6346', 
    activeBg: '#D1D5C2' 
  };

  const menuItems = [
    { text: 'Directorio', icon: <Contacts />, path: '/reservaciones' },
    { text: 'Calendario', icon: <CalendarMonth />, action: 'calendar' },
    { text: 'Cita del día', icon: <AccessTime />, path: '/citas-dia' },
  ];

  const visibleItems = menuItems; 

  const drawerContent = (
    <Box sx={{ bgcolor: colors.sidebar, height: '100%', display: 'flex', flexDirection: 'column', color: 'white' }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', p: 3, minHeight: '100px' }}>
        
        {/* AQUÍ COLOCAMOS EL LOGO DE CLOUDINARY */}
        <Box 
          component="img" 
          src="https://res.cloudinary.com/dqozuofy6/image/upload/v1777585556/Logo_nexo_e9kvat.png" 
          sx={{ width: 130, objectFit: 'contain' }} 
          alt="Logo Nexo Spa"
        />
        
        <IconButton 
          onClick={onDrawerToggle} 
          sx={{ color: colors.gold, display: { md: 'none' }, position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />

      {/* LISTA DE BOTONES */}
      <List sx={{ px: 1 }}>
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => {
                  if (item.action === 'calendar') onCalendarClick();
                  else navigate(item.path);
                  if (mobileOpen) onDrawerToggle(); 
                }}
                sx={{ 
                  borderRadius: '10px',
                  mx: 1,
                  bgcolor: isActive ? colors.activeBg : 'transparent',
                  color: isActive ? colors.sidebar : 'white', 
                  '&:hover': { bgcolor: isActive ? colors.activeBg : 'rgba(255,255,255,0.08)' },
                  transition: '0.2s'
                }}
              >
                <ListItemIcon sx={{ color: isActive ? colors.sidebar : colors.gold, minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem', 
                    fontWeight: isActive ? '700' : '400' 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* VERSIÓN MÓVIL */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ 
          display: { xs: 'block', md: 'none' }, 
          '& .MuiDrawer-paper': { width: drawerWidth, border: 'none', bgcolor: colors.sidebar } 
        }}
      >
        {drawerContent}
      </Drawer>

      {/* VERSIÓN ESCRITORIO (FIJO) */}
      <Drawer
        variant="permanent"
        sx={{ 
          display: { xs: 'none', md: 'block' }, 
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none', position: 'fixed' } 
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;