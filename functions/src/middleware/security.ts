/**
 * Security Middleware
 * CORS, Helmet, and other security measures
 */

import * as cors from 'cors';
import * as helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { Config } from '../config/constants';
import { UnauthorizedError } from '../types';

/**
 * CORS configuration
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (Config.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

/**
 * Helmet security headers
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.firebaseio.com", "https://*.firebasedatabase.app"],
      fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true
});

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};

/**
 * IP address extraction middleware
 */
export const ipExtractor = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.headers['x-forwarded-for'] as string || 
             req.headers['x-real-ip'] as string || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress ||
             'unknown';
  
  req.ip = ip;
  next();
};

/**
 * User agent extraction middleware
 */
export const userAgentExtractor = (req: Request, res: Response, next: NextFunction): void => {
  const userAgent = req.headers['user-agent'] || 'unknown';
  req.headers['user-agent'] = userAgent;
  next();
};

/**
 * Admin authentication middleware
 */
export const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No authorization token provided');
    }
    
    const token = authHeader.substring(7);
    const decoded = await admin.auth().verifyIdToken(token);
    
    // Check if user is admin (you'll need to set this up in Firebase Auth)
    const userDoc = await admin.firestore().collection('users').doc(decoded.uid).get();
    
    if (!userDoc.exists || !userDoc.data()?.isAdmin) {
      throw new UnauthorizedError('Admin access required');
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired authorization token'));
  }
};

/**
 * Request validation middleware
 */
export const validateContentType = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (!req.is('application/json')) {
      res.status(415).json({
        success: false,
        error: 'Content-Type must be application/json'
      });
      return;
    }
  }
  next();
};

/**
 * Request size limit middleware
 */
export const requestSizeLimit = (maxSize: string = '1mb') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    const maxBytes = parseInt(maxSize) * 1024 * 1024;
    
    if (contentLength > maxBytes) {
      res.status(413).json({
        success: false,
        error: `Request body too large. Maximum size is ${maxSize}`
      });
      return;
    }
    
    next();
  };
};
