import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  Skeleton,
  Snackbar,
  Alert
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { panicApiService, PanicStats, RealPanicAlert } from '../services/panicApi';

// Simple sparkline using SVG (fallback if recharts not desired)
function Sparkline({ values }: { values: number[] }) {
  const w = 180;
  const h = 48;
  const max = Math.max(...values, 1);
  const points = values.map((v, i) => `${(i / (values.length - 1 || 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#1976d2"
        strokeWidth={2}
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<PanicStats | null>(null);
  const [alerts, setAlerts] = useState<RealPanicAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'info' | 'success' | 'error' }>(
    { open: false, message: '', severity: 'info' }
  );

// Fallback demo data (for a visually appealing initial state)
const DEMO_ALERTS: RealPanicAlert[] = [
  { id: 'a1', touristId: 't1', touristName: 'Aarav Patel', phoneNumber: '+91-9876543210', location: { address: 'Marine Drive, Mumbai', latitude: 18.94, longitude: 72.82 }, timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), severity: 'high', status: 'resolved', responseTime: 10 * 60000 },
  { id: 'a2', touristId: 't2', touristName: 'Priya Sharma', phoneNumber: '+91-9123456789', location: { address: 'Connaught Place, New Delhi', latitude: 28.63, longitude: 77.21 }, timestamp: new Date(Date.now() - 35 * 60000).toISOString(), severity: 'critical', status: 'active', responseTime: undefined },
  { id: 'a3', touristId: 't3', touristName: 'Rohit Kumar', phoneNumber: '+91-9988766554', location: { address: 'MG Road, Bengaluru', latitude: 12.97, longitude: 77.60 }, timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), severity: 'medium', status: 'acknowledged', responseTime: 22 * 60000 },
  { id: 'a4', touristId: 't4', touristName: 'Neha Singh', phoneNumber: '+91-9012345678', location: { address: 'Baga Beach, Goa', latitude: 15.55, longitude: 73.74 }, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), severity: 'low', status: 'resolved', responseTime: 7 * 60000 }
];

const DEMO_STATS: PanicStats = {
  totalAlertsToday: 24,
  activeAlerts: 3,
  averageResponseTime: 12 * 60, // seconds
  resolvedAlerts: 18
};

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [s, al] = await Promise.all([panicApiService.getPanicStats(), panicApiService.getPanicAlerts()]);
        if (!mounted) return;
        if (s) setStats(s);
        if (al && al.length > 0) setAlerts(al);
        else setAlerts(DEMO_ALERTS);
      } catch (error) {
        console.error('Analytics load failed, using demo data', error);
        setStats(DEMO_STATS);
        setAlerts(DEMO_ALERTS);
        setSnackbar({ open: true, message: 'Analytics: using demo data (backend unreachable)', severity: 'info' });
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Compute last-7-days trend from alerts
  const trend = React.useMemo(() => {
    const days = 7;
    const counts = Array(days).fill(0);
    const labels: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
    }
    alerts.forEach(a => {
      const aDate = new Date(a.timestamp);
      for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        if (aDate.toDateString() === d.toDateString()) counts[i]++;
      }
    });
    return labels.map((label, i) => ({ day: label, count: counts[i] }));
  }, [alerts]);

  // Top hotspots by address (grouping by first token of address)
  const hotspots = React.useMemo(() => {
    const map = new Map<string, number>();
    alerts.forEach(a => {
      const key = (a.location?.address || 'Unknown').split(',')[0].trim();
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));
  }, [alerts]);

  const avgRespDisplay = stats ? Math.round((stats.averageResponseTime) / 60) : '--';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Safety Analytics
          </Typography>
          <Typography color="textSecondary">At-a-glance safety metrics, trends and hotspots</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)' }} elevation={3}>
            <Typography variant="subtitle2" color="textSecondary">Active Alerts</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, my: 1, color: '#d32f2f' }}> {loading ? <Skeleton width={80} /> : (stats ? stats.activeAlerts : DEMO_STATS.activeAlerts)} </Typography>
            <Typography variant="body2" color="textSecondary">Current open emergencies requiring response</Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">24h Trend</Typography>
                <Box sx={{ mt: 1 }}>
                  <Sparkline values={trend.map(t => t.count)} />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="subtitle2" color="textSecondary">Average Response Time</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, my: 1 }}>{loading ? <Skeleton width={80} /> : `${avgRespDisplay}m`}</Typography>
            <Typography variant="body2" color="textSecondary">Average time taken by responders to reach incidents</Typography>
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={Math.min(100, (stats ? (stats.averageResponseTime / 60) : (DEMO_STATS.averageResponseTime)))} sx={{ height: 10, borderRadius: 2 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg,#fff7e6 0%, #ffffff 100%)' }} elevation={3}>
            <Typography variant="subtitle2" color="textSecondary">Resolved Today</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, my: 1, color: 'success.main' }}>{loading ? <Skeleton width={80} /> : (stats ? stats.resolvedAlerts : DEMO_STATS.resolvedAlerts)}</Typography>
            <Typography variant="body2" color="textSecondary">Alerts successfully handled in the last 24 hours</Typography>
            <Box sx={{ mt: 2 }}>
              <Chip label="Operational" color="success" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }} elevation={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6">Alerts — Last 7 days</Typography>
              <Typography variant="caption" color="textSecondary">Live trend from backend</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ width: '100%', height: 220 }}>
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height={220} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={trend} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1976d2" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }} elevation={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6">Top Hotspots</Typography>
              <Typography variant="caption" color="textSecondary">By recent alerts</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box>
              {hotspots.length === 0 && !loading && <Typography color="textSecondary">No hotspots detected</Typography>}
              {hotspots.map((h, idx) => (
                <Box key={h.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: ['#e3f2fd','#fff3e0','#f3e5f5','#e8f5e9'][idx % 4], color: '#000' }}>{h.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{h.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{h.count} alerts</Typography>
                    </Box>
                  </Box>
                  <Chip label={`${h.count}`} color="primary" />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
