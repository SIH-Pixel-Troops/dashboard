import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  People,
  Warning,
  CheckCircle,
  TrendingUp,
  Badge as BadgeIcon,
  Sos,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { apiService } from '../services/api';

/* ---------- Static Demo Data (Safe & Intentional) ---------- */

const riskData = [
  { name: 'Low Risk', value: 856, color: '#4caf50' },
  { name: 'Medium Risk', value: 245, color: '#ff9800' },
  { name: 'High Risk', value: 89, color: '#f44336' },
  { name: 'Critical', value: 12, color: '#d32f2f' },
];

const recentAlerts = [
  { id: 1, tourist: 'John Doe', type: 'Panic Button', location: 'Red Fort', time: '2 mins ago', severity: 'critical' },
  { id: 2, tourist: 'Sarah Wilson', type: 'Geo-fence Alert', location: 'Gateway of India', time: '5 mins ago', severity: 'warning' },
  { id: 3, tourist: 'Mike Chen', type: 'Health Anomaly', location: 'Taj Mahal', time: '8 mins ago', severity: 'urgent' },
];

const StatCard = ({ title, value, icon, color, subtitle }: any) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" color={color}>
            {value}
          </Typography>
          {subtitle && (
            <Typography color="textSecondary" variant="body2">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ backgroundColor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalTourists: 1247,
    activeTourists: 1156,
    emergencyAlerts: 3,
    activeIncidents: 7,
    resolvedIncidents: 142,
    averageSafetyScore: 8.4,
    digitalIDsIssued: 1203,
    panicAlertsToday: 12,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const generalStats = await apiService.getDashboardStats();

      setDashboardStats({
        ...generalStats,
        digitalIDsIssued: 1203,
        panicAlertsToday: 12, // static until backend supports stats
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading dashboard data...</Typography>
        </Box>
      )}

      {/* ---------- Stats ---------- */}
      <Box display="flex" flexWrap="wrap" gap={2} sx={{ mb: 3 }}>
        <Box flex="1 1 200px">
          <StatCard title="Total Tourists" value={dashboardStats.totalTourists} icon={<People />} color="primary.main" />
        </Box>
        <Box flex="1 1 200px">
          <StatCard title="Active Tourists" value={dashboardStats.activeTourists} icon={<CheckCircle />} color="success.main" />
        </Box>
        <Box flex="1 1 200px">
          <StatCard title="Digital IDs Issued" value={dashboardStats.digitalIDsIssued} icon={<BadgeIcon />} color="info.main" />
        </Box>
        <Box flex="1 1 200px">
          <StatCard title="Panic Alerts Today" value={dashboardStats.panicAlertsToday} icon={<Sos />} color="error.main" />
        </Box>
        <Box flex="1 1 200px">
          <StatCard title="Active Incidents" value={dashboardStats.activeIncidents} icon={<Warning />} color="warning.main" />
        </Box>
        <Box flex="1 1 200px">
          <StatCard title="Safety Score" value={dashboardStats.averageSafetyScore} icon={<TrendingUp />} color="info.main" subtitle="/10" />
        </Box>
      </Box>

      {/* ---------- Charts + Lists ---------- */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        <Box flex="1 1 400px">
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6">Tourist Risk Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={riskData} dataKey="value" outerRadius={80}>
                  {riskData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        <Box flex="1 1 400px">
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6">Recent Alerts</Typography>
            <List>
              {recentAlerts.map((alert) => (
                <ListItem key={alert.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: 'error.main' }}>
                      <Warning />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={alert.tourist}
                    secondary={`${alert.type} • ${alert.location} • ${alert.time}`}
                  />
                  <Chip label={alert.severity} color="error" size="small" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
