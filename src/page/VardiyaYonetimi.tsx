import React, { useState } from 'react';
import { Shift } from '../types/shift';
import ShiftForm from '../components/molecules/ShiftForm';
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Paper,
  Divider,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  AccessTime as AccessTimeIcon,
  Group as GroupIcon
} from '@mui/icons-material';

interface VardiyaYonetimiProps {
  shifts: Shift[];
  handleNewShift: (newShift: { name: string; startTime: string; endTime: string }) => void;
}

const VardiyaYonetimi: React.FC<VardiyaYonetimiProps> = ({ shifts, handleNewShift }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h2" color="primary" sx={{ fontWeight: 600 }}>
          Vardiya Listesi
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => setShowForm(!showForm)}
          sx={{ 
            px: 3, 
            py: 1, 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)'
          }}
        >
          {showForm ? 'Formu Kapat' : 'Yeni Vardiya Ekle'}
        </Button>
      </Box>

      {showForm && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography variant="h6" component="h3" gutterBottom color="primary">
            Yeni Vardiya Oluştur
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <ShiftForm onSubmit={handleNewShift} />
        </Paper>
      )}

      <Grid container spacing={3}>
        {shifts.map(shift => (
          <Grid item xs={12} sm={6} md={4} key={shift.id}>
            <Card 
              elevation={0} 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                },
                position: 'relative',
                overflow: 'visible',
                border: '1px solid #e0e0e0'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -15, 
                  left: 20, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              >
                Vardiya #{shift.id}
              </Box>
              <CardContent sx={{ pt: 4 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {shift.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'primary.light' }} />
                  <Typography variant="body2">
                    {shift.startTime} - {shift.endTime}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                  <GroupIcon fontSize="small" sx={{ mr: 1, color: 'primary.light' }} />
                  <Typography variant="body2">
                    {shift.employeeCount} Çalışan
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Chip 
                    label={`${Math.round((parseInt(shift.endTime.split(':')[0])*60 + parseInt(shift.endTime.split(':')[1]) - 
                      (parseInt(shift.startTime.split(':')[0])*60 + parseInt(shift.startTime.split(':')[1])))/60 * 10)/10} saat`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button 
                  size="small" 
                  startIcon={<EditIcon />}
                  sx={{ mr: 1 }}
                >
                  Düzenle
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Sil
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default VardiyaYonetimi; 