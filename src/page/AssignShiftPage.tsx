import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AssignShift from '../components/organisms/AssignShift';
import { Shift } from '../types/shift';
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

interface AssignShiftPageProps {
  employees: { id: number; name: string }[];
  shifts: Shift[];
  onAssign: (assignment: { employeeId: number; shiftId: number }) => void;
}

const AssignShiftPage: React.FC<AssignShiftPageProps> = ({ employees, shifts, onAssign }) => {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Çalışan Atama
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <AssignShift employees={employees} shifts={shifts} onAssign={onAssign} />
          <Box sx={{ mt: 2 }}>
            <Link to="/">Vardiya ve Mola Yönetimi Sayfasına Geri Dön</Link>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default AssignShiftPage; 