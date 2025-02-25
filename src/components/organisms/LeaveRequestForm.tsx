import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';

const leaveTypes = [
  { value: 'ANNUAL', label: 'Yıllık İzin' },
  { value: 'MARRIAGE', label: 'Evlilik İzni' },
  { value: 'MATERNITY', label: 'Doğum İzni' },
  { value: 'UNPAID', label: 'Ücretsiz İzin' }
];

interface LeaveRequestFormProps {
  onSubmit: () => void;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: '',
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              select
              label="İzin Türü"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              required
              sx={{ backgroundColor: 'white' }}
            >
              {leaveTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Başlangıç Tarihi"
              value={formData.startDate}
              onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
              format="DD/MM/YYYY"
              slotProps={{ 
                textField: { 
                  fullWidth: true, 
                  required: true,
                  sx: { backgroundColor: 'white' }
                } 
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Bitiş Tarihi"
              value={formData.endDate}
              onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
              format="DD/MM/YYYY"
              slotProps={{ 
                textField: { 
                  fullWidth: true, 
                  required: true,
                  sx: { backgroundColor: 'white' }
                } 
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Açıklama"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
            sx={{ 
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
                minWidth: '200px',
                height: '48px'
              }}
            >
              İzin Talebi Gönder
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeaveRequestForm;