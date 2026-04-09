import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container, 
  InputAdornment, 
  IconButton,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ usuario: '', password: '' });
  const [error, setError] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.usuario === 'admin' && formData.password === '1234') {
      login({ nombre: 'Administrador', rol: 'admin' });
      navigate('/reservaciones');
    } else if (formData.usuario === 'recepcion' && formData.password === '1234') {
      login({ nombre: 'Secretaria', rol: 'empleado' });
      navigate('/reservaciones');
    } else {
      setError(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{ 
          marginTop: 12, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Paper 
          elevation={10} 
          sx={{ 
            p: 4, 
            width: '100%', 
            borderRadius: 4,
            borderTop: '5px solid #7b1fa2' 
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                p: 1.5, 
                borderRadius: '50%', 
                mb: 1 
              }}
            >
              <LockOutlined />
            </Box>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Nexo
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Control de Seguridad Interno
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Usuario o contraseña incorrectos
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Usuario"
              name="usuario"
              autoComplete="username"
              autoFocus
              value={formData.usuario}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2, 
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              Iniciar Sesión
            </Button>
          </form>
        </Paper>
        
        <Typography variant="caption" color="textSecondary" sx={{ mt: 4 }}>
          © 2026 Sistema de Reservaciones Seguro
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;