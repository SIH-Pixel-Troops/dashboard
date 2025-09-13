import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import RealTimeMonitoring from './pages/RealTimeMonitoring';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import DigitalIDManagement from './pages/DigitalIDManagement';
import PanicButtonMonitoring from './pages/PanicButtonMonitoring';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/monitoring" element={<RealTimeMonitoring />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/digital-ids" element={<DigitalIDManagement />} />
            <Route path="/panic-monitoring" element={<PanicButtonMonitoring />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
