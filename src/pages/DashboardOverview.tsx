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
import { panicApiService } from '../services/panicApi';
import { apiService } from '../services/api';

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
      const [generalStats, panicData] = await Promise.all([
        apiService.getDashboardStats(),
        panicApiService.getPanicStats()
      ]);
      
      setDashboardStats({
        ...generalStats,
        digitalIDsIssued: 1203, // This would come from your Digital ID API
        panicAlertsToday: panicData.totalAlertsToday,
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
      
      {/* Key Metrics */}
      <Box display="flex" flexWrap="wrap" gap={2} sx={{ mb: 3 }}>
        <Box flex="1 1 200px" minWidth={200}>
          <StatCard
            title="Total Tourists"
            value={dashboardStats.totalTourists.toLocaleString()}
            icon={<People />}
            color="primary.main"
          />
        </Box>
        <Box flex="1 1 200px" minWidth={200}>
          <StatCard
            title="Active Tourists"
            value={dashboardStats.activeTourists.toLocaleString()}
            icon={<CheckCircle />}
            color="success.main"
          />
        </Box>
        <Box flex="1 1 200px" minWidth={200}>
          <StatCard
            title="Digital IDs Issued"
            value={dashboardStats.digitalIDsIssued.toLocaleString()}
            icon={<BadgeIcon />}
            color="info.main"
          />
        </Box>
        <Box flex="1 1 200px" minWidth={200}>
          <StatCard
            title="Panic Alerts Today"
            value={dashboardStats.panicAlertsToday}
            icon={<Sos />}
            color="error.main"
          />
        </Box>
        <Box flex="1 1 200px" minWidth={200}>
          <StatCard
            title="Active Incidents"
            value={dashboardStats.activeIncidents}
            icon={<Warning />}
            color="warning.main"
          />
        </Box>
        <Box flex="1 1 200px" minWidth={200}>
          <StatCard
            title="Safety Score"
            value={dashboardStats.averageSafetyScore}
            icon={<TrendingUp />}
            color="info.main"
            subtitle="/10"
          />
        </Box>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3}>
        {/* Risk Distribution */}
        <Box flex="1 1 400px" minWidth={400}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Tourist Risk Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Recent Alerts */}
        <Box flex="1 1 400px" minWidth={400}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Recent Alerts
            </Typography>
            <List>
              {recentAlerts.map((alert) => (
                <ListItem key={alert.id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: 'error.main' }}>
                      <Warning />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle2">{alert.tourist}</Typography>
                        <Chip 
                          label={alert.severity} 
                          size="small" 
                          color={alert.severity === 'critical' ? 'error' : alert.severity === 'urgent' ? 'warning' : 'default'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {alert.type} • {alert.location}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {alert.time}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* System Health */}
        <Box width="100%">
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={3}>
              <Box flex="1 1 200px" minWidth={200}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    IoT Devices Online
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={94} 
                    sx={{ mt: 1, mb: 1, height: 8, borderRadius: 4 }}
                    color="success"
                  />
                  <Typography variant="body2">94% (1,172/1,247)</Typography>
                </Box>
              </Box>
              <Box flex="1 1 200px" minWidth={200}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Network Coverage
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={98} 
                    sx={{ mt: 1, mb: 1, height: 8, borderRadius: 4 }}
                    color="success"
                  />
                  <Typography variant="body2">98%</Typography>
                </Box>
              </Box>
              <Box flex="1 1 200px" minWidth={200}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Response Time (Avg)
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={85} 
                    sx={{ mt: 1, mb: 1, height: 8, borderRadius: 4 }}
                    color="info"
                  />
                  <Typography variant="body2">2.3 minutes</Typography>
                </Box>
              </Box>
              <Box flex="1 1 200px" minWidth={200}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Blockchain Sync
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={100} 
                    sx={{ mt: 1, mb: 1, height: 8, borderRadius: 4 }}
                    color="success"
                  />
                  <Typography variant="body2">100% Synced</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
