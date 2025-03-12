import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button
} from '@mui/material';
import { BreakRequestDto } from '../../store/feature/breakSlice';
import { Break } from '../../store/feature/breakSlice';

interface BreakFormProps {
  onSubmit: (breakData: BreakRequestDto) => void;
  initialData?: Break;
}

const BreakForm: React.FC<BreakFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<BreakRequestDto>({
    shiftId: initialData?.shiftId || 1,
    breakName: initialData?.breakName || '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.breakName && formData.startTime && formData.endTime) {
      onSubmit(formData);
      // Form'u temizle
      setFormData({
        shiftId: 1,
        breakName: '',
        startTime: '',
        endTime: ''
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Mola Adı"
        value={formData.breakName}
        onChange={(e) => setFormData({ ...formData, breakName: e.target.value })}
        required
      />

      <TextField
        fullWidth
        label="Başlangıç Zamanı"
        type="datetime-local"
        value={formData.startTime}
        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
        InputLabelProps={{ shrink: true }}
        required
      />

      <TextField
        fullWidth
        label="Bitiş Zamanı"
        type="datetime-local"
        value={formData.endTime}
        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
        InputLabelProps={{ shrink: true }}
        required
      />
    </Box>
  );
};

export default BreakForm;
