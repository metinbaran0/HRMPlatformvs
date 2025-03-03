import React, { useState } from 'react';
import { Box, Paper, Container, Button } from '@mui/material';
import EmployeeForm from '../components/organisms/EmployeeFrom';
import EmployeePageSideBar from '../components/organisms/EmployeePageSideBar';
import ShiftForm from '../components/organisms/ShiftForm'; // Vardiya formu
import LeaveRequestForm from '../components/organisms/LeaveRequestForm'; // İzin Talebi formu
import ExpenseForm from '../components/organisms/ExpenseForm'; // Masraflar formu
import AssetForm from '../components/organisms/AssetForm'; // Demirbaşlar formu

const EmployeeProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleCloseTab = () => {
    setActiveTab(0); // Tab'ı kapatma
  };

  return (
    <Box display="flex">
      {/* Sidebar */}
      <EmployeePageSideBar setActiveTab={setActiveTab} />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
          <Container>
            <EmployeeForm />
          </Container>
        </Paper>

        {/* Active Tab Content  */}
        {activeTab === 1 && (
          <Paper sx={{ position: 'relative', padding: '20px' }}>
            <Button
              onClick={handleCloseTab}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#f44336',
                color: 'white',
                '&:hover': { backgroundColor: '#d32f2f' },
              }}
            >
              X
            </Button>
            <ShiftForm onSubmit={() => {}} />
          </Paper>
        )}
        {activeTab === 2 && (
          <Paper sx={{ position: 'relative', padding: '20px' }}>
            <Button
              onClick={handleCloseTab}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#f44336',
                color: 'white',
                '&:hover': { backgroundColor: '#d32f2f' },
              }}
            >
              X
            </Button>
            <LeaveRequestForm onSubmit={() => {}} />
          </Paper>
        )}
        {activeTab === 3 && (
          <Paper sx={{ position: 'relative', padding: '20px' }}>
            <Button
              onClick={handleCloseTab}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#f44336',
                color: 'white',
                '&:hover': { backgroundColor: '#d32f2f' },
              }}
            >
              X
            </Button>
            <ExpenseForm onSubmit={() => {}} />
          </Paper>
        )}
        {activeTab === 4 && (
          <Paper sx={{ position: 'relative', padding: '20px' }}>
            <Button
              onClick={handleCloseTab}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#f44336',
                color: 'white',
                '&:hover': { backgroundColor: '#d32f2f' },
              }}
            >
              X
            </Button>
            <AssetForm onSubmit={() => {}} />
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default EmployeeProfile;
