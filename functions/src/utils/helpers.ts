/**
 * Helper Utilities
 * Common utility functions used across the application
 */

import * as admin from 'firebase-admin';
import { Config } from '../config/constants';

export class Helpers {
  /**
   * Generate unique request ID
   */
  static generateRequestId(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${Config.REQUEST_ID_PREFIX}-${year}-${random}`;
  }

  /**
   * Generate session ID
   */
  static generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Detect device type from user agent
   */
  static detectDevice(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
      return 'Mobile';
    } else if (/tablet|ipad/i.test(ua)) {
      return 'Tablet';
    }
    return 'Desktop';
  }

  /**
   * Detect browser from user agent
   */
  static detectBrowser(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('edg')) return 'Edge';
    if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
    return 'Unknown';
  }

  /**
   * Detect country from IP (simplified - in production use a geolocation service)
   */
  static async detectCountry(ip: string): Promise<string> {
    try {
      // In production, integrate with a real geolocation service
      // For now, return 'Unknown' or implement basic detection
      const response = await fetch(`https://ipapi.co/${ip}/country/`);
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.error('Country detection failed:', error);
    }
    return 'Unknown';
  }

  /**
   * Calculate priority based on message content
   */
  static calculatePriority(message: string, subject?: string): 'low' | 'medium' | 'high' {
    const highPriorityKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'critical'];
    const mediumPriorityKeywords = ['opportunity', 'job', 'offer', 'collaboration', 'project'];
    
    const combinedText = `${subject || ''} ${message}`.toLowerCase();
    
    if (highPriorityKeywords.some(keyword => combinedText.includes(keyword))) {
      return 'high';
    }
    if (mediumPriorityKeywords.some(keyword => combinedText.includes(keyword))) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Format timestamp for display
   */
  static formatTimestamp(timestamp: admin.firestore.Timestamp): string {
    return timestamp.toDate().toISOString();
  }

  /**
   * Get date string for analytics
   */
  static getDateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Paginate array
   */
  static paginate<T>(array: T[], page: number, pageSize: number): {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  } {
    const total = array.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = array.slice(startIndex, endIndex);
    
    return {
      data,
      total,
      page,
      pageSize,
      hasMore: endIndex < total
    };
  }

  /**
   * Sleep utility for delays
   */
  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Extract domain from email
   */
  static extractDomainFromEmail(email: string): string {
    return email.split('@')[1]?.toLowerCase() || 'unknown';
  }

  /**
   * Check if email is from a company domain
   */
  static isCompanyEmail(email: string): boolean {
    const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    const domain = this.extractDomainFromEmail(email);
    return !freeEmailDomains.includes(domain);
  }
}
