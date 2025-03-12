import React, { useState, useEffect } from 'react';
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  AccessTime as AccessTimeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBreakAsync, selectBreakLoading, BreakRequestDto, fetchBreaksAsync, selectAllBreaks, updateBreakAsync, Break, deleteBreakAsync } from '../store/feature/breakSlice';
import { AppDispatch } from '../store';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

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
  handleNewBreak?: (newBreak: { breakType: string; startTime: string; endTime: string }) => void;
}

const MolaYonetimi: React.FC<MolaYonetimiProps> = ({ handleNewBreak = () => {} }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBreak, setEditingBreak] = useState<Break | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectBreakLoading);
  const breaks = useSelector(selectAllBreaks);

  useEffect(() => {
    dispatch(fetchBreaksAsync());
  }, [dispatch]);

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

  const handleEditClick = (breakItem: Break) => {
    setEditingBreak(breakItem);
    setShowForm(true);
  };

  const handleBreakSubmit = async (breakData: BreakRequestDto) => {
    try {
      if (editingBreak) {
        // Güncelleme işlemi
        await dispatch(updateBreakAsync({ 
          breakId: editingBreak.id, 
          breakData 
        })).unwrap();
        
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Mola başarıyla güncellendi',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Yeni mola oluşturma
        await dispatch(createBreakAsync(breakData)).unwrap();
        
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Mola başarıyla oluşturuldu',
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      // Listeyi güncelle ve formu kapat
      dispatch(fetchBreaksAsync());
      setShowForm(false);
      setEditingBreak(null);
      
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'İşlem sırasında bir hata oluştu'
      });
    }
  };

  const handleDeleteClick = async (breakId: number) => {
    try {
      const result = await Swal.fire({
        title: 'Emin misiniz?',
        text: "Bu molayı silmek istediğinize emin misiniz?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'İptal'
      });

      if (result.isConfirmed) {
        await dispatch(deleteBreakAsync(breakId)).unwrap();
        
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Mola başarıyla silindi',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Mola silinirken bir hata oluştu'
      });
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

        {/* Form Dialog'u */}
        <Dialog 
          open={showForm} 
          onClose={() => {
            setShowForm(false);
            setEditingBreak(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingBreak ? 'Mola Düzenle' : 'Yeni Mola Oluştur'}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ pt: 2 }}>
              <BreakForm 
                onSubmit={handleBreakSubmit} 
                initialData={editingBreak || undefined}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setShowForm(false);
                setEditingBreak(null);
              }}
            >
              İptal
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
            >
              {editingBreak ? 'Düzenle' : 'Kaydet'}
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={3}>
          {breaks.map((breakItem) => (
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
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {breakItem.breakName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(breakItem.startTime), 'dd MMMM yyyy HH:mm', { locale: tr })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'error.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(breakItem.endTime), 'dd MMMM yyyy HH:mm', { locale: tr })}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    sx={{ color: 'primary.main' }}
                    onClick={() => handleEditClick(breakItem)}
                  >
                    Düzenle
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<DeleteIcon />}
                    sx={{ color: 'error.main' }}
                    onClick={() => handleDeleteClick(breakItem.id)}
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