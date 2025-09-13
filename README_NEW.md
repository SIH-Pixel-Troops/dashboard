# Smart Tourist Safety Monitoring & Incident Response System Dashboard

A React-based web dashboard for monitoring tourist safety, managing incidents, and coordinating emergency responses in real-time.

## Features

🔹 **Real-time Monitoring**: Live tracking of tourists with interactive maps and safety status indicators
🔹 **Incident Management**: Comprehensive incident reporting, tracking, and resolution workflow
🔹 **Analytics Dashboard**: Safety metrics, trends, and predictive analytics
🔹 **Tourist Management**: Digital ID management with blockchain integration
🔹 **IoT Device Management**: Monitor wearables, sensors, and panic buttons
🔹 **Emergency Response**: Coordinated response system with real-time alerts

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Maps**: React Leaflet with OpenStreetMap
- **Charts**: Recharts for data visualization
- **Routing**: React Router v6
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SIH-Pixel-Troops/dashboard.git
cd dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000` (or another port if 3000 is occupied).

## Project Structure

```
src/
├── components/
│   └── Layout/
│       └── DashboardLayout.tsx    # Main layout with navigation
├── pages/
│   ├── DashboardOverview.tsx      # Main dashboard with key metrics
│   ├── RealTimeMonitoring.tsx     # Live tourist tracking with maps
│   ├── IncidentResponse.tsx       # Incident management interface
│   ├── AnalyticsDashboard.tsx     # Safety analytics and reports
│   ├── TouristManagement.tsx      # Digital ID and tourist profiles
│   └── IoTDevices.tsx            # IoT device monitoring
├── types/
│   └── index.ts                  # TypeScript interface definitions
├── App.tsx                       # Main app component with routing
└── index.tsx                     # App entry point
```

## Core Components

### Dashboard Overview
- Key performance indicators (KPIs)
- Tourist count and status summary
- Recent alerts and notifications
- System health monitoring

### Real-time Monitoring
- Interactive map with tourist locations
- Live status indicators (Safe, Warning, Emergency)
- Safety score tracking
- Geofencing and zone management

### Incident Response
- Emergency alert management
- Incident categorization and prioritization
- Responder assignment and coordination
- Real-time status updates

### Analytics Dashboard
- Safety trend analysis
- Incident pattern recognition
- Response time metrics
- Predictive safety alerts

### Tourist Management
- Digital identity verification
- Blockchain-based ID tracking
- Consent management
- Emergency contact information

### IoT Device Management
- Device status monitoring
- Battery and connectivity tracking
- Sensor data visualization
- Panic button integration

## Data Flow

1. **Tourist Registration**: Digital IDs created with blockchain verification
2. **Real-time Tracking**: IoT devices send location and sensor data
3. **Safety Scoring**: AI algorithms assess risk levels
4. **Alert Generation**: Automated alerts for anomalies or emergencies
5. **Incident Management**: Structured workflow for emergency response
6. **Analytics**: Historical data analysis for safety improvements

## API Integration

The dashboard is designed to integrate with:
- Tourist management APIs
- IoT device data streams
- Emergency services systems
- Blockchain networks
- Mapping services
- Notification systems

## Security Features

- Consent-based tracking
- Data privacy protection
- Blockchain-secured identity
- Role-based access control
- Encrypted communications

## Development

### Available Scripts

- `npm start` - Run development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

### Adding New Features

1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Define types in `src/types/`
4. Update routing in `App.tsx`
5. Add navigation items in `DashboardLayout.tsx`

## Deployment

### Production Build

```bash
npm run build
```

The build folder will contain the optimized production files ready for deployment.

### Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_BASE_URL=https://api.touristsafety.com
REACT_APP_MAP_API_KEY=your_map_api_key
REACT_APP_BLOCKCHAIN_ENDPOINT=https://blockchain.touristsafety.com
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

**Smart Tourist Safety Monitoring & Incident Response System**  
*Ensuring tourist safety through technology and real-time response coordination*
