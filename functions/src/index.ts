/**
 * Firebase Cloud Functions Entry Point
 * Enterprise-grade backend for Ganesh Raju Portfolio
 */

import * as express from 'express';
import * as functions from 'firebase-functions';
import { ContactController } from './controllers/contactController';
import { AnalyticsController } from './controllers/analyticsController';
import { AdminController } from './controllers/adminController';
import { corsMiddleware, helmetMiddleware, requestLogger, ipExtractor, userAgentExtractor, validateContentType, requestSizeLimit } from './middleware/security';

// Initialize Express app
const app = express();

// Apply middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(validateContentType);
app.use(requestSizeLimit('1mb'));
app.use(express.json());
app.use(requestLogger);
app.use(ipExtractor);
app.use(userAgentExtractor);

// Initialize controllers
const contactController = new ContactController();
const analyticsController = new AnalyticsController();
const adminController = new AdminController();

// ============================================================================
// CONTACT FORM ENDPOINTS
// ============================================================================

/**
 * POST /api/contact
 * Submit contact form
 */
app.post('/api/contact', (req, res) => {
  contactController.submitContactForm(req, res);
});

/**
 * GET /api/connections
 * Get all connections (admin only)
 */
app.get('/api/connections', (req, res) => {
  contactController.getConnections(req, res);
});

/**
 * GET /api/connections/:id
 * Get single connection by ID (admin only)
 */
app.get('/api/connections/:id', (req, res) => {
  contactController.getConnectionById(req, res);
});

/**
 * PATCH /api/connections/:id
 * Update connection status (admin only)
 */
app.patch('/api/connections/:id', (req, res) => {
  contactController.updateConnection(req, res);
});

/**
 * DELETE /api/connections/:id
 * Delete connection (admin only)
 */
app.delete('/api/connections/:id', (req, res) => {
  contactController.deleteConnection(req, res);
});

// ============================================================================
// ANALYTICS ENDPOINTS
// ============================================================================

/**
 * POST /api/analytics/pageview
 * Track page view
 */
app.post('/api/analytics/pageview', (req, res) => {
  analyticsController.trackPageView(req, res);
});

/**
 * POST /api/analytics/project-click
 * Track project click
 */
app.post('/api/analytics/project-click', (req, res) => {
  analyticsController.trackProjectClick(req, res);
});

/**
 * POST /api/analytics/resume-download
 * Track resume download
 */
app.post('/api/analytics/resume-download', (req, res) => {
  analyticsController.trackResumeDownload(req, res);
});

/**
 * GET /api/analytics/dashboard
 * Get dashboard statistics (admin only)
 */
app.get('/api/analytics/dashboard', (req, res) => {
  analyticsController.getDashboardStats(req, res);
});

/**
 * GET /api/analytics/visitors
 * Get visitor analytics (admin only)
 */
app.get('/api/analytics/visitors', (req, res) => {
  analyticsController.getVisitorAnalytics(req, res);
});

// ============================================================================
// ADMIN DASHBOARD ENDPOINTS
// ============================================================================

/**
 * GET /api/admin/dashboard
 * Get complete dashboard data (admin only)
 */
app.get('/api/admin/dashboard', (req, res) => {
  adminController.getDashboardData(req, res);
});

/**
 * GET /api/admin/activity
 * Get recent activity (admin only)
 */
app.get('/api/admin/activity', (req, res) => {
  adminController.getRecentActivity(req, res);
});

/**
 * GET /api/admin/health
 * Get system health (admin only)
 */
app.get('/api/admin/health', (req, res) => {
  adminController.getSystemHealth(req, res);
});

// ============================================================================
// EXPORT CLOUD FUNCTIONS
// ============================================================================

/**
 * Main API function
 * Handles all HTTP requests
 */
export const api = functions.https.onRequest(app);

/**
 * Scheduled function to clean up old analytics data
 * Runs daily at midnight UTC
 */
export const cleanupAnalytics = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    const { AnalyticsService } = await import('./services/analyticsService');
    const analyticsService = new AnalyticsService();
    await analyticsService.cleanupOldAnalytics();
    console.log('Analytics cleanup completed');
    return null;
  });

/**
 * Test function for development
 */
export const test = functions.https.onRequest((req, res) => {
  res.json({
    success: true,
    message: 'Portfolio backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});
