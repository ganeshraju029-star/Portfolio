/**
 * Admin Controller
 * Handles admin dashboard operations
 */

import { Request, Response } from 'express';
import { ContactController } from './contactController';
import { AnalyticsController } from './analyticsController';

export class AdminController {
  private contactController: ContactController;
  private analyticsController: AnalyticsController;

  constructor() {
    this.contactController = new ContactController();
    this.analyticsController = new AnalyticsController();
  }

  /**
   * Get complete dashboard data
   */
  async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const [connections, stats] = await Promise.all([
        this.contactController.getConnections(req, res),
        this.analyticsController.getDashboardStats(req, res)
      ]);

      res.json({
        success: true,
        data: {
          connections,
          stats
        }
      });
    } catch (error) {
      console.error('Get dashboard data error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve dashboard data'
      });
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(req: Request, res: Response): Promise<void> {
    try {
      // This would aggregate recent activity from all collections
      // For now, return a placeholder
      res.json({
        success: true,
        data: {
          activities: []
        }
      });
    } catch (error) {
      console.error('Get recent activity error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve recent activity'
      });
    }
  }

  /**
   * Get system health
   */
  async getSystemHealth(req: Request, res: Response): Promise<void> {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
      };

      res.json({
        success: true,
        data: health
      });
    } catch (error) {
      console.error('Get system health error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve system health'
      });
    }
  }
}
