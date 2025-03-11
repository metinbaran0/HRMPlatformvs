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
  TextField, InputAdornment, Tab, Tabs, Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';

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
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);

  useEffect(() => {
    // Başlangıçta örnek verileri yükle
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    // API çağrıları buraya gelecek
    // Örnek veri
    const mockData = [
      { id: 1, employeeName: 'Ahmet Yılmaz', startDate: '2024-03-15', endDate: '2024-03-20', status: 'pending', type: 'ANNUAL' },
      { id: 2, employeeName: 'Ayşe Demir', startDate: '2024-03-25', endDate: '2024-03-28', status: 'approved', type: 'MARRIAGE' },
    ];
    setLeaveRequests(mockData);
  };

  // Onay bekleyenlere tıklandığında çalışacak fonksiyon
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 1) { // Onay bekleyenler sekmesi
      dispatch(fetchPendingLeavesForManagerAsync());
    }
  };

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

  // Aktif sekmeye göre gösterilecek verileri belirle
  const displayedRequests = activeTab === 1 && Array.isArray(pendingLeaveRequests) 
    ? pendingLeaveRequests 
    : leaveRequests.filter(req => {
        if (activeTab === 0) return true;
        if (activeTab === 2) return req.status === 'approved';
        return false;
      });

  const handleApprove = (employeeId: number) => {
    dispatch(approveLeaveByManagerAsync(employeeId))
      .then(() => {
        dispatch(fetchPendingLeavesForManagerAsync());
      });
  };

  const handleReject = (employeeId: number) => {
    dispatch(rejectLeaveByManagerAsync(employeeId))
      .then(() => {
        dispatch(fetchPendingLeavesForManagerAsync());
      });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Başlık */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaCalendarAlt /> İzin Talepleri
            </Typography>
            <Typography variant="body1">
              İzin taleplerini görüntüleyin ve yönetin
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<FaPlusCircle />}
            onClick={() => setShowForm(true)}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
            }}
          >
            Yeni İzin Talebi
          </Button>
        </Box>
      </Paper>

      {/* Ana İçerik */}
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Sekmeler */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: '#f5f7fa',
            '& .MuiTab-root': { py: 2 }
          }}
        >
          <Tab 
            label="Tüm Talepler" 
            icon={<Badge badgeContent={leaveRequests.length} color="primary">
              <FaCalendarAlt />
            </Badge>} 
            iconPosition="start"
          />
          <Tab 
            label="Onay Bekleyenler" 
            icon={<Badge badgeContent={Array.isArray(pendingLeaveRequests) ? pendingLeaveRequests.length : 0} color="warning">
              <FaHourglassHalf />
            </Badge>} 
            iconPosition="start"
          />
          <Tab 
            label="Onaylananlar" 
            icon={<Badge badgeContent={leaveRequests.filter(r => r.status === 'approved').length} color="success">
              <FaCheckCircle />
            </Badge>} 
            iconPosition="start"
          />
        </Tabs>

        {/* Arama ve Filtreleme */}
        <Box sx={{ p: 2, bgcolor: '#f5f7fa', display: 'flex', alignItems: 'center' }}>
          <TextField
            placeholder="İzin talebi ara..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ maxWidth: 400, mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch />
                </InputAdornment>
              ),
            }}
          />
          <IconButton color="primary">
            <FaFilter />
          </IconButton>
        </Box>

        {/* İzin Talepleri Listesi */}
        <Box sx={{ p: 3 }}>
          {activeTab === 1 && loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Onay bekleyen talepler yükleniyor...</Typography>
            </Box>
          ) : displayedRequests.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Gösterilecek izin talebi bulunamadı.</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {displayedRequests.map((request) => (
                <Grid item xs={12} sm={6} md={4} key={request.id}>
                  <StyledCard>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: getStatusColor(request.status) === 'success' ? '#2ecc71' : 
                                              getStatusColor(request.status) === 'warning' ? '#f39c12' : 
                                              getStatusColor(request.status) === 'error' ? '#e74c3c' : '#3498db' }}>
                          {(request.employeeName || '').charAt(0).toUpperCase()}
                        </Avatar>
                      }
                      action={
                        <IconButton>
                          <FaEllipsisV />
                        </IconButton>
                      }
                      title={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {request.employeeName || 
                           (request.employeeId ? `Çalışan #${request.employeeId}` : 'İsimsiz Çalışan')}
                        </Typography>
                      }
                      subheader={
                        <StatusChip 
                          size="small"
                          label={getStatusText(request.status)}
                          color={getStatusColor(request.status) as any}
                          icon={getStatusIcon(request.status)}
                        />
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          İzin Türü
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {request.leaveType || request.type}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Tarih Aralığı
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(request.startDate)} - {formatDate(request.endDate)}
                        </Typography>
                      </Box>
                      
                      {request.reason && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Sebep
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {request.reason}
                          </Typography>
                        </Box>
                      )}
                      
                      {request.createdAt && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Talep Tarihi
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatDate(request.createdAt)}
                          </Typography>
                        </Box>
                      )}
                      
                      {request.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button 
                            variant="contained" 
                            color="success" 
                            fullWidth
                            startIcon={<FaCheckCircle />}
                            onClick={() => handleApprove(request.employeeId)}
                          >
                            Onayla
                          </Button>
                          <Button 
                            variant="contained" 
                            color="error" 
                            fullWidth
                            startIcon={<FaTimesCircle />}
                            onClick={() => handleReject(request.employeeId)}
                          >
                            Reddet
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Paper>

      {/* İzin Talebi Formu Modal */}
      {showForm && <LeaveRequestForm onClose={() => setShowForm(false)} />}
    </Container>
  );
};

export default LeaveRequestPage; 