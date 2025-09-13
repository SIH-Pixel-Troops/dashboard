# Backend Integration Requirements for Smart Tourist Safety Dashboard

Based on your existing backend setup with Alchemy RPC, smart contracts, and the dashboard structure, here's what you need to integrate:

## 🔧 **What I've Set Up for You**

### 1. **API Service Layer** (`src/services/api.ts`)
- Complete REST API integration with axios
- Authentication handling with JWT tokens
- Error handling and response interceptors
- Comprehensive API endpoints for all dashboard features

### 2. **Blockchain Integration** (`src/services/blockchain.ts`)
- Ethers.js integration for smart contract interaction
- Tourist identity verification on blockchain
- Real-time blockchain event listening
- Uses your existing Alchemy RPC configuration

### 3. **React Hooks** (`src/hooks/index.ts`)
- Custom hooks for data management
- Real-time updates via WebSocket
- State management for tourists, incidents, IoT devices
- Automatic data fetching and caching

### 4. **Environment Configuration** (`.env.example`)
- Backend API endpoints
- Blockchain configuration (Alchemy RPC, Contract Address)
- WebSocket URLs for real-time updates
- Feature flags for enabling/disabling functionality

## 🔗 **Backend Endpoints You Need to Implement**

Your backend API should provide these endpoints:

### **Dashboard & Statistics**
```
GET /api/dashboard/stats - Dashboard KPIs and metrics
GET /api/analytics/{type} - Analytics data for charts
```

### **Tourist Management**
```
GET /api/tourists - List all tourists with filtering
GET /api/tourists/{id} - Get specific tourist details
POST /api/tourists - Register new tourist
PATCH /api/tourists/{id}/status - Update tourist status
POST /api/tourists/{id}/location - Update tourist location
```

### **Incident Management**
```
GET /api/incidents - List incidents with pagination
POST /api/incidents - Create new incident
PATCH /api/incidents/{id} - Update incident
POST /api/incidents/{id}/responders - Assign responder
```

### **IoT Device Management**
```
GET /api/iot-devices - List IoT devices
PATCH /api/iot-devices/{id}/status - Update device status
GET /api/iot-devices/{id}/sensor-data - Get sensor readings
```

### **Alerts & Notifications**
```
GET /api/alerts - Get alerts list
PATCH /api/alerts/{id}/read - Mark alert as read
POST /api/emergency/alert - Trigger emergency alert
```

### **Blockchain Integration**
```
POST /api/blockchain/verify-identity - Verify tourist on blockchain
POST /api/blockchain/update-record - Update blockchain record
```

## 🌐 **Real-time Features**

### **WebSocket Connection**
Your backend should provide WebSocket at `/ws` for:
- Real-time location updates
- Emergency alerts
- Incident status changes
- IoT device status updates
- Blockchain event notifications

## 📋 **What You Need to Do**

### **1. Create Backend API Routes**
Based on your existing backend, add REST API routes that match the endpoints in `api.ts`

### **2. Set Up Environment Variables**
Copy `.env.example` to `.env` and configure:
```bash
# Copy the example file
cp .env.example .env

# Edit with your actual values
REACT_APP_API_BASE_URL=http://localhost:3001/api  # Your backend API URL
REACT_APP_ALCHEMY_RPC=https://eth-sepolia.g.alchemy.com/v2/EWaVR1zhsRumK3lcBcvG3  # From your screenshot
REACT_APP_CONTRACT_ADDRESS=0xd9145CCE52D386f254917e8181e844ee9943f39138  # From your screenshot
```

### **3. Backend Database Integration**
Your backend should:
- Store tourist data with blockchain references
- Track incidents and responses
- Log IoT device data and sensor readings
- Maintain alerts and notifications

### **4. Smart Contract Integration**
Your backend should:
- Interact with your deployed smart contract
- Verify tourist identities on blockchain
- Listen for blockchain events
- Update tourist records on-chain

## 🚀 **Getting Started**

1. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your backend URLs and blockchain config
   ```

2. **Start Your Backend**:
   Make sure your backend API is running on the URL specified in `.env`

3. **Test Integration**:
   ```bash
   npm start
   ```
   The dashboard will automatically connect to your backend APIs

4. **Enable Real-time Features**:
   Implement WebSocket endpoints in your backend for live updates

## 🔄 **Data Flow**

1. **Dashboard loads** → Calls `/api/dashboard/stats`
2. **Real-time monitoring** → WebSocket connection + `/api/tourists/locations`
3. **User actions** → REST API calls to update data
4. **Blockchain verification** → Calls to your smart contract via Alchemy RPC
5. **Live updates** → WebSocket pushes to all connected clients

## 📊 **Integration Benefits**

- **Seamless Connection**: Dashboard automatically connects to your backend
- **Real-time Updates**: Live data via WebSocket integration
- **Blockchain Ready**: Direct integration with your smart contracts
- **Scalable Architecture**: Clean separation between frontend and backend
- **Type Safety**: Full TypeScript interfaces for all data structures

Your dashboard is now ready to connect to your backend! Just implement the API endpoints and configure the environment variables.
