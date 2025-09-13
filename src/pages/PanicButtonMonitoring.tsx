import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Sos as SOSIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Assignment as AssignIcon,
} from '@mui/icons-material';
import { panicApiService, RealPanicAlert, PanicStats } from '../services/panicApi';

const PanicButtonMonitoring: React.FC = () => {
  const [panicAlerts, setPanicAlerts] = useState<RealPanicAlert[]>([]);
  const [stats, setStats] = useState<PanicStats>({
    totalAlertsToday: 0,
    activeAlerts: 0,
    averageResponseTime: 0,
    resolvedAlerts: 0
  });
  const [selectedAlert, setSelectedAlert] = useState<RealPanicAlert | null>(null);
  const [responseDialog, setResponseDialog] = useState(false);
  const [assignDialog, setAssignDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Form states
  const [officerName, setOfficerName] = useState('');
  const [responseNotes, setResponseNotes] = useState('');

  // Load initial data
  useEffect(() => {
    loadData();
    
    // Subscribe to real-time updates
    const unsubscribe = panicApiService.subscribeToAlerts((newAlert) => {
      setPanicAlerts(prev => [newAlert, ...prev]);
      setSnackbar({
        open: true,
        message: `🚨 New panic alert from ${newAlert.touristName}!`,
        severity: 'error'
      });
    });
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [alertsData, statsData] = await Promise.all([
        panicApiService.getPanicAlerts(),
        panicApiService.getPanicStats()
      ]);
      
      setPanicAlerts(alertsData);
      setStats(statsData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load panic alerts data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const [alertsData, statsData] = await Promise.all([
        panicApiService.getPanicAlerts(),
        panicApiService.getPanicStats()
      ]);
      
      setPanicAlerts(alertsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAssignOfficer = async () => {
    if (!selectedAlert || !officerName.trim()) return;
    
    try {
      const success = await panicApiService.assignOfficer(
        selectedAlert.id,
        'officer-id',
        officerName.trim()
      );
      
      if (success) {
        setSnackbar({
          open: true,
          message: `Officer ${officerName} assigned successfully`,
          severity: 'success'
        });
        refreshData();
        setAssignDialog(false);
        setOfficerName('');
        setSelectedAlert(null);
      } else {
        throw new Error('Assignment failed');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to assign officer',
        severity: 'error'
      });
    }
  };

  const handleResolveAlert = async () => {
    if (!selectedAlert) return;
    
    try {
      const success = await panicApiService.resolveAlert(
        selectedAlert.id,
        responseNotes.trim()
      );
      
      if (success) {
        setSnackbar({
          open: true,
          message: 'Alert resolved successfully',
          severity: 'success'
        });
        refreshData();
        setResponseDialog(false);
        setResponseNotes('');
        setSelectedAlert(null);
      } else {
        throw new Error('Resolution failed');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to resolve alert',
        severity: 'error'
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'error';
      case 'acknowledged': return 'warning';
      case 'responding': return 'info';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatResponseTime = (responseTime?: number) => {
    if (!responseTime) return 'N/A';
    const minutes = Math.floor(responseTime / 60000);
    const seconds = Math.floor((responseTime % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading panic alerts...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          🚨 Panic Button Monitoring
        </Typography>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={refreshData} disabled={refreshing}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Alerts
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {stats.activeAlerts}
                  </Typography>
                </Box>
                <SOSIcon color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Alerts Today
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.totalAlertsToday}
                  </Typography>
                </Box>
                <TimerIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Response
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {Math.round(stats.averageResponseTime / 60)}m
                  </Typography>
                </Box>
                <CheckCircleIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Resolved Today
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.resolvedAlerts}
                  </Typography>
                </Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Real-time Status */}
      {refreshing && (
        <Alert severity="info" sx={{ mb: 2 }}>
          🔄 Refreshing panic alerts data...
        </Alert>
      )}

      {/* Critical Alerts Warning */}
      {stats.activeAlerts > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">
            🚨 {stats.activeAlerts} Active Emergency Alert{stats.activeAlerts > 1 ? 's' : ''} Require Immediate Attention!
          </Typography>
        </Alert>
      )}

      {/* Panic Alerts Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tourist</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Officer</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {panicAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="textSecondary" sx={{ py: 4 }}>
                      No panic alerts found. Waiting for SOS signals from your backend... 🔍
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                panicAlerts.map((alert) => (
                  <TableRow 
                    key={alert.id} 
                    hover
                    sx={{ 
                      backgroundColor: alert.status === 'active' ? 'error.light' : 
                                     alert.status === 'responding' ? 'warning.light' : 'inherit',
                      opacity: alert.status === 'resolved' ? 0.7 : 1,
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle2">
                            {alert.touristName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {alert.phoneNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocationIcon color="secondary" />
                        <Box>
                          <Typography variant="body2">
                            {alert.location.address}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatTimestamp(alert.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.severity.toUpperCase()}
                        color={getSeverityColor(alert.severity) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.status.toUpperCase()}
                        color={getStatusColor(alert.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {alert.assignedOfficer || 'Unassigned'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {alert.status === 'active' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<AssignIcon />}
                            onClick={() => {
                              setSelectedAlert(alert);
                              setAssignDialog(true);
                            }}
                          >
                            Assign
                          </Button>
                        )}
                        {(alert.status === 'acknowledged' || alert.status === 'responding') && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => {
                              setSelectedAlert(alert);
                              setResponseDialog(true);
                            }}
                          >
                            Resolve
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Assign Officer Dialog */}
      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>🚔 Assign Officer to Panic Alert</DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box sx={{ pt: 1 }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Emergency Alert Details
                </Typography>
              </Alert>
              <Typography variant="body2" gutterBottom>
                <strong>Tourist:</strong> {selectedAlert.touristName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Phone:</strong> {selectedAlert.phoneNumber}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Location:</strong> {selectedAlert.location.address}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Severity:</strong> {selectedAlert.severity.toUpperCase()}
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Officer Name"
                fullWidth
                variant="outlined"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="Enter officer name to assign"
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAssignOfficer} 
            variant="contained"
            disabled={!officerName.trim()}
          >
            Assign Officer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resolve Alert Dialog */}
      <Dialog open={responseDialog} onClose={() => setResponseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>✅ Resolve Panic Alert</DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box sx={{ pt: 1 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Mark Emergency as Resolved
                </Typography>
              </Alert>
              <Typography variant="body2" gutterBottom>
                <strong>Tourist:</strong> {selectedAlert.touristName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Officer:</strong> {selectedAlert.assignedOfficer}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Response Time:</strong> {formatResponseTime(Date.now() - new Date(selectedAlert.timestamp).getTime())}
              </Typography>
              <TextField
                margin="dense"
                label="Resolution Notes"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                placeholder="Describe the resolution and actions taken..."
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleResolveAlert} 
            variant="contained"
            color="success"
          >
            Mark as Resolved
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PanicButtonMonitoring;
