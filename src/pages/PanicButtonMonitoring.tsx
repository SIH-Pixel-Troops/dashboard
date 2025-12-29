import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Snackbar,
  Grid,
} from "@mui/material";
import {
  Sos as SOSIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import {
  listenForPanicAlerts,
  disconnectPanicSocket,
  RealPanicAlert,
} from "../services/panicApi";

const PanicButtonMonitoring: React.FC = () => {
  const [panicAlerts, setPanicAlerts] = useState<RealPanicAlert[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // 🔴 Real-time socket connection
  useEffect(() => {
    listenForPanicAlerts((alert) => {
      setPanicAlerts((prev) => [alert, ...prev]);
      setSnackbar({
        open: true,
        message: `🚨 New panic alert from ${alert.touristId}`,
        severity: "error",
      });
    });

    return () => {
      disconnectPanicSocket();
    };
  }, []);

  // 📊 Derived stats (local, no backend needed)
  const activeAlerts = panicAlerts.filter(
    (a) => a.status === "ACTIVE"
  ).length;

  const totalAlertsToday = panicAlerts.length;

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "HIGH":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🚨 Panic Button Monitoring
      </Typography>

      {/* 🔢 Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Active Alerts</Typography>
              <Typography variant="h4" color="error.main">
                {activeAlerts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Alerts Today</Typography>
              <Typography variant="h4" color="warning.main">
                {totalAlertsToday}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🚨 Warning */}
      {activeAlerts > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          🚨 {activeAlerts} active emergency alert
          {activeAlerts > 1 ? "s" : ""} need immediate attention!
        </Alert>
      )}

      {/* 📋 Alerts Table */}
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
              </TableRow>
            </TableHead>

            <TableBody>
              {panicAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="textSecondary" sx={{ py: 4 }}>
                      No panic alerts yet. Waiting for SOS signals…
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                panicAlerts.map((alert) => (
                  <TableRow key={alert.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon color="primary" />
                        <Typography>{alert.touristId}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocationIcon color="secondary" />
                        <Typography variant="body2">
                          {alert.location.latitude.toFixed(4)},{" "}
                          {alert.location.longitude.toFixed(4)}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {new Date(alert.time).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={alert.severity}
                        color={getSeverityColor(alert.severity) as any}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={alert.status}
                        color={getStatusColor(alert.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 🔔 Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PanicButtonMonitoring;
