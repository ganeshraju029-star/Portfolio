/**
 * Type definitions for Portfolio Backend
 * Enterprise-grade type safety for all data structures
 */

// ============================================================================
// CONNECTION / CONTACT FORM TYPES
// ============================================================================

export interface ConnectionRequest {
  name: string;
  email: string;
  company?: string;
  subject?: string;
  message: string;
  linkedin?: string;
  phone?: string;
}

export interface ConnectionDocument extends ConnectionRequest {
  id: string;
  requestId: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
  country: string;
  device: string;
  browser: string;
  referrer: string;
  sourcePage: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface CreateConnectionResponse {
  success: boolean;
  connectionId?: string;
  requestId?: string;
  error?: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface PageView {
  path: string;
  title: string;
  referrer: string;
  duration: number;
}

export interface VisitorData {
  sessionId: string;
  country: string;
  device: string;
  browser: string;
  os: string;
  language: string;
  screenResolution: string;
}

export interface AnalyticsDocument {
  sessionId: string;
  visitorId: string;
  pageViews: PageView[];
  visitor: VisitorData;
  sessionStart: FirebaseFirestore.Timestamp;
  sessionEnd?: FirebaseFirestore.Timestamp;
  totalDuration: number;
}

export interface DailyAnalytics {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  topPages: Array<{ path: string; views: number }>;
  countries: Array<{ country: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
}

// ============================================================================
// RESUME DOWNLOAD TYPES
// ============================================================================

export interface ResumeDownload {
  timestamp: FirebaseFirestore.Timestamp;
  country: string;
  device: string;
  browser: string;
  referrer: string;
}

// ============================================================================
// PROJECT CLICK TYPES
// ============================================================================

export interface ProjectClick {
  projectId: string;
  projectName: string;
  timestamp: FirebaseFirestore.Timestamp;
  country: string;
  device: string;
  browser: string;
}

// ============================================================================
// ADMIN DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  totalVisitors: number;
  totalMessages: number;
  unreadMessages: number;
  resumeDownloads: number;
  projectClicks: number;
  mostViewedProjects: Array<{ name: string; clicks: number }>;
  topCountries: Array<{ country: string; count: number }>;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: 'message' | 'download' | 'project_click' | 'visitor';
  title: string;
  description: string;
  timestamp: FirebaseFirestore.Timestamp;
}

// ============================================================================
// EMAIL TYPES
// ============================================================================

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface AdminEmailData extends EmailData {
  connection: ConnectionDocument;
}

export interface VisitorEmailData extends EmailData {
  name: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// FIRESTORE COLLECTION NAMES
// ============================================================================

export const Collections = {
  CONNECTIONS: 'connections',
  ANALYTICS: 'analytics',
  VISITORS: 'visitors',
  ADMIN_LOGS: 'adminLogs',
  RESUME_DOWNLOADS: 'resumeDownloads',
  PROJECT_CLICKS: 'projectClicks',
  SETTINGS: 'settings',
  DAILY_ANALYTICS: 'dailyAnalytics'
} as const;

// ============================================================================
// ERROR TYPES
// ============================================================================

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}
