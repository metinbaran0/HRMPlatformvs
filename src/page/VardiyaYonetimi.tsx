import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createShiftThunk, fetchShiftsAsync, updateShiftThunk, deleteShiftAsync } from '../store/feature/ShiftSlice';
import { ShiftType, ShiftDto } from '../services/ApiService';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import Swal from 'sweetalert2';
import ApiService from '../services/ApiService';

const VardiyaYonetimi: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { shifts, loading, error } = useSelector((state: RootState) => state.shift);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [newShift, setNewShift] = useState({
    shiftName: '',
    startTime: '',
    endTime: '',
    shiftType: ShiftType.MORNING
  });

  // Sayfa yüklendiğinde vardiyaları getir
  useEffect(() => {
    dispatch(fetchShiftsAsync());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<ShiftType>) => {
    const { name, value } = e.target;
    setNewShift({
      ...newShift,
      [name as string]: value
    });
  };

  const handleSubmit = () => {
    if (editMode && selectedShiftId) {
      // Vardiya güncelleme
      dispatch(updateShiftThunk({
        id: selectedShiftId,
        shiftData: newShift
      }));
    } else {
      // Yeni vardiya ekleme
      dispatch(createShiftThunk(newShift));
    }
    
    setDialogOpen(false);
    setEditMode(false);
    setSelectedShiftId(null);
    
    // Form alanlarını temizle
    setNewShift({
      shiftName: '',
      startTime: '',
      endTime: '',
      shiftType: ShiftType.MORNING
    });
  };

  const handleEditClick = (shift: ShiftDto) => {
    setEditMode(true);
    setSelectedShiftId(shift.id || null);
    setNewShift({
      shiftName: shift.shiftName,
      startTime: shift.startTime,
      endTime: shift.endTime,
      shiftType: shift.shiftType
    });
    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedShiftId(null);
    setNewShift({
      shiftName: '',
      startTime: '',
      endTime: '',
      shiftType: ShiftType.MORNING
    });
    setDialogOpen(true);
  };

  // Silme işlemi için yeni fonksiyon
  const handleDeleteShift = async (id: string) => {
    try {
      // Silme işlemi için onay al
      const result = await Swal.fire({
        title: 'Vardiyayı silmek istediğinize emin misiniz?',
        text: "Bu işlem geri alınamaz!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'İptal'
      });

      if (result.isConfirmed) {
        await dispatch(deleteShiftAsync(id)).unwrap();
        
        Swal.fire(
          'Silindi!',
          'Vardiya başarıyla silindi.',
          'success'
        );
      }
    } catch (error) {
      Swal.fire(
        'Hata!',
        `Vardiya silinemedi: ${error}`,
        'error'
      );
    }
  };

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
          onClick={handleAddClick}
        >
          Yeni Vardiya Ekle
        </Button>
      </Box>

      {/* Vardiya Ekleme/Düzenleme Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Vardiya Düzenle' : 'Yeni Vardiya Ekle'}
          <IconButton
            aria-label="close"
            onClick={() => setDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              name="shiftName"
              label="Vardiya Adı"
              fullWidth
              value={newShift.shiftName}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="startTime"
              label="Başlangıç Tarihi"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newShift.startTime}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="endTime"
              label="Bitiş Tarihi"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newShift.endTime}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="shiftType"
              label="Vardiya Tipi"
              fullWidth
              value={newShift.shiftType}
              onChange={handleInputChange}
              required
              helperText="Örnek: MORNING, AFTERNOON, NIGHT, CUSTOM"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            İptal
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={!newShift.shiftName || !newShift.startTime || !newShift.endTime}
          >
            {editMode ? 'Güncelle' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Yükleme durumu */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Hata durumu */}
      {error && (
        <Box sx={{ my: 4, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
          <Button 
            variant="outlined" 
            color="error" 
            sx={{ mt: 2 }}
            onClick={() => dispatch(fetchShiftsAsync())}
          >
            Tekrar Dene
          </Button>
        </Box>
      )}

      {/* Vardiya Listesi */}
      <Grid container spacing={3}>
        {shifts.map((shift) => (
          <Grid item xs={12} sm={6} md={4} key={shift.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {shift.shiftName}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {shift.startTime} - {shift.endTime}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Vardiya Tipi: {getShiftTypeText(shift.shiftType)}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button 
                  size="small" 
                  startIcon={<EditIcon />}
                  sx={{ mr: 1 }}
                  onClick={() => handleEditClick(shift)}
                >
                  Düzenle
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    // shift.id'nin varlığını kontrol et
                    if (shift.id !== undefined) {
                      console.log(`Silme butonu tıklandı: ID=${shift.id}`);
                      
                      // Silme işlemi için onay al
                      Swal.fire({
                        title: 'Vardiyayı silmek istediğinize emin misiniz?',
                        text: "Bu işlem geri alınamaz!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Evet, sil!',
                        cancelButtonText: 'İptal'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          console.log(`Silme onaylandı: ID=${shift.id}`);
                          
                          // Doğrudan API'yi çağır
                          ApiService.deleteShift(shift.id!.toString())
                            .then((response) => {
                              console.log(`API yanıtı:`, response);
                              
                              if (response.success) {
                                Swal.fire(
                                  'Silindi!',
                                  'Vardiya başarıyla silindi.',
                                  'success'
                                );
                                // Vardiyaları yeniden yükle
                                dispatch(fetchShiftsAsync());
                              } else {
                                throw new Error(response.message || 'Vardiya silinemedi');
                              }
                            })
                            .catch((error) => {
                              console.error(`Silme hatası:`, error);
                              
                              Swal.fire(
                                'Hata!',
                                `Vardiya silinemedi: ${error.message}`,
                                'error'
                              );
                            });
                        }
                      });
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
    </div>
  );
};

// Vardiya tipini Türkçe metne çeviren yardımcı fonksiyon
const getShiftTypeText = (shiftType: ShiftType): string => {
  switch (shiftType) {
    case ShiftType.MORNING:
      return 'Sabah';
    case ShiftType.AFTERNOON:
      return 'Öğleden Sonra';
    case ShiftType.NIGHT:
      return 'Gece';
    case ShiftType.CUSTOM:
      return 'Özel';
    default:
      return '';
  }
};

export default VardiyaYonetimi; 