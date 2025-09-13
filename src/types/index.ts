// Tourist and User Types
export interface Tourist {
  id: string;
  name: string;
  digitalId: string;
  blockchainId: string;
  phoneNumber: string;
  emergencyContact: string;
  currentLocation: Location;
  safetyScore: number;
  status: TouristStatus;
  lastActive: Date;
  iotDevices: IoTDevice[];
  riskLevel: RiskLevel;
}

export interface DigitalTouristID {
  id: string;
  touristId: string;
  blockchainHash: string;
  visaNumber?: string;
  aadharNumber?: string;
  issueDate: Date;
  expiryDate: Date;
  kycStatus: 'pending' | 'verified' | 'rejected';
  entryPoint: string;
  isActive: boolean;
}

export interface PanicAlert {
  id: string;
  touristId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: Date;
  alertType: 'panic_button' | 'anomaly_detected' | 'geo_fence_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  responseTime?: number;
  assignedOfficer?: string;
}

export interface SafetyScore {
  touristId: string;
  currentScore: number;
  historicalScores: Array<{
    date: Date;
    score: number;
    factors: string[];
  }>;
  riskFactors: string[];
  recommendations: string[];
}

export interface EFIRRecord {
  id: string;
  incidentId: string;
  touristId: string;
  firNumber: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'draft' | 'filed' | 'under_investigation' | 'closed';
  assignedOfficer: string;
  documents: string[];
}

export interface GeofenceAlert {
  id: string;
  touristId: string;
  fenceId: string;
  fenceName: string;
  alertType: 'entry' | 'exit' | 'violation';
  riskLevel: 'safe' | 'caution' | 'restricted' | 'danger';
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: Date;
  accuracy: number;
}

export enum TouristStatus {
  SAFE = 'safe',
  WARNING = 'warning',
  EMERGENCY = 'emergency',
  OFFLINE = 'offline'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Incident Management Types
export interface Incident {
  id: string;
  touristId: string;
  touristName: string;
  type: IncidentType;
  severity: IncidentSeverity;
  location: Location;
  description: string;
  reportedAt: Date;
  resolvedAt?: Date;
  status: IncidentStatus;
  responders: Responder[];
  updates: IncidentUpdate[];
  photos?: string[];
}

export enum IncidentType {
  MEDICAL_EMERGENCY = 'medical_emergency',
  SAFETY_THREAT = 'safety_threat',
  NATURAL_DISASTER = 'natural_disaster',
  CRIMINAL_ACTIVITY = 'criminal_activity',
  LOST_TOURIST = 'lost_tourist',
  EQUIPMENT_FAILURE = 'equipment_failure'
}

export enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum IncidentStatus {
  REPORTED = 'reported',
  ACKNOWLEDGED = 'acknowledged',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export interface Responder {
  id: string;
  name: string;
  type: ResponderType;
  contactInfo: string;
  assignedAt: Date;
  status: ResponderStatus;
}

export enum ResponderType {
  POLICE = 'police',
  MEDICAL = 'medical',
  FIRE_DEPARTMENT = 'fire_department',
  SEARCH_RESCUE = 'search_rescue',
  SECURITY = 'security'
}

export enum ResponderStatus {
  ASSIGNED = 'assigned',
  EN_ROUTE = 'en_route',
  ON_SCENE = 'on_scene',
  COMPLETED = 'completed'
}

export interface IncidentUpdate {
  id: string;
  timestamp: Date;
  message: string;
  updatedBy: string;
  type: UpdateType;
}

export enum UpdateType {
  STATUS_CHANGE = 'status_change',
  RESPONDER_UPDATE = 'responder_update',
  LOCATION_UPDATE = 'location_update',
  GENERAL_UPDATE = 'general_update'
}

// IoT and Monitoring Types
export interface IoTDevice {
  id: string;
  touristId: string;
  type: DeviceType;
  status: DeviceStatus;
  batteryLevel: number;
  lastSeen: Date;
  location: Location;
  sensorData: SensorReading[];
}

export enum DeviceType {
  SMARTWATCH = 'smartwatch',
  GPS_TRACKER = 'gps_tracker',
  PANIC_BUTTON = 'panic_button',
  HEALTH_MONITOR = 'health_monitor'
}

export enum DeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOW_BATTERY = 'low_battery',
  OFFLINE = 'offline',
  MALFUNCTION = 'malfunction'
}

export interface SensorReading {
  timestamp: Date;
  type: SensorType;
  value: number;
  unit: string;
  isAbnormal: boolean;
}

export enum SensorType {
  HEART_RATE = 'heart_rate',
  TEMPERATURE = 'temperature',
  ACCELEROMETER = 'accelerometer',
  GPS = 'gps',
  ALTITUDE = 'altitude'
}

// Analytics and Dashboard Types
export interface DashboardStats {
  totalTourists: number;
  activeTourists: number;
  emergencyAlerts: number;
  activeIncidents: number;
  resolvedIncidents: number;
  averageSafetyScore: number;
  riskDistribution: RiskDistribution;
  responseTime: number; // in minutes
}

export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface Alert {
  id: string;
  touristId: string;
  touristName: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  location: Location;
  timestamp: Date;
  isRead: boolean;
  isResolved: boolean;
}

export enum AlertType {
  PANIC_BUTTON = 'panic_button',
  GEO_FENCE_VIOLATION = 'geo_fence_violation',
  HEALTH_ANOMALY = 'health_anomaly',
  DEVICE_OFFLINE = 'device_offline',
  INACTIVITY = 'inactivity',
  SAFETY_SCORE_DROP = 'safety_score_drop'
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

// Geo-fencing and Safety Zones
export interface SafetyZone {
  id: string;
  name: string;
  description: string;
  coordinates: Location[];
  riskLevel: RiskLevel;
  restrictions: string[];
  activeAlerts: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Chart and Analytics Data Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string;
  borderWidth?: number;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  category?: string;
}
