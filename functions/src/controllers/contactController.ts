/**
 * Contact Controller
 * Handles contact form submissions and connection management
 */

import * as admin from 'firebase-admin';
import { Request, Response } from 'express';
import { ConnectionRequest, ConnectionDocument, CreateConnectionResponse, Collections } from '../types';
import { Validators } from '../utils/validators';
import { Helpers } from '../utils/helpers';
import { EmailService } from '../services/emailService';
import { AnalyticsService } from '../services/analyticsService';
import RateLimiter from '../middleware/rateLimiter';
import { db } from '../config/firebase';

export class ContactController {
  private emailService: EmailService;
  private analyticsService: AnalyticsService;

  constructor() {
    this.emailService = new EmailService();
    this.analyticsService = new AnalyticsService();
  }

  /**
   * Handle contact form submission
   */
  async submitContactForm(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, company, subject, message, linkedin, phone } = req.body as ConnectionRequest;

      // Rate limiting by email
      await RateLimiter.check(email);

      // Validate inputs
      Validators.validateName(name);
      Validators.validateEmail(email);
      Validators.validateMessage(message);
      Validators.validateOptionalField(company, 'Company', Config.MAX_COMPANY_LENGTH);
      Validators.validateOptionalField(subject, 'Subject', Config.MAX_SUBJECT_LENGTH);
      Validators.validateLinkedIn(linkedin);
      Validators.validatePhone(phone);

      // Sanitize inputs
      const sanitizedData: ConnectionRequest = {
        name: Validators.sanitizeString(name),
        email: Validators.sanitizeString(email),
        company: company ? Validators.sanitizeString(company) : undefined,
        subject: subject ? Validators.sanitizeString(subject) : undefined,
        message: Validators.sanitizeString(message),
        linkedin: linkedin ? Validators.sanitizeString(linkedin) : undefined,
        phone: phone ? Validators.sanitizeString(phone) : undefined
      };

      // Extract visitor information
      const userAgent = req.headers['user-agent'] as string || 'unknown';
      const ip = req.ip || 'unknown';
      const referrer = req.headers.referer || req.headers.referrer || 'direct';
      const sourcePage = req.body.sourcePage || '/';

      // Detect device and browser
      const device = Helpers.detectDevice(userAgent);
      const browser = Helpers.detectBrowser(userAgent);

      // Detect country (async, but we'll proceed with 'Unknown' if it fails)
      const country = await Helpers.detectCountry(ip);

      // Generate request ID
      const requestId = Helpers.generateRequestId();

      // Calculate priority
      const priority = Helpers.calculatePriority(message, subject);

      // Create connection document
      const connectionData: ConnectionDocument = {
        ...sanitizedData,
        id: '',
        requestId,
        status: 'new',
        priority,
        country,
        device,
        browser,
        referrer,
        sourcePage,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
      };

      // Save to Firestore
      const docRef = await db.collection(Collections.CONNECTIONS).add(connectionData);
      connectionData.id = docRef.id;

      // Send emails
      await Promise.all([
        this.emailService.sendAdminEmail({ to: Config.ADMIN_EMAIL, connection: connectionData }),
        this.emailService.sendVisitorEmail({ to: email, name: sanitizedData.name })
      ]);

      // Log admin activity
      await db.collection(Collections.ADMIN_LOGS).add({
        action: 'new_connection',
        connectionId: docRef.id,
        requestId,
        timestamp: admin.firestore.Timestamp.now()
      });

      const response: CreateConnectionResponse = {
        success: true,
        connectionId: docRef.id,
        requestId
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Contact form submission error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          res.status(429).json({
            success: false,
            error: error.message
          });
          return;
        }
        
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'An unexpected error occurred'
        });
      }
    }
  }

  /**
   * Get all connections (admin only)
   */
  async getConnections(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = Math.min(
        parseInt(req.query.pageSize as string) || Config.DEFAULT_PAGE_SIZE,
        Config.MAX_PAGE_SIZE
      );
      const status = req.query.status as string;
      const priority = req.query.priority as string;

      let query = db.collection(Collections.CONNECTIONS).orderBy('createdAt', 'desc');

      if (status) {
        query = query.where('status', '==', status);
      }
      if (priority) {
        query = query.where('priority', '==', priority);
      }

      const snapshot = await query.limit(pageSize).offset((page - 1) * pageSize).get();
      const connections = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get total count
      const countSnapshot = await db.collection(Collections.CONNECTIONS).get();
      const total = countSnapshot.size;

      res.json({
        success: true,
        data: connections,
        total,
        page,
        pageSize,
        hasMore: (page * pageSize) < total
      });
    } catch (error) {
      console.error('Get connections error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve connections'
      });
    }
  }

  /**
   * Get single connection by ID
   */
  async getConnectionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const doc = await db.collection(Collections.CONNECTIONS).doc(id).get();

      if (!doc.exists) {
        res.status(404).json({
          success: false,
          error: 'Connection not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: doc.id,
          ...doc.data()
        }
      });
    } catch (error) {
      console.error('Get connection error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve connection'
      });
    }
  }

  /**
   * Update connection status
   */
  async updateConnection(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, priority } = req.body;

      const updateData: any = {
        updatedAt: admin.firestore.Timestamp.now()
      };

      if (status) {
        updateData.status = status;
      }
      if (priority) {
        updateData.priority = priority;
      }

      await db.collection(Collections.CONNECTIONS).doc(id).update(updateData);

      res.json({
        success: true,
        message: 'Connection updated successfully'
      });
    } catch (error) {
      console.error('Update connection error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update connection'
      });
    }
  }

  /**
   * Delete connection
   */
  async deleteConnection(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await db.collection(Collections.CONNECTIONS).doc(id).delete();

      res.json({
        success: true,
        message: 'Connection deleted successfully'
      });
    } catch (error) {
      console.error('Delete connection error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete connection'
      });
    }
  }
}

// Import Config
import { Config } from '../config/constants';
