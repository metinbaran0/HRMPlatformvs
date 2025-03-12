import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, FaSearch, FaCheckCircle, FaTimesCircle, 
  FaHourglassHalf, FaPlusCircle, FaFilter, FaEllipsisV 
} from 'react-icons/fa';
import { fetchPendingLeavesForManagerAsync, approveLeaveByManagerAsync, rejectLeaveByManagerAsync } from '../store/feature/LeaveSlice';
import { AppDispatch, RootState } from '../store';
import LeaveRequestForm from '../components/organisms/LeaveRequestForm';
import './LeaveRequestPage.css';
import { 
  Box, Container, Typography, Paper, Grid, Card, CardContent, 
  CardHeader, Avatar, Button, Chip, Divider, IconButton, 
  TextField, InputAdornment, Tab, Tabs, Badge, TableContainer, Table
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Özel stil bileşenleri
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
}));

const StatusChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: 'bold',
  fontSize: '0.75rem',
}));

const LeaveRequestPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { pendingLeaveRequests, loading } = useSelector((state: RootState) => state.leave);
  const navigate = useNavigate();

  useEffect(() => {
    // Bekleyen izin taleplerini yükle
    dispatch(fetchPendingLeavesForManagerAsync());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      case 'pending': return 'Onay Bekliyor';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <FaCheckCircle />;
      case 'rejected': return <FaTimesCircle />;
      case 'pending': return <FaHourglassHalf />;
      default: return <FaCalendarAlt />;
    }
  };

  const handleApprove = (request: { id: number, employeeId: number }) => {
    Swal.fire({
      title: 'İzin talebini onaylamak istediğinize emin misiniz?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Evet, Onayla',
      cancelButtonText: 'İptal'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(approveLeaveByManagerAsync(request.employeeId))
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Başarılı',
              text: 'İzin talebi onaylandı',
              timer: 2000,
              showConfirmButton: false
            });
            // Listeyi yenile
            dispatch(fetchPendingLeavesForManagerAsync());
          })
          .catch((error) => {
            console.error('Onaylama hatası:', error);
            Swal.fire({
              icon: 'error',
              title: 'Hata',
              text: error || 'İzin onaylanırken bir hata oluştu'
            });
          });
      }
    });
  };

  const handleReject = (employeeId: number) => {
    dispatch(rejectLeaveByManagerAsync(employeeId))
      .then(() => {
        dispatch(fetchPendingLeavesForManagerAsync());
      });
  };

  return (
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
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
          color: 'white',
          mb: 4
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 600 }}>
          İzin Talepleri
        </Typography>
        <Typography variant="body1" align="center" sx={{ opacity: 0.9 }}>
          Bekleyen izin taleplerini görüntüleyin ve yönetin
        </Typography>
      </Paper>

      {/* Bekleyen Talepler - Kart Görünümü */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Bekleyen Talepler
        </Typography>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography>Yükleniyor...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {pendingLeaveRequests.map((request) => (
              <Grid item xs={12} md={6} lg={4} key={request.id}>
                <StyledCard>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {request.employeeName?.charAt(0) || '?'}
                      </Avatar>
                    }
                    title={request.employeeName}
                    subheader={request.type}
                    action={
                      <StatusChip 
                        label={getStatusText(request.status)}
                        color={getStatusColor(request.status)}
                      />
                    }
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Başlangıç:</strong> {formatDate(request.startDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Bitiş:</strong> {formatDate(request.endDate)}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button 
                        size="small" 
                        color="success" 
                        variant="contained"
                        onClick={() => handleApprove({ id: request.id, employeeId: request.employeeId })}
                      >
                        Onayla
                      </Button>
                      <Button 
                        size="small" 
                        color="error" 
                        variant="outlined"
                        onClick={() => handleReject(request.id)}
                      >
                        Reddet
                      </Button>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default LeaveRequestPage; 