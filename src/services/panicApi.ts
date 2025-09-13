import axios from 'axios';

// Panic Button API Configuration
const panicApi = axios.create({
  baseURL: process.env.REACT_APP_PANIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced PanicAlert interface to match your backend
export interface RealPanicAlert {
  id: string;
  touristId: string;
  touristName: string;
  phoneNumber: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'responding' | 'resolved';
  responseTime?: number;
  assignedOfficer?: string;
  notes?: string;
  blockchainTxId?: string;
}

// Response interface for API calls
export interface PanicApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PanicStats {
  totalAlertsToday: number;
  activeAlerts: number;
  averageResponseTime: number;
  resolvedAlerts: number;
}

// Panic Button API Service
export const panicApiService = {
  // Get all panic alerts
  getPanicAlerts: async (): Promise<RealPanicAlert[]> => {
    try {
      const response = await panicApi.get<PanicApiResponse<RealPanicAlert[]>>('/api/panic-alerts');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch panic alerts:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  },

  // Get panic alert by ID
  getPanicAlertById: async (id: string): Promise<RealPanicAlert | null> => {
    try {
      const response = await panicApi.get<PanicApiResponse<RealPanicAlert>>(`/api/panic-alerts/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error(`Failed to fetch panic alert ${id}:`, error);
      return null;
    }
  },

  // Update panic alert status
  updatePanicAlert: async (id: string, updates: Partial<RealPanicAlert>): Promise<boolean> => {
    try {
      const response = await panicApi.put<PanicApiResponse<RealPanicAlert>>(`/api/panic-alerts/${id}`, updates);
      return response.data.success;
    } catch (error) {
      console.error(`Failed to update panic alert ${id}:`, error);
      return false;
    }
  },

  // Assign officer to panic alert
  assignOfficer: async (alertId: string, officerId: string, officerName: string): Promise<boolean> => {
    try {
      const response = await panicApi.put<PanicApiResponse<RealPanicAlert>>(`/api/panic-alerts/${alertId}/assign`, {
        assignedOfficer: officerName,
        status: 'responding'
      });
      return response.data.success;
    } catch (error) {
      console.error(`Failed to assign officer to alert ${alertId}:`, error);
      return false;
    }
  },

  // Mark alert as resolved
  resolveAlert: async (alertId: string, notes?: string): Promise<boolean> => {
    try {
      const response = await panicApi.put<PanicApiResponse<RealPanicAlert>>(`/api/panic-alerts/${alertId}/resolve`, {
        status: 'resolved',
        notes,
        responseTime: Date.now()
      });
      return response.data.success;
    } catch (error) {
      console.error(`Failed to resolve alert ${alertId}:`, error);
      return false;
    }
  },

  // Get panic statistics
  getPanicStats: async (): Promise<PanicStats> => {
    try {
      const response = await panicApi.get<PanicApiResponse<PanicStats>>('/api/panic-alerts/stats');
      return response.data.data || {
        totalAlertsToday: 0,
        activeAlerts: 0,
        averageResponseTime: 0,
        resolvedAlerts: 0
      };
    } catch (error) {
      console.error('Failed to fetch panic stats:', error);
      return {
        totalAlertsToday: 0,
        activeAlerts: 0,
        averageResponseTime: 0,
        resolvedAlerts: 0
      };
    }
  },

  // Listen for real-time updates (WebSocket)
  subscribeToAlerts: (callback: (alert: RealPanicAlert) => void): (() => void) => {
    let ws: WebSocket | null = null;
    
    try {
      const wsUrl = process.env.REACT_APP_PANIC_API_BASE_URL?.replace('http', 'ws') || 'ws://localhost:8000';
      ws = new WebSocket(`${wsUrl}/ws/panic-alerts`);
      
      ws.onmessage = (event) => {
        try {
          const alert = JSON.parse(event.data) as RealPanicAlert;
          callback(alert);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
      
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
    
    // Return cleanup function
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }
};
