import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, IconButton, Box, Avatar, 
  Menu, MenuItem, ListItemIcon, Divider, Tooltip, Badge 
} from '@mui/material';
import { 
  Logout, Settings, Person, NotificationsNone, 
  KeyboardArrowDown 
} from '@mui/icons-material';
import LogoFlor from '../assets/Nexo_flor.png'; 
import LogoLetras from '../assets/Nexo_letras.png';

const Navbar = ({ userName, onLogout, role }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const today = new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', day: 'numeric', month: 'short' 
  });

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'rgba(84, 53, 13, 0.98)', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderBottom: '1px solid rgba(189, 115, 51, 0.4)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, height: 70 }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            component="img"
            src={LogoFlor}
            alt="Nexo Logo Flor"
            sx={{ 
              height: 45, 
              width: 'auto',
              filter: 'drop-shadow(0px 0px 8px rgba(251, 246, 207, 0.2))',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'rotate(5deg) scale(1.05)' }
            }}
          />
          
          <Box 
            component="img"
            src={LogoLetras}
            alt="Nexo Luxury Spa"
            sx={{ 
              height: 44, 
              width: 'auto',
              display: { xs: 'none', sm: 'block' },
              filter: 'brightness(0) invert(1) opacity(0.9)', 
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#FBF6CF', 
              opacity: 0.7, 
              display: { xs: 'none', lg: 'block' },
              textTransform: 'capitalize',
              fontWeight: 400,
              letterSpacing: 0.5
            }}
          >
            {today}
          </Typography>

          <Tooltip title="Notificaciones">
            <IconButton sx={{ color: '#FBF6CF', '&:hover': { bgcolor: 'rgba(251, 246, 207, 0.1)' } }}>
              <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}>
                <NotificationsNone />
              </Badge>
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(251, 246, 207, 0.2)', my: 2 }} />

          <Box 
            onClick={handleClick}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              cursor: 'pointer',
              py: 0.5,
              px: 1,
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              border: '1px solid transparent',
              '&:hover': { 
                bgcolor: 'rgba(251, 246, 207, 0.05)',
                borderColor: 'rgba(189, 115, 51, 0.3)'
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: '#BE7333', 
                border: '1.5px solid #FBF6CF',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#FBF6CF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              {userName ? userName[0].toUpperCase() : 'U'}
            </Avatar>
            
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#FBF6CF', lineHeight: 1 }}>
                {userName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#BE7333', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                {role === 'admin' ? 'Administrador' : 'Recepcionista'}
              </Typography>
            </Box>
            
            <KeyboardArrowDown sx={{ color: '#FBF6CF', fontSize: 18, opacity: 0.5 }} />
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          disableScrollLock={true} 
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 5,
            sx: {
              mt: 1.5,
              borderRadius: 3,
              minWidth: 220,
              bgcolor: '#FFF',
              overflow: 'visible',
              '&:before': { 
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            }
          }}
        >
          <MenuItem onClick={handleClose} sx={{ py: 1.2, gap: 1 }}>
            <ListItemIcon><Person fontSize="small" sx={{ color: '#54350D' }} /></ListItemIcon>
            <Typography variant="body2" sx={{ color: '#54350D', fontWeight: 500 }}>Mi Perfil</Typography>
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ py: 1.2, gap: 1 }}>
            <ListItemIcon><Settings fontSize="small" sx={{ color: '#54350D' }} /></ListItemIcon>
            <Typography variant="body2" sx={{ color: '#54350D', fontWeight: 500 }}>Ajustes de Sistema</Typography>
          </MenuItem>
          <Divider sx={{ my: 1, opacity: 0.6 }} />
          <MenuItem 
            onClick={() => { handleClose(); onLogout(); }} 
            sx={{ py: 1.2, gap: 1, '&:hover': { bgcolor: '#ffebee' } }}
          >
            <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
            <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>Cerrar Sesión</Typography>
          </MenuItem>
        </Menu>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;