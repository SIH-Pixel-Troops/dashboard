import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  Search,
  FilterList,
  LocalHospital,
  Person,
  Refresh,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Mock tourist data for demonstration
const mockTourists = [
  {
    id: '1',
    name: 'John Doe',
    location: { lat: 28.6139, lng: 77.2090, address: 'Red Fort, Delhi' },
    status: 'safe',
    safetyScore: 9.2,
    lastActive: new Date(Date.now() - 300000), // 5 minutes ago
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    location: { lat: 28.5562, lng: 77.1000, address: 'Qutub Minar, Delhi' },
    status: 'warning',
    safetyScore: 6.8,
    lastActive: new Date(Date.now() - 120000), // 2 minutes ago
  },
  {
    id: '3',
    name: 'Mike Chen',
    location: { lat: 28.6129, lng: 77.2295, address: 'India Gate, Delhi' },
    status: 'emergency',
    safetyScore: 3.1,
    lastActive: new Date(Date.now() - 60000), // 1 minute ago
  },
  {
    id: '4',
    name: 'Emma Johnson',
    location: { lat: 28.6562, lng: 77.2410, address: 'Chandni Chowk, Delhi' },
    status: 'safe',
    safetyScore: 8.7,
    lastActive: new Date(Date.now() - 180000), // 3 minutes ago
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'safe':
      return 'success';
    case 'warning':
      return 'warning';
    case 'emergency':
      return 'error';
    default:
      return 'default';
  }
};

const getMarkerIcon = (status: string) => {
  const color = status === 'safe' ? 'green' : status === 'warning' ? 'orange' : 'red';
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

export default function RealTimeMonitoring() {
  const [tourists, setTourists] = useState(mockTourists);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTourist, setSelectedTourist] = useState<string | null>(null);

  // Filter tourists based on search term
  const filteredTourists = tourists.filter(tourist =>
    tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tourist.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTourists(prev => prev.map(tourist => ({
        ...tourist,
        lastActive: new Date(Date.now() - Math.random() * 600000), // Random time up to 10 minutes ago
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Real-time Monitoring
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Box>

      <Box display="flex" gap={3} sx={{ height: '80vh' }}>
        {/* Tourist List */}
        <Box flex="0 0 400px">
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box p={2}>
              <TextField
                fullWidth
                placeholder="Search tourists or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <FilterList />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Divider />
            <Box flex={1} overflow="auto">
              <List>
                {filteredTourists.map((tourist) => (
                  <ListItem 
                    key={tourist.id}
                    component="div"
                    sx={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedTourist === tourist.id ? 'action.selected' : 'transparent'
                    }}
                    onClick={() => setSelectedTourist(tourist.id)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        backgroundColor: getStatusColor(tourist.status) === 'success' ? 'success.main' :
                                        getStatusColor(tourist.status) === 'warning' ? 'warning.main' :
                                        'error.main'
                      }}>
                        {tourist.status === 'emergency' ? <LocalHospital /> : <Person />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">{tourist.name}</Typography>
                          <Chip 
                            label={tourist.status} 
                            size="small" 
                            color={getStatusColor(tourist.status) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {tourist.location.address}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Safety: {tourist.safetyScore}/10 • {getTimeAgo(tourist.lastActive)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Box>

        {/* Map */}
        <Box flex={1}>
          <Paper sx={{ height: '100%', position: 'relative' }}>
            <MapContainer
              center={[28.6139, 77.2090]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {filteredTourists.map((tourist) => (
                <Marker
                  key={tourist.id}
                  position={[tourist.location.lat, tourist.location.lng]}
                  icon={getMarkerIcon(tourist.status)}
                >
                  <Popup>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {tourist.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {tourist.location.address}
                      </Typography>
                      <Box mt={1}>
                        <Chip 
                          label={tourist.status.toUpperCase()} 
                          size="small" 
                          color={getStatusColor(tourist.status) as any}
                        />
                      </Box>
                      <Typography variant="caption" display="block" mt={1}>
                        Safety Score: {tourist.safetyScore}/10
                      </Typography>
                      <Typography variant="caption" display="block">
                        Last Active: {getTimeAgo(tourist.lastActive)}
                      </Typography>
                    </Box>
                  </Popup>
                </Marker>
              ))}

              {/* Safety zones (example circles) */}
              <Circle
                center={[28.6139, 77.2090]}
                radius={1000}
                pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
              />
              <Circle
                center={[28.5562, 77.1000]}
                radius={800}
                pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.1 }}
              />
            </MapContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
