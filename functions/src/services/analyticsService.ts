/**
 * Analytics Service
 * Tracks visitor behavior, page views, and engagement metrics
 */

import * as admin from 'firebase-admin';
import { Collections, AnalyticsDocument, PageView, VisitorData, DailyAnalytics } from '../types';
import { Helpers } from '../utils/helpers';
import { db } from '../config/firebase';

export class AnalyticsService {
  /**
   * Track page view
   */
  async trackPageView(sessionId: string, visitorData: VisitorData, pageView: PageView): Promise<void> {
    const analyticsRef = db.collection(Collections.ANALYTICS).doc(sessionId);
    const doc = await analyticsRef.get();

    if (doc.exists) {
      // Update existing session
      const data = doc.data() as AnalyticsDocument;
      const updatedPageViews = [...data.pageViews, pageView];
      
      await analyticsRef.update({
        pageViews: updatedPageViews,
        totalDuration: data.totalDuration + pageView.duration,
        lastActivity: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Create new session
      const newAnalytics: AnalyticsDocument = {
        sessionId,
        visitorId: Helpers.generateSessionId(),
        pageViews: [pageView],
        visitor: visitorData,
        sessionStart: admin.firestore.Timestamp.now(),
        totalDuration: pageView.duration
      };
      
      await analyticsRef.set(newAnalytics);
    }

    // Update daily analytics
    await this.updateDailyAnalytics(pageView, visitorData);
  }

  /**
   * Update daily analytics aggregation
   */
  private async updateDailyAnalytics(pageView: PageView, visitorData: VisitorData): Promise<void> {
    const dateString = Helpers.getDateString();
    const dailyRef = db.collection(Collections.DAILY_ANALYTICS).doc(dateString);
    const doc = await dailyRef.get();

    if (doc.exists) {
      const data = doc.data() as DailyAnalytics;
      
      // Update page views
      const updatedPageViews = data.pageViews + 1;
      
      // Update top pages
      const topPages = [...data.topPages];
      const existingPageIndex = topPages.findIndex(p => p.path === pageView.path);
      if (existingPageIndex >= 0) {
        topPages[existingPageIndex].views += 1;
      } else {
        topPages.push({ path: pageView.path, views: 1 });
      }
      topPages.sort((a, b) => b.views - a.views).slice(0, 10);
      
      // Update countries
      const countries = [...data.countries];
      const existingCountryIndex = countries.findIndex(c => c.country === visitorData.country);
      if (existingCountryIndex >= 0) {
        countries[existingCountryIndex].count += 1;
      } else {
        countries.push({ country: visitorData.country, count: 1 });
      }
      
      // Update devices
      const devices = [...data.devices];
      const existingDeviceIndex = devices.findIndex(d => d.device === visitorData.device);
      if (existingDeviceIndex >= 0) {
        devices[existingDeviceIndex].count += 1;
      } else {
        devices.push({ device: visitorData.device, count: 1 });
      }
      
      // Update browsers
      const browsers = [...data.browsers];
      const existingBrowserIndex = browsers.findIndex(b => b.browser === visitorData.browser);
      if (existingBrowserIndex >= 0) {
        browsers[existingBrowserIndex].count += 1;
      } else {
        browsers.push({ browser: visitorData.browser, count: 1 });
      }

      await dailyRef.update({
        pageViews: updatedPageViews,
        topPages,
        countries,
        devices,
        browsers,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Create new daily analytics
      const newDaily: DailyAnalytics = {
        date: dateString,
        pageViews: 1,
        uniqueVisitors: 1,
        avgSessionDuration: pageView.duration,
        topPages: [{ path: pageView.path, views: 1 }],
        countries: [{ country: visitorData.country, count: 1 }],
        devices: [{ device: visitorData.device, count: 1 }],
        browsers: [{ browser: visitorData.browser, count: 1 }]
      };
      
      await dailyRef.set(newDaily);
    }
  }

  /**
   * Track project click
   */
  async trackProjectClick(projectId: string, projectName: string, visitorData: VisitorData): Promise<void> {
    await db.collection(Collections.PROJECT_CLICKS).add({
      projectId,
      projectName,
      timestamp: admin.firestore.Timestamp.now(),
      country: visitorData.country,
      device: visitorData.device,
      browser: visitorData.browser
    });
  }

  /**
   * Track resume download
   */
  async trackResumeDownload(visitorData: VisitorData, referrer: string): Promise<void> {
    await db.collection(Collections.RESUME_DOWNLOADS).add({
      timestamp: admin.firestore.Timestamp.now(),
      country: visitorData.country,
      device: visitorData.device,
      browser: visitorData.browser,
      referrer
    });
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<any> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get total visitors (unique sessions)
    const visitorsSnapshot = await db
      .collection(Collections.ANALYTICS)
      .where('sessionStart', '>=', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
      .get();
    
    // Get total messages
    const messagesSnapshot = await db
      .collection(Collections.CONNECTIONS)
      .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
      .get();
    
    // Get unread messages
    const unreadMessagesSnapshot = await db
      .collection(Collections.CONNECTIONS)
      .where('status', '==', 'new')
      .get();
    
    // Get resume downloads
    const downloadsSnapshot = await db
      .collection(Collections.RESUME_DOWNLOADS)
      .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
      .get();
    
    // Get project clicks
    const projectClicksSnapshot = await db
      .collection(Collections.PROJECT_CLICKS)
      .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
      .get();
    
    // Get most viewed projects
    const projectClicks: Record<string, number> = {};
    projectClicksSnapshot.forEach(doc => {
      const data = doc.data();
      const name = data.projectName;
      projectClicks[name] = (projectClicks[name] || 0) + 1;
    });
    
    const mostViewedProjects = Object.entries(projectClicks)
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);
    
    // Get top countries
    const countries: Record<string, number> = {};
    visitorsSnapshot.forEach(doc => {
      const data = doc.data();
      const country = data.visitor.country;
      countries[country] = (countries[country] || 0) + 1;
    });
    
    const topCountries = Object.entries(countries)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalVisitors: visitorsSnapshot.size,
      totalMessages: messagesSnapshot.size,
      unreadMessages: unreadMessagesSnapshot.size,
      resumeDownloads: downloadsSnapshot.size,
      projectClicks: projectClicksSnapshot.size,
      mostViewedProjects,
      topCountries
    };
  }

  /**
   * Clean up old analytics data
   */
  async cleanupOldAnalytics(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - Config.ANALYTICS_RETENTION_DAYS);
    
    const oldAnalytics = await db
      .collection(Collections.ANALYTICS)
      .where('sessionStart', '<', admin.firestore.Timestamp.fromDate(cutoffDate))
      .limit(500)
      .get();
    
    const batch = db.batch();
    oldAnalytics.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Cleaned up ${oldAnalytics.size} old analytics records`);
  }
}

// Import Config for constants
import { Config } from '../config/constants';
