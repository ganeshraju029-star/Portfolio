/**
 * Input Validation Utilities
 * Enterprise-grade validation for all user inputs
 */

import validator from 'validator';
import { ValidationError } from '../types';
import { Config } from '../config/constants';

export class Validators {
  /**
   * Validate email address
   */
  static validateEmail(email: string): void {
    if (!email || !validator.isEmail(email)) {
      throw new ValidationError('Please enter a valid email address');
    }
    if (email.length > 255) {
      throw new ValidationError('Email address is too long');
    }
  }

  /**
   * Validate name
   */
  static validateName(name: string): void {
    if (!name || name.trim().length < Config.MIN_NAME_LENGTH) {
      throw new ValidationError(`Name must be at least ${Config.MIN_NAME_LENGTH} characters`);
    }
    if (name.length > Config.MAX_NAME_LENGTH) {
      throw new ValidationError(`Name must not exceed ${Config.MAX_NAME_LENGTH} characters`);
    }
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
      throw new ValidationError('Name contains invalid characters');
    }
  }

  /**
   * Validate message
   */
  static validateMessage(message: string): void {
    if (!message || message.trim().length < Config.MIN_MESSAGE_LENGTH) {
      throw new ValidationError(`Message must be at least ${Config.MIN_MESSAGE_LENGTH} characters`);
    }
    if (message.length > Config.MAX_MESSAGE_LENGTH) {
      throw new ValidationError(`Message must not exceed ${Config.MAX_MESSAGE_LENGTH} characters`);
    }
  }

  /**
   * Validate optional fields
   */
  static validateOptionalField(value: string | undefined, fieldName: string, maxLength: number): void {
    if (value && value.length > maxLength) {
      throw new ValidationError(`${fieldName} must not exceed ${maxLength} characters`);
    }
  }

  /**
   * Validate LinkedIn URL
   */
  static validateLinkedIn(url: string | undefined): void {
    if (url && !validator.isURL(url, { protocols: ['https', 'http'] })) {
      throw new ValidationError('Please enter a valid LinkedIn URL');
    }
    if (url && !url.includes('linkedin.com')) {
      throw new ValidationError('Please enter a valid LinkedIn profile URL');
    }
  }

  /**
   * Validate phone number
   */
  static validatePhone(phone: string | undefined): void {
    if (phone && !validator.isMobilePhone(phone, 'any', { strictMode: false })) {
      throw new ValidationError('Please enter a valid phone number');
    }
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return validator.escape(input.trim());
  }

  /**
   * Validate URL
   */
  static validateURL(url: string): void {
    if (!validator.isURL(url, { protocols: ['https', 'http'] })) {
      throw new ValidationError('Please enter a valid URL');
    }
  }
}
