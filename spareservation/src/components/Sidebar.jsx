import React from 'react';
import { 
  Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText 
} from '@mui/material';
import { Contacts, CalendarMonth, AccessTime } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onCalendarClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const colors = {
    gold: '#C5A059',
    sidebar: '#5B6346', 
    activeBg: '#D1D5C2' 
  };

  const menuItems = [
    { text: 'Directorio', icon: <Contacts />, path: '/reservaciones' },
    { text: 'Calendario', icon: <CalendarMonth />, action: 'calendar' }, // Marcado como acción
    { text: 'Cita del día', icon: <AccessTime />, path: '/citas-dia' },
  ];

  return (
    <Box sx={{ 
      width: 260, 
      bgcolor: colors.sidebar, 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%', 
      borderRight: '1px solid rgba(0,0,0,0.1)'
    }}>
      <List sx={{ mt: 2, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => {
                  if (item.action === 'calendar') {
                    onCalendarClick(); // Abre el modal en lugar de navegar
                  } else {
                    navigate(item.path);
                  }
                }}
                sx={{ 
                  borderRadius: '50px 0 0 50px', 
                  ml: 1,
                  bgcolor: isActive ? colors.activeBg : 'transparent',
                  color: isActive ? colors.gold : 'white',
                  '&:hover': { bgcolor: isActive ? colors.activeBg : 'rgba(255,255,255,0.05)' },
                  border: isActive ? `1px solid ${colors.gold}` : '1px solid transparent',
                  transition: '0.3s'
                }}
              >
                <ListItemIcon sx={{ color: isActive ? colors.gold : 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '1.1rem', 
                    fontWeight: isActive ? '500' : '300',
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;