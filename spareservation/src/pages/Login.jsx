import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, InputAdornment, IconButton, Alert 
} from '@mui/material';
import { Visibility, VisibilityOff, PersonOutline, LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      const { token, user } = response.data;
      login(user, token);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || "Error al conectar con el servidor");
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url("https://res.cloudinary.com/dqozuofy6/image/upload/v1776882079/fondo_login_k3m60w.jpg")',
        bgcolor: '#FDF7E7', 
        p: 2 
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 4, md: 6 }, 
          width: '100%', 
          maxWidth: 600, 
          borderRadius: '20px', 
          textAlign: 'center',
          border: '1px solid #EAD8B1',
          bgcolor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Box 
            component="img" 
            src="/logo-nexo.png" 
            sx={{ width: 80, mb: 1 }}
            alt="Logo Nexo"
            onError={(e) => e.target.style.display = 'none'}
          />
          <Typography variant="h4" sx={{ color: '#C5A059', fontWeight: '500', letterSpacing: 2, mb: 0.5, fontFamily: 'serif' }}>
            NEXO
          </Typography>
          <Typography variant="overline" sx={{ color: '#D4AF37', letterSpacing: 4 }}>
            LUXURY SPA
          </Typography>
          <Typography variant="h5" sx={{ mt: 3, fontWeight: '400', color: '#333' }}>
            Bienvenido de vuelta
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Iniciar sesión para continuar
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <Typography variant="body2" sx={{ textAlign: 'left', mb: 1, ml: 1, fontWeight: 'bold', color: '#444' }}>Usuario</Typography>
          <TextField
            fullWidth
            placeholder="Ingresa tu usuario"
            name="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline sx={{ color: '#C5A059' }} />
                </InputAdornment>
              ),
            }}
          />

          <Typography variant="body2" sx={{ textAlign: 'left', mt: 3, mb: 1, ml: 1, fontWeight: 'bold', color: '#444' }}>Contraseña</Typography>
          <TextField
            fullWidth
            placeholder="Ingresa tu contraseña"
            name="password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: '#C5A059' }} />
                </InputAdornment>
              ),
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
            sx={{ 
              mt: 5, 
              mb: 2, 
              py: 1.5,
              borderRadius: '12px',
              bgcolor: '#4B5335', 
              '&:hover': { bgcolor: '#3a4129' },
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Iniciar Sesión
          </Button>

          {/* <Typography variant="body2" sx={{ color: '#888', mt: 2, cursor: 'pointer', '&:hover': { color: '#C5A059' } }}>
            ¿Olvidaste tu contraseña?
          </Typography> */}
        </form>
      </Paper>
    </Box>
  );
};

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: '#EAD8B1' },
    '&:hover fieldset': { borderColor: '#C5A059' },
    '&.Mui-focused fieldset': { borderColor: '#C5A059' },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 14px',
  }
};

export default Login;