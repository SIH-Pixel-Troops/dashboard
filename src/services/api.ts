import axios from 'axios';
import { Tourist, Incident, DashboardStats } from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// Mock data fallbacks for development
const createMockDashboardStats = (): DashboardStats => ({
  totalTourists: 1247,
  activeTourists: 1156,
  emergencyAlerts: 3,
  activeIncidents: 7,
  resolvedIncidents: 142,
  averageSafetyScore: 8.4,
  riskDistribution: {
    low: 856,
    medium: 245,
    high: 89,
    critical: 12,
  },
  responseTime: 2.3,
});

// API Service functions
export const apiService = {
  // Dashboard Statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch dashboard stats, using mock data');
      return createMockDashboardStats();
    }
  },

  // Tourist Management
  getTourists: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    riskLevel?: string;
  }) => {
    try {
      const response = await api.get('/tourists', { params });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch tourists, using empty array');
      return [];
    }
  },

  getTouristById: async (id: string): Promise<Tourist | null> => {
    try {
      const response = await api.get(`/tourists/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch tourist ${id}`);
      return null;
    }
  },

  updateTouristStatus: async (id: string, status: string): Promise<boolean> => {
    try {
      await api.put(`/tourists/${id}/status`, { status });
      return true;
    } catch (error) {
      console.error(`Failed to update tourist ${id} status:`, error);
      return false;
    }
  },

  // Incident Management
  getIncidents: async (params?: {
    status?: string;
    severity?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await api.get('/incidents', { params });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch incidents, using empty array');
      return [];
    }
  },

  createIncident: async (incident: Partial<Incident>): Promise<Incident | null> => {
    try {
      const response = await api.post('/incidents', incident);
      return response.data;
    } catch (error) {
      console.error('Failed to create incident:', error);
      return null;
    }
  },

  updateIncident: async (id: string, updates: Partial<Incident>): Promise<boolean> => {
    try {
      await api.put(`/incidents/${id}`, updates);
      return true;
    } catch (error) {
      console.error(`Failed to update incident ${id}:`, error);
      return false;
    }
  },

  // IoT Device Management
  getIoTDevices: async (params?: {
    status?: string;
    type?: string;
    location?: string;
  }) => {
    try {
      const response = await api.get('/devices', { params });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch IoT devices, using empty array');
      return [];
    }
  },

  updateDeviceStatus: async (deviceId: string, status: string): Promise<boolean> => {
    try {
      await api.put(`/devices/${deviceId}/status`, { status });
      return true;
    } catch (error) {
      console.error(`Failed to update device ${deviceId} status:`, error);
      return false;
    }
  },

  // Alert Management
  getAlerts: async (params?: {
    status?: string;
    type?: string;
    severity?: string;
  }) => {
    try {
      const response = await api.get('/alerts', { params });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch alerts, using empty array');
      return [];
    }
  },

  markAlertAsRead: async (alertId: string): Promise<boolean> => {
    try {
      await api.put(`/alerts/${alertId}/read`);
      return true;
    } catch (error) {
      console.error(`Failed to mark alert ${alertId} as read:`, error);
      return false;
    }
  },

  // Emergency Functions
  triggerEmergencyAlert: async (touristId: string, alertType: string, message: string): Promise<boolean> => {
    try {
      await api.post('/emergency/alert', {
        touristId,
        alertType,
        message,
        timestamp: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Failed to trigger emergency alert:', error);
      return false;
    }
  },

  // Blockchain Integration
  verifyTouristIdentity: async (digitalId: string): Promise<boolean> => {
    try {
      const response = await api.post('/blockchain/verify', { digitalId });
      return response.data.verified;
    } catch (error) {
      console.error('Failed to verify tourist identity:', error);
      return false;
    }
  },

  updateBlockchainRecord: async (touristId: string, data: any): Promise<string | null> => {
    try {
      const response = await api.post('/blockchain/update', {
        touristId,
        data,
        timestamp: new Date().toISOString(),
      });
      return response.data.transactionHash;
    } catch (error) {
      console.error('Failed to update blockchain record:', error);
      return null;
    }
  },

  // Analytics
  getAnalyticsData: async (type: string, timeRange: string): Promise<any> => {
    try {
      const response = await api.get(`/analytics/${type}`, {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch analytics data, using empty object');
      return {};
    }
  },

  // WebSocket connection for real-time updates
  connectWebSocket: (onMessage: (data: any) => void): (() => void) => {
    try {
      const wsUrl = process.env.REACT_APP_API_BASE_URL?.replace('http', 'ws') || 'ws://localhost:3001';
      const ws = new WebSocket(`${wsUrl}/ws`);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      return () => ws.close();
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      return () => {};
    }
  },
};
