import React, { useState } from 'react';
import { Shift, EmployeeShift } from '../../types/shift';
import AssignShift from '../organisms/AssignShift';
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Paper,
  Divider,
  Avatar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

interface VardiyaAtamaProps {
  employees: { id: number; name: string }[];
  shifts: Shift[];
  employeeShifts: EmployeeShift[];
  handleAssignShift: (assignment: { employeeId: number; shiftId: number; date: string }) => void;
}

const VardiyaAtama: React.FC<VardiyaAtamaProps> = ({ 
  employees, 
  shifts, 
  employeeShifts, 
  handleAssignShift 
}) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h2" color="primary" sx={{ fontWeight: 600 }}>
          Vardiya Atamaları
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => setShowForm(!showForm)}
          sx={{ 
            px: 3, 
            py: 1, 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)'
          }}
        >
          {showForm ? 'Formu Kapat' : 'Yeni Atama Yap'}
        </Button>
      </Box>

      {showForm && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography variant="h6" component="h3" gutterBottom color="primary">
            Vardiya Ata
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <AssignShift 
            employees={employees} 
            shifts={shifts} 
            onAssign={handleAssignShift} 
          />
        </Paper>
      )}

      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 4, mb: 3, color: 'primary.main', fontWeight: 600 }}>
        Mevcut Atamalar
      </Typography>
      
      <Grid container spacing={3}>
        {employeeShifts.map(assignment => (
          <Grid item xs={12} sm={6} md={4} key={assignment.id}>
            <Card 
              elevation={0} 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                },
                border: '1px solid #e0e0e0'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {assignment.employeeName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {assignment.employeeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {assignment.employeeId}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {assignment.shiftName}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    {assignment.date}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Atamayı Kaldır
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default VardiyaAtama; 