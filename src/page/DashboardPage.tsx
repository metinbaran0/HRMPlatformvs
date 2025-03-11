import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchExpiringSoonCompanies } from '../store/feature/companySlice';
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
  Button
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
  const { expiringSoonCompanies, loading } = useSelector((state: RootState) => state.companies);

  useEffect(() => {
    dispatch(fetchExpiringSoonCompanies());
  }, [dispatch]);

  const goToCompanyPage = () => {
    navigate('/company');
  };

  // Yaklaşan üyelik sonlandırmaları listesi
  const renderExpiringSubscriptions = () => {
    if (loading) {
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
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderRadius: 2,
              border: '1px solid #eee',
              background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Şirketler
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 600 }}>
              {dashboardData.companyCount}
            </Typography>
            <Typography variant="body2" sx={{ mt: 'auto' }}>
              Toplam kayıtlı şirket
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderRadius: 2,
              border: '1px solid #eee',
              background: 'linear-gradient(135deg, #f50057 0%, #ff4081 100%)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ManagerIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Yöneticiler
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 600 }}>
              {dashboardData.managerCount}
            </Typography>
            <Typography variant="body2" sx={{ mt: 'auto' }}>
              Toplam şirket yöneticisi
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderRadius: 2,
              border: '1px solid #eee',
              background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Çalışanlar
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 600 }}>
              {dashboardData.employeeCount}
            </Typography>
            <Typography variant="body2" sx={{ mt: 'auto' }}>
              Toplam kayıtlı personel
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderRadius: 2,
              border: '1px solid #eee',
              background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Aktif Üyelikler
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 600 }}>
              {dashboardData.activeSubscriptions}
            </Typography>
            <Typography variant="body2" sx={{ mt: 'auto' }}>
              Aktif şirket aboneliği
            </Typography>
          </Paper>
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
              Aylık Kayıt İstatistikleri
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dashboardData.monthlyRegistrations}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="companies" name="Şirketler" fill="#3f51b5" />
                <Bar dataKey="employees" name="Çalışanlar" fill="#f50057" />
              </BarChart>
            </ResponsiveContainer>
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