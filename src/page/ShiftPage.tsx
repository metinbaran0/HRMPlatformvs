import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shift, EmployeeShift } from '../types/shift';
import VardiyaYonetimi from '../page/VardiyaYonetimi';
import MolaYonetimi from '../page/MolaYonetimi';
import VardiyaAtama from '../page/VardiyaAtama';
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  Button
} from '@mui/material';
import { 
  Schedule as ScheduleIcon, 
  Coffee as CoffeeIcon, 
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import './ShiftPage.css';
import { deleteShiftAsync } from '../store/feature/ShiftSlice';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { BreakRequestDto } from '../store/feature/breakSlice';

// Material UI için özel tema oluşturma
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#fff',
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
          overflow: 'visible',
        },
      },
    },
  },
});

const ShiftPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  // URL'ye göre aktif sekmeyi belirle
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/shift/molalar')) {
      setActiveTab(1);
    } else if (path.includes('/shift/atamalar')) {
      setActiveTab(2);
    } else {
      setActiveTab(0);
    }
  }, [location.pathname]);

  // **State Tanımlamaları**
  const [shifts, setShifts] = useState<Shift[]>([
    { id: 1, name: 'Sabah Vardiyası', startTime: '08:00', endTime: '16:00', employeeCount: 5 },
    { id: 2, name: 'Akşam Vardiyası', startTime: '16:00', endTime: '00:00', employeeCount: 3 },
    { id: 3, name: 'Gece Vardiyası', startTime: '00:00', endTime: '08:00', employeeCount: 2 },
  ]);
  
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([
    { id: 1, name: 'Ahmet Yılmaz' },
    { id: 2, name: 'Mehmet Kaya' },
    { id: 3, name: 'Ayşe Demir' },
    { id: 4, name: 'Fatma Şahin' }
  ]);

  const [breaks, setBreaks] = useState<{ id: number; breakType: string; startTime: string; endTime: string }[]>([
    { id: 1, breakType: 'Öğle Molası', startTime: '12:00', endTime: '13:00' },
    { id: 2, breakType: 'Çay Molası', startTime: '15:30', endTime: '15:45' }
  ]);

  const [employeeShifts, setEmployeeShifts] = useState<EmployeeShift[]>([
    { id: 1, employeeId: 1, employeeName: 'Ahmet Yılmaz', shiftId: 1, shiftName: 'Sabah Vardiyası', date: '2023-05-15' },
    { id: 2, employeeId: 2, employeeName: 'Mehmet Kaya', shiftId: 2, shiftName: 'Akşam Vardiyası', date: '2023-05-15' },
    { id: 3, employeeId: 3, employeeName: 'Ayşe Demir', shiftId: 3, shiftName: 'Gece Vardiyası', date: '2023-05-16' }
  ]);

  // **Yeni vardiya ekleme fonksiyonu**
  const handleNewShift = (newShift: { name: string; startTime: string; endTime: string }) => {
    const shiftWithId = { ...newShift, id: shifts.length + 1, employeeCount: 0 };
    setShifts([...shifts, shiftWithId]);
  };

  // **Yeni mola ekleme fonksiyonu**
  const handleNewBreak = (formData: { breakType: string; startTime: string; endTime: string }) => {
    const breakData: BreakRequestDto = {
      shiftId: 1,
      breakName: formData.breakType,
      startTime: formData.startTime,
      endTime: formData.endTime
    };
    
    // Transform back to the expected breaks array format
    setBreaks([...breaks, { 
      id: breaks.length + 1,
      breakType: breakData.breakName,
      startTime: breakData.startTime,
      endTime: breakData.endTime
    }]);
  };

  // **Vardiya atama fonksiyonu**
  const handleAssignShift = (assignment: { employeeId: number; shiftId: number; date: string }) => {
    const employee = employees.find(e => e.id === assignment.employeeId);
    const shift = shifts.find(s => s.id === assignment.shiftId);
    
    if (employee && shift) {
      const newAssignment: EmployeeShift = {
        id: employeeShifts.length + 1,
        employeeId: employee.id,
        employeeName: employee.name,
        shiftId: shift.id,
        shiftName: shift.name,
        date: assignment.date
      };
      
      setEmployeeShifts([...employeeShifts, newAssignment]);
      
      // Vardiya çalışan sayısını güncelle
      const updatedShifts = shifts.map(s => 
        s.id === shift.id ? { ...s, employeeCount: s.employeeCount + 1 } : s
      );
      setShifts(updatedShifts);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    switch(newValue) {
      case 0:
        navigate('/shift');
        break;
      case 1:
        navigate('/shift/molalar');
        break;
      case 2:
        navigate('/shift/atamalar');
        break;
      default:
        navigate('/shift');
    }
  };

  // Silme butonuna tıklandığında çağrılacak fonksiyon
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
    <ThemeProvider theme={theme}>
      <div className="shift-page">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/employee')}
            >
              Çalışanlara Dön
            </Button>
          </Box>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 600 }}>
              Vardiya ve Mola Yönetimi
            </Typography>
            <Typography variant="body1" align="center" sx={{ opacity: 0.9, mb: 3 }}>
              Çalışanlarınızın vardiya ve molalarını kolayca yönetin
            </Typography>
            
            <Paper elevation={0} sx={{ borderRadius: 5, bgcolor: 'rgba(255,255,255,0.15)', p: 0.5 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                centered
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
                sx={{ 
                  '& .MuiTab-root': { 
                    py: 1.5,
                    color: 'white',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    opacity: 0.7,
                    '&.Mui-selected': {
                      opacity: 1,
                      fontWeight: 600,
                    }
                  }
                }}
              >
                <Tab icon={<ScheduleIcon />} label="Vardiyalar" iconPosition="start" />
                <Tab icon={<CoffeeIcon />} label="Molalar" iconPosition="start" />
                <Tab icon={<PeopleIcon />} label="Vardiya Atamaları" iconPosition="start" />
              </Tabs>
            </Paper>
          </Paper>

          {/* İçerik kısmı */}
          {activeTab === 0 && (
            <VardiyaYonetimi />
          )}
          
          {activeTab === 1 && (
            <MolaYonetimi 
              handleNewBreak={handleNewBreak} 
            />
          )}
          
          {activeTab === 2 && (
            <VardiyaAtama 
              employees={employees} 
              shifts={shifts} 
              employeeShifts={employeeShifts}
              handleAssignShift={handleAssignShift} 
            />
          )}
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default ShiftPage;
