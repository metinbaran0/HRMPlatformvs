import React, { useState } from 'react';
import ShiftList from '../components/molecules/ShiftList'; // ShiftList'i import et
import ShiftForm from '../components/molecules/ShiftForm';
import AssignShift from '../components/organisms/AssignShift';
import EmployeeShiftList from '../components/molecules/EmployeeShiftList';
import BreakList from '../components/molecules/BreakList';
import BreakForm from '../components/organisms/BreakForm';
import { Shift, EmployeeShift } from '../types/shift';

import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Divider,
  ThemeProvider,
  createTheme
} from '@mui/material';

// Material UI için tema oluşturma
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const ShiftPage: React.FC = () => {
  // **State Tanımlamaları**
  const [shifts, setShifts] = useState<Shift[]>([
    { id: 1, name: 'Sabah Vardiyası', startTime: '08:00', endTime: '16:00', employeeCount: 5 },
    { id: 2, name: 'Akşam Vardiyası', startTime: '16:00', endTime: '00:00', employeeCount: 3 },
  ]);
  
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([
    { id: 1, name: 'Ahmet' },
    { id: 2, name: 'Mehmet' }
  ]);

  const [breaks, setBreaks] = useState<{ id: number; breakType: string; startTime: string; endTime: string }[]>([
    { id: 1, breakType: 'Öğle Molası', startTime: '12:00', endTime: '13:00' }
  ]);

  // **Yeni vardiya ekleme fonksiyonu**
  const handleNewShift = (newShift: { name: string; startTime: string; endTime: string }) => {
    const shiftWithId = { ...newShift, id: shifts.length + 1, employeeCount: 0 }; // Add employeeCount
    setShifts([...shifts, shiftWithId]);
  };

  // **Çalışan vardiyaya atama fonksiyonu**
  const handleAssignShift = (assignment: { employeeId: number; shiftId: number }) => {
    console.log('Atama işlemi:', assignment);
    // Burada atama işlemleri yapılabilir
  };

  // **Yeni mola ekleme fonksiyonu**
  const handleNewBreak = (newBreak: { breakType: string; startTime: string; endTime: string }) => {
    const breakWithId = { ...newBreak, id: breaks.length + 1 };
    setBreaks([...breaks, breakWithId]);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Vardiya ve Mola Yönetimi
        </Typography>
        
        <Grid container spacing={3}>
          {/* Vardiya Yönetimi Bölümü */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary">
                Vardiya Yönetimi
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ShiftForm onSubmit={handleNewShift} />
              <Box sx={{ mt: 2 }}>
                {/* ShiftList'i burada kullanıyoruz */}
                <ShiftList shifts={shifts.map(shift => ({
                    id: shift.id, // Add id
                    shiftName: shift.name,
                    startTime: shift.startTime,
                    endTime: shift.endTime,
                    employeeCount: shift.employeeCount,
                }))} />
              </Box>
            </Paper>
          </Grid>

          {/* Çalışan Atama Bölümü */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary">
                Çalışan Atama
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <AssignShift 
                employees={employees} 
                shifts={shifts} 
                onAssign={handleAssignShift} 
              />
              <Box sx={{ mt: 2 }}>
    
              </Box>
            </Paper>
          </Grid>

          {/* Mola Yönetimi Bölümü */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom color="primary">
                Mola Yönetimi
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <BreakForm onSubmit={handleNewBreak} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <BreakList breaks={breaks} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default ShiftPage;
