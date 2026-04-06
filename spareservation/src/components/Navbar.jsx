import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Logout, Spa } from '@mui/icons-material';

const Navbar = ({ userName, onLogout, role }) => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        bgcolor: '#7b1fa2',
        boxShadow: 3 
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Spa sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            SPA & NAILS SYSTEM
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body1" sx={{ lineHeight: 1, fontWeight: 'medium' }}>
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase' }}>
              {role === 'admin' ? 'Administrador' : 'Recepcionista'}
            </Typography>
          </Box>
          
          <IconButton 
            color="inherit" 
            onClick={onLogout}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)', 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } 
            }}
          >
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;