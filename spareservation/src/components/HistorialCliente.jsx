import React, { useState, useEffect } from 'react'; 
import { 
  Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, 
  Divider, List, ListItem, ListItemText, Chip, Avatar, CircularProgress
} from '@mui/material';
import { Close, History } from '@mui/icons-material';
import api from '../services/api'; 

const HistorialCliente = ({ open, onClose, cliente }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && cliente?.id) {
      const cargarHistorial = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/citas/historial/${cliente.id}`);
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ '& .MuiPaper-root': { borderRadius: 4 } }}>
      <DialogTitle sx={{ m: 0, p: 3, bgcolor: '#54350D', color: '#FBF6CF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <History />
          <Typography variant="h6" fontWeight="bold">Historial de Visitas</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#FBF6CF' }}><Close /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, bgcolor: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Avatar sx={{ bgcolor: '#936025', width: 56, height: 56 }}>
            {cliente?.nombreCompleto ? cliente.nombreCompleto[0] : 'C'}
          </Avatar>
          <Box>
            <Typography variant="h5" color="#54350D" fontWeight="900">{cliente.nombreCompleto}</Typography>
            <Typography variant="body2" color="#936025">Código: {cliente.codigoUnico}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
        ) : historial.length > 0 ? (
          <List sx={{ width: '100%' }}>
            {historial.map((item, index) => (
              <ListItem key={index} sx={{ mb: 2, bgcolor: '#FBF6CF22', borderRadius: 3, border: '1px solid #FBF6CF', flexDirection: 'column', alignItems: 'flex-start', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="#54350D">{item.fecha}</Typography>
                  <Chip label={`$${item.costo}`} size="small" sx={{ bgcolor: '#936025', color: '#fff', fontWeight: 'bold' }} />
                </Box>
                <ListItemText 
                  primary={<Typography fontWeight="bold" color="#936025">{item.servicio}</Typography>} 
                  secondary={item.observaciones} 
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
            No hay citas completadas anteriormente.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistorialCliente;