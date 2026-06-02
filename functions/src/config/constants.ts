/**
 * Application Constants
 * Centralized configuration for the portfolio backend
 */

export const Config = {
  // Email Configuration
  ADMIN_EMAIL: 'ganeshraju015@gmail.com',
  RESEND_API_KEY: functions.config().resend?.api_key || process.env.RESEND_API_KEY,
  FROM_EMAIL: 'noreply@portfolio.ganeshraju.dev',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 5, // 5 requests per window
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Validation
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 5000,
  MAX_SUBJECT_LENGTH: 200,
  MAX_COMPANY_LENGTH: 100,
  
  // Request ID Generation
  REQUEST_ID_PREFIX: 'CONN',
  
  // Session Configuration
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  
  // Analytics
  ANALYTICS_RETENTION_DAYS: 90,
  
  // Security
  ALLOWED_ORIGINS: [
    'https://ganeshraju.dev',
    'https://www.ganeshraju.dev',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ]
} as const;

// Import functions config for runtime values
import * as functions from 'firebase-functions';
