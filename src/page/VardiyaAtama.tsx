import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Container,
  Paper, 
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton
} from '@mui/material';
import { AppDispatch } from '../store';
import { fetchEmployees } from '../store/feature/employeeSlice';
import { fetchShiftsAsync } from '../store/feature/ShiftSlice';
import { createEmployeeShiftAsync } from '../store/feature/employeeShiftSlice';
import { Add as AddIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface VardiyaAtamaProps {
  employees: any[];
  shifts: any[];
  employeeShifts: any[];
  handleAssignShift: (assignment: any) => void;
}

const VardiyaAtama: React.FC<VardiyaAtamaProps> = ({ 
  employees, 
  shifts, 
  employeeShifts, 
  handleAssignShift 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Component yüklendiğinde verileri çek
    dispatch(fetchEmployees({}));
    dispatch(fetchShiftsAsync());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!selectedEmployee || !selectedShift) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Lütfen çalışan ve vardiya seçiniz'
      });
      return;
    }

    try {
      await dispatch(createEmployeeShiftAsync({
        employeeId: Number(selectedEmployee),
        shiftId: Number(selectedShift)
      })).unwrap();

      setOpen(false);
      setSelectedEmployee('');
      setSelectedShift('');

      Swal.fire({
        icon: 'success',
        title: 'Başarılı',
        text: 'Vardiya ataması başarıyla yapıldı',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: error.message || 'Vardiya atama işlemi başarısız oldu'
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/shift')}
          sx={{ mb: 2 }}
        >
          Vardiyalara Dön
        </Button>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
          color: 'white',
          mb: 4
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 600 }}>
          Vardiya Atamaları
        </Typography>
        <Typography variant="body1" align="center" sx={{ opacity: 0.9, mb: 3 }}>
          Çalışanlarınıza vardiya atamalarını yapın
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Vardiya Listesi</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Yeni Vardiya Ata
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Çalışan</TableCell>
                <TableCell>Vardiya</TableCell>
                <TableCell>Başlangıç</TableCell>
                <TableCell>Bitiş</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeShifts.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.employeeName}</TableCell>
                  <TableCell>{assignment.shiftName}</TableCell>
                  <TableCell>{shifts.find(s => s.id === assignment.shiftId)?.startTime}</TableCell>
                  <TableCell>{shifts.find(s => s.id === assignment.shiftId)?.endTime}</TableCell>
                  <TableCell>{new Date(assignment.date).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Atama Dialog'u */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Vardiya Ataması</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Çalışan</InputLabel>
              <Select
                value={selectedEmployee}
                label="Çalışan"
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                {employees.map((emp: any) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name} {emp.surname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Vardiya</InputLabel>
              <Select
                value={selectedShift}
                label="Vardiya"
                onChange={(e) => setSelectedShift(e.target.value)}
              >
                {shifts.map((shift: any) => (
                  <MenuItem key={shift.id} value={shift.id}>
                    {shift.name} ({shift.startTime} - {shift.endTime})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            Ata
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VardiyaAtama; 