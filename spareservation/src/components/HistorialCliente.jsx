import React, { useState, useEffect } from 'react'; 
import { 
  Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, 
  Divider, Chip, Avatar, CircularProgress, Paper
} from '@mui/material';
import { Close, History, CalendarMonth, Spa, AttachMoney } from '@mui/icons-material';
import api from '../services/api'; 

const HistorialCliente = ({ open, onClose, cliente }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);

  // Paleta de colores unificada con el resto del sistema
  const colors = {
    olive: '#5B6346',
    gold: '#C5A059',
    cream: '#FDF7E7',
    inputBg: '#E1D9C1',
    textDark: '#333333'
  };

  useEffect(() => {
    const idDelCliente = cliente?.id || cliente?._id; 

    if (open && idDelCliente) {
      const cargarHistorial = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/citas/historial/${idDelCliente}`);
          setHistorial(response.data);
        } catch (error) {
          console.error("Error al obtener historial real:", error);
        } finally {
          setLoading(false);
        }
      };
      cargarHistorial();
    }
  }, [open, cliente]);

  if (!cliente) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      PaperProps={{
        sx: { 
          borderRadius: 4,
          bgcolor: colors.cream, // Fondo crema general
          overflow: 'hidden'
        }
      }}
    >
      {/* HEADER DE LA MODAL */}
      <DialogTitle sx={{ 
        m: 0, p: 3, 
        bgcolor: colors.olive, 
        color: colors.cream, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `4px solid ${colors.gold}` // Detalle dorado
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <History sx={{ color: colors.gold }} />
          <Typography variant="h6" sx={{ fontFamily: 'serif', fontWeight: 600, letterSpacing: 1 }}>
            Historial de Visitas
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: colors.cream, '&:hover': { color: colors.gold } }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
        {/* INFO DEL CLIENTE */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2.5, mt: 2 }}>
          <Avatar sx={{ 
            bgcolor: colors.gold, 
            color: '#fff',
            width: 64, 
            height: 64, 
            fontSize: '1.8rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            {cliente?.nombreCompleto ? cliente.nombreCompleto[0].toUpperCase() : 'C'}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: colors.textDark, fontWeight: 700, fontFamily: 'serif' }}>
              {cliente.nombreCompleto}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.gold, fontWeight: 'bold', letterSpacing: 0.5, mt: 0.5 }}>
              CÓDIGO: {cliente.codigoUnico || 'SIN CÓDIGO'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4, borderColor: colors.inputBg }} />

        {/* LISTADO DE HISTORIAL */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, gap: 2 }}>
            <CircularProgress sx={{ color: colors.gold }} />
            <Typography sx={{ color: colors.olive }}>Cargando historial...</Typography>
          </Box>
        ) : historial.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {historial.map((item, index) => (
              <Paper 
                key={index} 
                elevation={0} 
                sx={{ 
                  p: 2.5, 
                  borderRadius: 3, 
                  bgcolor: '#ffffff', // Tarjetas blancas para contrastar con el fondo crema
                  border: `1px solid ${colors.inputBg}`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
                    borderColor: colors.gold
                  }
                }}
              >
                {/* Cabecera de la tarjeta (Fecha y Costo) */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonth sx={{ color: colors.olive, fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.olive }}>
                      {item.fecha}
                    </Typography>
                  </Box>
                  <Chip 
                    icon={<AttachMoney sx={{ fontSize: '1rem !important', color: `${colors.cream} !important` }} />}
                    label={item.costo ? parseFloat(item.costo).toFixed(2) : '0.00'} 
                    size="small" 
                    sx={{ 
                      bgcolor: colors.gold, 
                      color: colors.cream, 
                      fontWeight: 'bold',
                      borderRadius: '8px'
                    }} 
                  />
                </Box>
                
                <Divider sx={{ mb: 2, opacity: 0.5 }} />
                
                {/* Cuerpo de la tarjeta (Servicio y Observaciones) */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ bgcolor: `${colors.cream}`, p: 1, borderRadius: '50%', display: 'flex' }}>
                    <Spa sx={{ color: colors.gold, fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.textDark }}>
                      {item.servicio}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 0.5, fontStyle: item.observaciones ? 'normal' : 'italic' }}>
                      {item.observaciones || 'Sin observaciones registradas en esta visita.'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 3, border: `1px dashed ${colors.gold}` }}>
            <Spa sx={{ fontSize: 40, color: colors.inputBg, mb: 1 }} />
            <Typography variant="body1" sx={{ color: colors.olive, fontWeight: 500 }}>
              Este cliente aún no tiene citas completadas.
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
              El historial aparecerá aquí cuando termine su primer servicio.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistorialCliente;