/**
 * Analytics Controller
 * Handles analytics tracking and dashboard data
 */

import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { VisitorData, PageView } from '../types';
import { Helpers } from '../utils/helpers';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  /**
   * Track page view
   */
  async trackPageView(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, visitorData, pageView } = req.body;

      if (!sessionId || !visitorData || !pageView) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
        return;
      }

      await this.analyticsService.trackPageView(sessionId, visitorData, pageView);

      res.json({
        success: true,
        message: 'Page view tracked successfully'
      });
    } catch (error) {
      console.error('Track page view error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track page view'
      });
    }
  }

  /**
   * Track project click
   */
  async trackProjectClick(req: Request, res: Response): Promise<void> {
    try {
      const { projectId, projectName, visitorData } = req.body;

      if (!projectId || !projectName || !visitorData) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
        return;
      }

      await this.analyticsService.trackProjectClick(projectId, projectName, visitorData);

      res.json({
        success: true,
        message: 'Project click tracked successfully'
      });
    } catch (error) {
      console.error('Track project click error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track project click'
      });
    }
  }

  /**
   * Track resume download
   */
  async trackResumeDownload(req: Request, res: Response): Promise<void> {
    try {
      const { visitorData, referrer } = req.body;

      if (!visitorData) {
        res.status(400).json({
          success: false,
          error: 'Missing visitor data'
        });
        return;
      }

      await this.analyticsService.trackResumeDownload(visitorData, referrer || 'direct');

      res.json({
        success: true,
        message: 'Resume download tracked successfully'
      });
    } catch (error) {
      console.error('Track resume download error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track resume download'
      });
    }
  }

  /**
   * Get dashboard statistics (admin only)
   */
  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.analyticsService.getDashboardStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve dashboard statistics'
      });
    }
  }

  /**
   * Get visitor analytics data
   */
  async getVisitorAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      // This would be implemented with proper date filtering
      // For now, return basic stats
      const stats = await this.analyticsService.getDashboardStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get visitor analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve visitor analytics'
      });
    }
  }
}
