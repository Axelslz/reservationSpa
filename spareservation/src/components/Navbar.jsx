import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, IconButton, Box, Avatar, 
  Menu, MenuItem, ListItemIcon, Divider, Tooltip, Badge 
} from '@mui/material';
import { 
  Logout, Settings, Person, NotificationsNone, 
  KeyboardArrowDown, Menu as MenuIcon 
} from '@mui/icons-material';

const Navbar = ({ userName, onLogout, role, onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const today = new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', day: 'numeric', month: 'short' 
  });

  const colors = {
    olive: '#5B6346',
    gold: '#C5A059'
  };

  return (
    <AppBar 
      position="sticky" // <-- Cambiado a sticky para que conviva con el Sidebar
      sx={{ 
        top: 0,
        bgcolor: colors.olive, 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 10
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, height: 70 }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={onMenuClick}
            sx={{ display: { md: 'none' }, color: colors.gold }}
          >
            <MenuIcon />
          </IconButton>

          <Box 
            component="img" 
            src="https://res.cloudinary.com/dqozuofy6/image/upload/v1777585556/Logo_nexo_e9kvat.png" 
            sx={{ height: 50, objectFit: 'contain' }} 
            alt="Nexo Spa Logo"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
          <Typography variant="body2" sx={{ color: '#FDF7E7', opacity: 0.8, display: { xs: 'none', lg: 'block' }, textTransform: 'capitalize' }}>
            {today}
          </Typography>

          <Tooltip title="Notificaciones">
            <IconButton sx={{ color: colors.gold }}>
              <Badge badgeContent={2} color="error">
                <NotificationsNone />
              </Badge>
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />

          <Box onClick={handleClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', p: 0.5 }}>
            <Avatar sx={{ bgcolor: colors.gold, width: 35, height: 35, fontSize: '0.9rem', fontWeight: 'bold' }}>
              {userName ? userName[0].toUpperCase() : 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ color: '#FDF7E7', lineHeight: 1 }}>{userName}</Typography>
              <Typography variant="caption" sx={{ color: colors.gold, fontWeight: 'bold', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                {role === 'admin' ? 'Administrador' : 'Staff'}
              </Typography>
            </Box>
            <KeyboardArrowDown sx={{ color: colors.gold, fontSize: 18 }} />
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2 } }}
        >
          <MenuItem onClick={handleClose}><ListItemIcon><Person fontSize="small" /></ListItemIcon>Mi Perfil</MenuItem>
          <MenuItem onClick={handleClose}><ListItemIcon><Settings fontSize="small" /></ListItemIcon>Ajustes</MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleClose(); onLogout(); }}>
            <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
            <Typography color="error">Cerrar Sesión</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;