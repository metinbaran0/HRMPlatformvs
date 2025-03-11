import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchExpiringSoonCompanies } from '../store/feature/companySlice';
import { fetchDashboardSummaryAsync, fetchMonthlyStatsAsync } from '../store/feature/DashboardSlice';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  SupervisorAccount as ManagerIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './DashboardPage.css';

// Örnek veri
const dashboardData = {
  companyCount: 45,
  managerCount: 78,
  employeeCount: 342,
  activeSubscriptions: 38,
  expiringSubscriptions: [
    { id: 1, companyName: 'ABC Teknoloji', expiryDate: '2023-12-15' },
    { id: 2, companyName: 'XYZ Yazılım', expiryDate: '2023-12-18' },
    { id: 3, companyName: 'Mega Holding', expiryDate: '2023-12-22' },
  ],
  publicHolidays: [
    { id: 1, name: 'Yılbaşı', date: '2024-01-01' },
    { id: 2, name: 'Ulusal Egemenlik ve Çocuk Bayramı', date: '2024-04-23' },
    { id: 3, name: 'Emek ve Dayanışma Günü', date: '2024-05-01' },
    { id: 4, name: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı', date: '2024-05-19' },
  ],
  sectorDistribution: [
    { name: 'Teknoloji', value: 18 },
    { name: 'Finans', value: 8 },
    { name: 'Eğitim', value: 6 },
    { name: 'Sağlık', value: 5 },
    { name: 'Üretim', value: 8 },
  ],
  monthlyRegistrations: [
    { name: 'Oca', companies: 3, employees: 24 },
    { name: 'Şub', companies: 4, employees: 32 },
    { name: 'Mar', companies: 2, employees: 18 },
    { name: 'Nis', companies: 5, employees: 41 },
    { name: 'May', companies: 7, employees: 56 },
    { name: 'Haz', companies: 4, employees: 29 },
  ]
};

// Renk paleti
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Tarih formatı
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('tr-TR', options);
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { expiringSoonCompanies, loading: companyLoading } = useSelector((state: RootState) => state.companies);
  const { summary, monthlyStats, loading: dashboardLoading, statsLoading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummaryAsync());
    dispatch(fetchExpiringSoonCompanies());
    dispatch(fetchMonthlyStatsAsync(new Date().getFullYear()));
  }, [dispatch]);

  const goToCompanyPage = () => {
    navigate('/company');
  };

  // Yaklaşan üyelik sonlandırmaları listesi
  const renderExpiringSubscriptions = () => {
    if (companyLoading) {
      return <div>Yükleniyor...</div>;
    }

    return (
      <Paper 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          border: '1px solid #eee',
          height: '100%'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Yaklaşan Üyelik Sonlandırmaları
        </Typography>
        <List>
          {expiringSoonCompanies.map((company) => (
            <ListItem key={company.id} divider>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary={company.name}
                secondary={`Bitiş Tarihi: ${formatDate(company.subscriptionEndDate)}`}
              />
            </ListItem>
          ))}
        </List>
        {expiringSoonCompanies.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
            Yaklaşan üyelik sonlandırması bulunmuyor.
          </Typography>
        )}
      </Paper>
    );
  };

  // Aylık istatistikleri grafiğe dönüştüren fonksiyon
  const prepareMonthlyStatsData = () => {
    if (!monthlyStats) return dashboardData.monthlyRegistrations;
    
    const months = Object.keys(monthlyStats);
    
    return months.map(month => ({
      name: month.substring(0, 3), // İlk 3 harfi al (Oca, Şub, vb.)
      companies: monthlyStats[month],
      employees: 0 // API'den çalışan sayısı gelmediği için 0 olarak bırakıyoruz
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Yönetim Paneli
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          endIcon={<ArrowForwardIcon />}
          onClick={goToCompanyPage}
        >
          Şirket Yönetimine Git
        </Button>
      </Box>
      
      {/* Özet Kartlar */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Şirket Sayısı Kartı */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Typography variant="h5" component="div">
                  Şirketler
                </Typography>
              </Box>
              {dashboardLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  {summary?.totalCompanies ?? dashboardData.companyCount}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Toplam kayıtlı şirket sayısı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Yönetici Sayısı Kartı */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', bgcolor: '#fff8e1', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ManagerIcon sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
                <Typography variant="h5" component="div">
                  Yöneticiler
                </Typography>
              </Box>
              {dashboardLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                  {summary?.totalAdmins ?? dashboardData.managerCount}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Toplam kayıtlı yönetici sayısı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Çalışan Sayısı Kartı */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', bgcolor: '#e8f5e9', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                <Typography variant="h5" component="div">
                  Çalışanlar
                </Typography>
              </Box>
              {dashboardLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  {summary?.totalEmployees ?? dashboardData.employeeCount}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Toplam kayıtlı çalışan sayısı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Grafikler ve Listeler */}
      <Grid container spacing={3}>
        {/* Aylık Kayıtlar Grafiği */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: '1px solid #eee',
              height: '100%'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Aylık Şirket Kayıtları ({new Date().getFullYear()})
            </Typography>
            {statsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={prepareMonthlyStatsData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="companies" name="Şirketler" fill="#3f51b5" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        
        {/* Sektör Dağılımı */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: '1px solid #eee',
              height: '100%'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Sektör Dağılımı
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.sectorDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardData.sectorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Yaklaşan Üyelik Sonlandırmaları */}
        <Grid item xs={12} md={6}>
          {renderExpiringSubscriptions()}
        </Grid>
        
        {/* Resmi Tatiller */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: '1px solid #eee',
              height: '100%'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Resmi Tatiller
            </Typography>
            <List>
              {dashboardData.publicHolidays.map((holiday) => (
                <ListItem key={holiday.id} divider>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={holiday.name} 
                    secondary={formatDate(holiday.date)}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 