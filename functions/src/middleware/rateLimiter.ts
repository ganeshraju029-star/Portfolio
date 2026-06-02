/**
 * Rate Limiting Middleware
 * Prevents spam and abuse using in-memory rate limiting
 */

import { AppError, RateLimitError } from '../types';
import { Config } from '../config/constants';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private static store = new Map<string, RateLimitEntry>();

  /**
   * Check if request should be rate limited
   */
  static async check(identifier: string): Promise<void> {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry) {
      // First request
      this.store.set(identifier, {
        count: 1,
        resetTime: now + Config.RATE_LIMIT_WINDOW_MS
      });
      return;
    }

    // Check if window has expired
    if (now > entry.resetTime) {
      // Reset counter
      this.store.set(identifier, {
        count: 1,
        resetTime: now + Config.RATE_LIMIT_WINDOW_MS
      });
      return;
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    if (entry.count > Config.RATE_LIMIT_MAX_REQUESTS) {
      const remainingTime = Math.ceil((entry.resetTime - now) / 1000);
      throw new RateLimitError(
        `Too many requests. Please try again in ${remainingTime} seconds.`
      );
    }
  }

  /**
   * Get rate limit info for headers
   */
  static getInfo(identifier: string): {
    remaining: number;
    reset: number;
  } {
    const entry = this.store.get(identifier);
    const now = Date.now();

    if (!entry || now > entry.resetTime) {
      return {
        remaining: Config.RATE_LIMIT_MAX_REQUESTS,
        reset: now + Config.RATE_LIMIT_WINDOW_MS
      };
    }

    return {
      remaining: Math.max(0, Config.RATE_LIMIT_MAX_REQUESTS - entry.count),
      reset: entry.resetTime
    };
  }

  /**
   * Clean up expired entries
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => RateLimiter.cleanup(), 5 * 60 * 1000);
}

export default RateLimiter;
