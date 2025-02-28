import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchLeaveRequestsAsync } from '../store/feature/LeaveSlice';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  TextField,
  MenuItem,
  TablePagination,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
import Navbar from '../components/organisms/Navbar';
import LeaveRequestForm from '../components/organisms/LeaveRequestForm';
import { useParams } from 'react-router';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { leaveRequests, loading, error } = useSelector((state: RootState) => state.leave);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState('all');
  const { userId } = useParams(); // URL'den userId'yi al

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchLeaveRequestsAsync());
    }
  }, [dispatch, isAuthenticated]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      default: return 'Beklemede';
    }
  };

  const filteredRequests = leaveRequests.filter(request => 
    filterStatus === 'all' ? true : request.status === filterStatus
  );

  if (!isAuthenticated) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Bu sayfayı görüntülemek için lütfen giriş yapın.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Profil Bilgileri Kartı */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Profil Bilgileri" />
              <Divider />
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                  <Box
                    component="img"
                    src="https://via.placeholder.com/150"
                    alt="Profil Fotoğrafı"
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      mb: 2
                    }}
                  />
                  <Typography variant="h6">Ahmet Yılmaz</Typography>
                  <Typography color="textSecondary">Yazılım Geliştirici</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Çalışan ID:</strong> #12345
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>E-posta:</strong> ahmet.yilmaz@email.com
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Telefon:</strong> +90 555 123 4567
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Departman:</strong> Yazılım Geliştirme
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Yönetici:</strong> Mehmet Demir
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>İşe Başlama Tarihi:</strong> 01/01/2024
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    İzin Durumu
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                        <Typography variant="h6">14</Typography>
                        <Typography variant="caption">Kalan İzin</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                        <Typography variant="h6">5</Typography>
                        <Typography variant="caption">Kullanılan İzin</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sağ taraftaki içerik - İzin Talepleri */}
          <Grid item xs={12} md={8}>
            {/* Yeni İzin Talebi Kartı */}
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title="Yeni İzin Talebi"
                action={
                  <IconButton onClick={() => setShowForm(!showForm)}>
                    <AddIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                {showForm ? (
                  <LeaveRequestForm onSubmit={() => {
                    setShowForm(false);
                    dispatch(fetchLeaveRequestsAsync());
                  }} />
                ) : (
                  <Typography color="textSecondary" align="center">
                    Yeni izin talebi oluşturmak için + butonuna tıklayın
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* İzin Talepleri Listesi Kartı */}
            <Card>
              <CardHeader
                title="İzin Taleplerim"
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                      select
                      size="small"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="all">Tümü</MenuItem>
                      <MenuItem value="pending">Beklemede</MenuItem>
                      <MenuItem value="approved">Onaylandı</MenuItem>
                      <MenuItem value="rejected">Reddedildi</MenuItem>
                    </TextField>
                    <IconButton>
                      <FilterIcon />
                    </IconButton>
                  </Box>
                }
              />
              <Divider />
              <CardContent>
                {loading ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Alert severity="error">{error}</Alert>
                ) : (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>İzin Türü</TableCell>
                            <TableCell>Başlangıç</TableCell>
                            <TableCell>Bitiş</TableCell>
                            <TableCell>Açıklama</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell>Yanıt</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredRequests
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((request) => (
                              <TableRow key={request.id}>
                                <TableCell>{request.type}</TableCell>
                                <TableCell>{request.startDate}</TableCell>
                                <TableCell>{request.endDate}</TableCell>
                                <TableCell>{request.description}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={getStatusLabel(request.status)}
                                    color={getStatusColor(request.status)}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>{request.responseMessage || "-"}</TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      component="div"
                      count={filteredRequests.length}
                      page={page}
                      onPageChange={(e, newPage) => setPage(newPage)}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                      }}
                      labelRowsPerPage="Sayfa başına satır"
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProfilePage;
