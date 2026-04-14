import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, 
  Divider, List, ListItem, ListItemText, Chip, Avatar
} from '@mui/material';
import { Close, History, Assignment, Person } from '@mui/icons-material';

const HistorialCliente = ({ open, onClose, cliente }) => {
    
  const historialEjemplo = [
    { fecha: '2023-10-15', servicio: 'Masaje Relajante', precio: '$450', notas: 'Cliente prefiere música suave.' },
    { fecha: '2023-09-12', servicio: 'Facial Hidratante', precio: '$600', notas: 'Piel sensible detectada.' },
    { fecha: '2023-08-05', servicio: 'Exfoliación Corporal', precio: '$350', notas: 'Sin observaciones.' },
  ];

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
        {/* Encabezado del Cliente */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Avatar sx={{ bgcolor: '#936025', width: 56, height: 56 }}>{cliente.nombre[0]}</Avatar>
          <Box>
            <Typography variant="h5" color="#54350D" fontWeight="900">{cliente.nombre}</Typography>
            <Typography variant="body2" color="#936025">Código: {cliente.codigo}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Lista de Visitas */}
        <List sx={{ width: '100%' }}>
          {historialEjemplo.map((item, index) => (
            <ListItem 
              key={index} 
              sx={{ 
                mb: 2, 
                bgcolor: '#FBF6CF22', 
                borderRadius: 3, 
                border: '1px solid #FBF6CF',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="#54350D">{item.fecha}</Typography>
                <Chip label={item.precio} size="small" sx={{ bgcolor: '#936025', color: '#fff', fontWeight: 'bold' }} />
              </Box>
              <ListItemText 
                primary={<Typography fontWeight="bold" color="#936025">{item.servicio}</Typography>} 
                secondary={item.notas} 
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default HistorialCliente;