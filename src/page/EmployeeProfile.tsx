import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Container, 
  Button, 
  Typography, 
  Tabs, 
  Tab, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  Avatar, 
  IconButton,
  useTheme,
  useMediaQuery,
  Badge,
  LinearProgress,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Event as EventIcon, 
  Inventory as InventoryIcon, 
  Receipt as ReceiptIcon, 
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import EmployeeForm from '../components/organisms/EmployeeFrom';
import ShiftForm from '../components/organisms/ShiftForm';
import LeaveRequestForm from '../components/organisms/LeaveRequestForm';
import ExpenseForm from '../components/organisms/ExpenseForm';
import AssetForm from '../components/organisms/AssetForm';
import { useNavigate } from 'react-router-dom';

const EmployeeProfile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Örnek veri
  const employeeData = {
    name: "Ahmet Yılmaz",
    position: "Yazılım Geliştirici",
    department: "Bilgi Teknolojileri",
    email: "ahmet.yilmaz@sirket.com",
    phone: "+90 555 123 4567",
    avatar: null,
    leaveBalance: 14,
    totalLeave: 20,
    upcomingShift: "Pazartesi, 08:00 - 17:00"
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleLogout = () => {
    // Token'ı temizle
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    
    // Anasayfaya yönlendir
    navigate('/');
  };

  const renderTabContent = () => {
    if (showForm) {
      switch (activeTab) {
        case 0: // Profil
          return <EmployeeForm />;
        case 1: // İzinler
          return <LeaveRequestForm onClose={() => setActiveTab(0)} />;
        case 2: // Zimmetler
          return <AssetForm onSubmit={() => {}} />;
        case 3: // Harcamalar
          return <ExpenseForm onSubmit={() => {}} />;
        case 4: // Vardiyalar
          return <ShiftForm onSubmit={() => {}} />;
        default:
          return null;
      }
    }

    switch (activeTab) {
      case 0: // Profil
        return renderProfileTab();
      case 1: // İzinler
        return renderLeavesTab();
      case 2: // Zimmetler
        return renderAssetsTab();
      case 3: // Harcamalar
        return renderExpensesTab();
      case 4: // Vardiyalar
        return renderShiftsTab();
      default:
        return null;
    }
  };

  const renderProfileTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee', height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <Avatar 
              sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main' }}
              src={employeeData.avatar || undefined}
            >
              {employeeData.name.charAt(0)}
            </Avatar>
            <Typography variant="h5" gutterBottom>{employeeData.name}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>{employeeData.position}</Typography>
            <Typography variant="body2" color="text.secondary">{employeeData.department}</Typography>
            
            <Divider sx={{ width: '100%', my: 2 }} />
            
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" gutterBottom>
                <strong>E-posta:</strong> {employeeData.email}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Telefon:</strong> {employeeData.phone}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">İzin Durumu</Typography>
                </Box>
                <Typography variant="body2" gutterBottom>Kalan İzin: {employeeData.leaveBalance} gün</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(employeeData.leaveBalance / employeeData.totalLeave) * 100} 
                  sx={{ mt: 1, mb: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {employeeData.leaveBalance} / {employeeData.totalLeave} gün
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Sonraki Vardiya</Typography>
                </Box>
                <Typography variant="body2">{employeeData.upcomingShift}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Kişisel Bilgiler</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Doğum Tarihi:</strong> 01.01.1990
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>TC Kimlik No:</strong> •••• •••• •••• 1234
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>İşe Başlama Tarihi:</strong> 01.06.2020
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Adres:</strong> Örnek Mahallesi, Örnek Sokak No:1, İstanbul
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Acil Durumda Aranacak Kişi:</strong> Mehmet Yılmaz
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Acil Durum Telefonu:</strong> +90 555 987 6543
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderLeavesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">İzin Talepleri</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddNew}
        >
          Yeni İzin Talebi
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {[
          { id: 1, type: 'Yıllık İzin', startDate: '15.07.2023', endDate: '22.07.2023', days: 5, status: 'Onaylandı', approver: 'Mehmet Kaya', approveDate: '01.07.2023' },
          { id: 2, type: 'Hastalık İzni', startDate: '05.09.2023', endDate: '07.09.2023', days: 3, status: 'Beklemede', approver: '-', approveDate: '-' },
          { id: 3, type: 'İdari İzin', startDate: '10.10.2023', endDate: '10.10.2023', days: 1, status: 'Reddedildi', approver: 'Ayşe Demir', approveDate: '05.10.2023' }
        ].map(leave => (
          <Grid item xs={12} sm={6} md={4} key={leave.id}>
            <Card elevation={0} sx={{ 
              borderRadius: 2, 
              border: '1px solid #eee',
              borderLeft: '5px solid',
              borderLeftColor: 
                leave.status === 'Onaylandı' ? 'success.main' : 
                leave.status === 'Reddedildi' ? 'error.main' : 
                'warning.main'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{leave.type}</Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Tarih:</strong> {leave.startDate} - {leave.endDate}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Süre:</strong> {leave.days} gün
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 
                        leave.status === 'Onaylandı' ? 'success.main' : 
                        leave.status === 'Reddedildi' ? 'error.main' : 
                        'warning.main'
                    }}
                  >
                    {leave.status}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {leave.approver !== '-' ? `${leave.approver} tarafından ${leave.approveDate}` : ''}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderAssetsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Zimmetler</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddNew}
        >
          Yeni Zimmet Ekle
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {[
          { id: 1, name: 'Laptop', brand: 'MacBook Pro', model: '2022', serialNumber: 'MBP2022123456', assignDate: '01.06.2020', status: 'Aktif' },
          { id: 2, name: 'Telefon', brand: 'iPhone', model: '13 Pro', serialNumber: 'IP13P987654', assignDate: '15.01.2022', status: 'Aktif' },
          { id: 3, name: 'Monitör', brand: 'Dell', model: 'U2720Q', serialNumber: 'DU2720Q567890', assignDate: '01.06.2020', status: 'İade Edildi' }
        ].map(asset => (
          <Grid item xs={12} sm={6} md={4} key={asset.id}>
            <Card elevation={0} sx={{ 
              borderRadius: 2, 
              border: '1px solid #eee',
              height: '100%'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{asset.name}</Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Marka/Model:</strong> {asset.brand} {asset.model}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Seri No:</strong> {asset.serialNumber}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Zimmet Tarihi:</strong> {asset.assignDate}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: asset.status === 'Aktif' ? 'success.main' : 'text.secondary'
                    }}
                  >
                    {asset.status}
                  </Typography>
                  <Button size="small" variant="outlined">
                    Detaylar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderExpensesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Harcamalar</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddNew}
        >
          Yeni Harcama Ekle
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {[
          { id: 1, type: 'Seyahat', amount: 1250, date: '10.06.2023', description: 'İstanbul-Ankara uçak bileti', status: 'Onaylandı' },
          { id: 2, type: 'Yemek', amount: 350, date: '15.06.2023', description: 'Müşteri yemeği', status: 'Beklemede' },
          { id: 3, type: 'Eğitim', amount: 2500, date: '01.07.2023', description: 'React eğitimi', status: 'Onaylandı' }
        ].map(expense => (
          <Grid item xs={12} sm={6} md={4} key={expense.id}>
            <Card elevation={0} sx={{ 
              borderRadius: 2, 
              border: '1px solid #eee',
              borderLeft: '5px solid',
              borderLeftColor: 
                expense.status === 'Onaylandı' ? 'success.main' : 
                expense.status === 'Reddedildi' ? 'error.main' : 
                'warning.main'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom>{expense.type}</Typography>
                  <Typography variant="h6" color="primary.main">{expense.amount} ₺</Typography>
                </Box>
                <Typography variant="body2" gutterBottom>
                  <strong>Tarih:</strong> {expense.date}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Açıklama:</strong> {expense.description}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 
                        expense.status === 'Onaylandı' ? 'success.main' : 
                        expense.status === 'Reddedildi' ? 'error.main' : 
                        'warning.main'
                    }}
                  >
                    {expense.status}
                  </Typography>
                  <Button size="small" variant="outlined">
                    Detaylar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderShiftsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Vardiyalar</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddNew}
        >
          Yeni Vardiya Ekle
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {[
          { id: 1, date: '12.06.2023', day: 'Pazartesi', startTime: '08:00', endTime: '17:00', type: 'Gündüz' },
          { id: 2, date: '13.06.2023', day: 'Salı', startTime: '08:00', endTime: '17:00', type: 'Gündüz' },
          { id: 3, date: '14.06.2023', day: 'Çarşamba', startTime: '08:00', endTime: '17:00', type: 'Gündüz' },
          { id: 4, date: '15.06.2023', day: 'Perşembe', startTime: '08:00', endTime: '17:00', type: 'Gündüz' },
          { id: 5, date: '16.06.2023', day: 'Cuma', startTime: '08:00', endTime: '17:00', type: 'Gündüz' },
          { id: 6, date: '19.06.2023', day: 'Pazartesi', startTime: '16:00', endTime: '00:00', type: 'Akşam' }
        ].map(shift => (
          <Grid item xs={12} sm={6} md={4} key={shift.id}>
            <Card elevation={0} sx={{ 
              borderRadius: 2, 
              border: '1px solid #eee',
              borderLeft: '5px solid',
              borderLeftColor: 
                shift.type === 'Gündüz' ? 'primary.main' : 
                shift.type === 'Akşam' ? 'warning.main' : 
                'secondary.main'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{shift.day}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {shift.date}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                  <ScheduleIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body1">
                    {shift.startTime} - {shift.endTime}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 
                      shift.type === 'Gündüz' ? 'primary.main' : 
                      shift.type === 'Akşam' ? 'warning.main' : 
                      'secondary.main'
                  }}
                >
                  {shift.type} Vardiyası
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Üst Menü Çubuğu */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Çalışan Portalı
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
          >
            Çıkış Yap
          </Button>
        </Toolbar>
      </AppBar>

      {/* Ana İçerik */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
          <Typography variant="h4" gutterBottom>Çalışan Profili</Typography>
          <Typography variant="body1">Kişisel bilgilerinizi, izinlerinizi ve diğer detayları görüntüleyin ve yönetin</Typography>
        </Paper>

        {/* Tabs */}
        <Paper elevation={0} sx={{ borderRadius: 2, mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : undefined}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<PersonIcon />} label="Profil" iconPosition="start" />
            <Tab icon={<EventIcon />} label="İzinler" iconPosition="start" />
            <Tab icon={<InventoryIcon />} label="Zimmetler" iconPosition="start" />
            <Tab icon={<ReceiptIcon />} label="Harcamalar" iconPosition="start" />
            <Tab icon={<ScheduleIcon />} label="Vardiyalar" iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Form or Content */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          {showForm && (
            <Box sx={{ mb: 3 }}>
              <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={handleCloseForm}
                sx={{ mb: 2 }}
              >
                Geri Dön
              </Button>
            </Box>
          )}
          
          {renderTabContent()}
        </Paper>
      </Container>
    </Box>
  );
};

export default EmployeeProfile;
