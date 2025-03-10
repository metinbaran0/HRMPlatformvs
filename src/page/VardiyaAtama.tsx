import React, { useState } from 'react';
import { Shift, EmployeeShift } from '../types/shift';
import AssignShift from '../components/organisms/AssignShift';
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
  Avatar,
  Container,
  ThemeProvider,
  createTheme,
  Chip,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon
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

interface VardiyaAtamaProps {
  employees?: { id: number; name: string }[];
  shifts?: Shift[];
  employeeShifts?: EmployeeShift[];
  handleAssignShift?: (assignment: { employeeId: number; shiftId: number; date: string }) => void;
}

const VardiyaAtama: React.FC<VardiyaAtamaProps> = ({ 
  employees = [
    { id: 1, name: 'Ahmet Yılmaz' },
    { id: 2, name: 'Mehmet Kaya' },
    { id: 3, name: 'Ayşe Demir' },
    { id: 4, name: 'Fatma Şahin' }
  ], 
  shifts = [
    { id: 1, name: 'Sabah Vardiyası', startTime: '08:00', endTime: '16:00', employeeCount: 5 },
    { id: 2, name: 'Akşam Vardiyası', startTime: '16:00', endTime: '00:00', employeeCount: 3 },
    { id: 3, name: 'Gece Vardiyası', startTime: '00:00', endTime: '08:00', employeeCount: 2 },
  ],
  employeeShifts = [
    { id: 1, employeeId: 1, employeeName: 'Ahmet Yılmaz', shiftId: 1, shiftName: 'Sabah Vardiyası', date: '2023-05-15' },
    { id: 2, employeeId: 2, employeeName: 'Mehmet Kaya', shiftId: 2, shiftName: 'Akşam Vardiyası', date: '2023-05-15' },
    { id: 3, employeeId: 3, employeeName: 'Ayşe Demir', shiftId: 3, shiftName: 'Gece Vardiyası', date: '2023-05-16' }
  ],
  handleAssignShift = () => {} 
}) => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Tarihi formatla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Vardiya rengini belirle
  const getShiftColor = (shiftName: string) => {
    if (shiftName.includes('Sabah')) return '#4caf50';
    if (shiftName.includes('Akşam')) return '#ff9800';
    if (shiftName.includes('Gece')) return '#9c27b0';
    return '#3f51b5';
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
            Vardiya Atamaları
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Çalışanlarınıza vardiya atayın ve mevcut atamaları yönetin
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
              Vardiya Atamaları
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Toplam {employeeShifts.length} atama yapılmış
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
            {showForm ? 'Formu Kapat' : 'Yeni Atama Yap'}
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
              Vardiya Ata
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <AssignShift 
              employees={employees} 
              shifts={shifts} 
              onAssign={handleAssignShift} 
            />
          </Paper>
        )}

        <Grid container spacing={3}>
          {employeeShifts.map(assignment => (
            <Grid item xs={12} sm={6} md={4} key={assignment.id}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  },
                  border: '1px solid #e0e0e0',
                  borderRadius: 3
                }}
              >
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(63, 81, 181, 0.05)', 
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Tooltip title={assignment.shiftName}>
                        <Avatar 
                          sx={{ 
                            width: 22, 
                            height: 22, 
                            bgcolor: getShiftColor(assignment.shiftName),
                            border: '2px solid white'
                          }}
                        >
                          <ScheduleIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                      </Tooltip>
                    }
                  >
                    <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                      {assignment.employeeName.charAt(0)}
                    </Avatar>
                  </Badge>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {assignment.employeeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {assignment.employeeId}
                    </Typography>
                  </Box>
                </Box>
                
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScheduleIcon fontSize="small" sx={{ mr: 1, color: getShiftColor(assignment.shiftName) }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {assignment.shiftName}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      {formatDate(assignment.date)}
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ px: 2, pb: 2, justifyContent: 'flex-end' }}>
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
                    Atamayı Kaldır
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

export default VardiyaAtama; 