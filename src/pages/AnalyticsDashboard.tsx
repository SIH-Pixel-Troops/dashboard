import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

export default function AnalyticsDashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Safety Analytics & Reports
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This section will contain:
          <br />• Tourist safety score trends
          <br />• Incident analytics and patterns
          <br />• Response time metrics
          <br />• Risk zone heatmaps
          <br />• Predictive safety alerts
        </Typography>
      </Paper>
    </Box>
  );
}
