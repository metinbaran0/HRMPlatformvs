import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  MenuItem
} from '@mui/material';
import Navbar from '../components/organisms/Navbar';

const companyTypes = [
  { value: 'small', label: '1-50 Çalışan' },
  { value: 'medium', label: '51-200 Çalışan' },
  { value: 'large', label: '200+ Çalışan' }
];

const GetQuote = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form gönderme işlemleri
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Teklif Al
          </Typography>
          <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
            Şirketiniz için en uygun İK çözümünü sunalım
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Şirket Adı"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="İletişim Kişisi"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-posta"
                  type="email"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefon"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Şirket Büyüklüğü"
                  required
                >
                  {companyTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mesajınız"
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Teklif İste
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default GetQuote; 