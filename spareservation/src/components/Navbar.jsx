import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from '@mui/material';
import { Logout, Spa } from '@mui/icons-material';

const Navbar = ({ userName, onLogout, role }) => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: '#54350D', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #936025'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Spa sx={{ color: '#BE7333', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, color: '#FBF6CF' }}>
            Nexo 
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FBF6CF', lineHeight: 1 }}>
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#BE7333', textTransform: 'uppercase', fontWeight: 700 }}>
              {role === 'admin' ? 'Administrador' : 'Recepcionista'}
            </Typography>
          </Box>
          <IconButton 
            onClick={onLogout}
            sx={{ color: '#FBF6CF', bgcolor: 'rgba(189, 115, 51, 0.2)', '&:hover': { bgcolor: '#BE7333' } }}
          >
            <Logout fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;