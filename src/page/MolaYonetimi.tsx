import React, { useState } from 'react';
import BreakForm from '../components/organisms/BreakForm';
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
  Container,
  ThemeProvider,
  createTheme,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  AccessTime as AccessTimeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Material UI için tema oluşturma
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

interface MolaYonetimiProps {
  breaks?: { id: number; breakType: string; startTime: string; endTime: string }[];
  handleNewBreak?: (newBreak: { breakType: string; startTime: string; endTime: string }) => void;
}

const MolaYonetimi: React.FC<MolaYonetimiProps> = ({ 
  breaks = [
    { id: 1, breakType: 'Öğle Molası', startTime: '12:00', endTime: '13:00' },
    { id: 2, breakType: 'Çay Molası', startTime: '15:30', endTime: '15:45' },
    { id: 3, breakType: 'Kahvaltı Molası', startTime: '09:30', endTime: '10:00' }
  ], 
  handleNewBreak = () => {} 
}) => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Mola süresini hesapla
  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    if (durationMinutes < 0) durationMinutes += 24 * 60; // Gece yarısını geçen molalar için
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours === 0) {
      return `${minutes} dakika`;
    } else if (minutes === 0) {
      return `${hours} saat`;
    } else {
      return `${hours} saat ${minutes} dakika`;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Tooltip title="Vardiya Sayfasına Dön">
            <IconButton 
              color="primary" 
              onClick={() => navigate('/shift')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" component="h1" color="primary">
            Mola Yönetimi
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Çalışanlarınız için mola zamanlarını düzenleyin ve yönetin
        </Typography>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Mola Listesi
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Toplam {breaks.length} mola tanımlanmış
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<AddIcon />}
            onClick={() => setShowForm(!showForm)}
            sx={{ 
              px: 3, 
              py: 1.2, 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(245, 0, 87, 0.3)',
              bgcolor: 'secondary.main',
              '&:hover': {
                bgcolor: 'secondary.dark',
              }
            }}
          >
            {showForm ? 'Formu Kapat' : 'Yeni Mola Ekle'}
          </Button>
        </Paper>

        {showForm && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: '1px solid #e0e0e0'
            }}
          >
            <Typography variant="h6" component="h3" gutterBottom color="primary">
              Yeni Mola Oluştur
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <BreakForm onSubmit={handleNewBreak} />
          </Paper>
        )}

        <Grid container spacing={3}>
          {breaks.map(breakItem => (
            <Grid item xs={12} sm={6} md={4} key={breakItem.id}>
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
                  border: '1px solid #e0e0e0',
                  borderRadius: 3
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: -15, 
                    left: 20, 
                    bgcolor: 'secondary.main', 
                    color: 'white',
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  Mola #{breakItem.id}
                </Box>
                <CardContent sx={{ pt: 4 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: 'secondary.main' }}>
                    {breakItem.breakType}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'secondary.light' }} />
                    <Typography variant="body2">
                      {breakItem.startTime} - {breakItem.endTime}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Chip 
                      label={calculateDuration(breakItem.startTime, breakItem.endTime)}
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(63, 81, 181, 0.08)'
                      }
                    }}
                  >
                    Düzenle
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{ 
                      '&:hover': {
                        bgcolor: 'rgba(245, 0, 87, 0.08)'
                      }
                    }}
                  >
                    Sil
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default MolaYonetimi; 