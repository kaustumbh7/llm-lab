import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Rate limiter service to respect Gemini API limits
 *
 * Gemini API Rate Limits (as of 2024):
 * - Free tier: 10 requests per minute
 * - Paid tier: 60 requests per minute
 *
 * This service implements a simple rate limiter to ensure we stay within limits
 */
@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);

  // Rate limiting configuration
  private readonly maxRequestsPerMinute: number;
  private readonly minTimeBetweenRequests: number;

  // Rate limiter state
  private lastRequestTime: number = 0;
  private requestQueue: Array<() => void> = [];
  private isProcessing = false;

  constructor(private configService: ConfigService) {
    // Get rate limiting configuration from environment
    this.maxRequestsPerMinute = this.configService.get<number>(
      'MAX_REQUESTS_PER_MINUTE',
      15,
    );

    // Calculate minimum time between requests from rate limit
    this.minTimeBetweenRequests = 60000 / this.maxRequestsPerMinute; // ms per request

    this.logger.log(
      `Rate limiter initialized: ${this.maxRequestsPerMinute} req/min (${this.minTimeBetweenRequests}ms between requests)`,
    );
  }

  /**
   * Wait for rate limiting to allow the next request
   * Returns a promise that resolves when it's safe to make the request
   */
  async waitForRateLimit(): Promise<void> {
    return new Promise((resolve) => {
      this.requestQueue.push(resolve);
      void this.processQueue();
    });
  }

  /**
   * Process the request queue and manage timing
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest >= this.minTimeBetweenRequests) {
        // Enough time has passed, allow the request
        this.lastRequestTime = now;
        const resolve = this.requestQueue.shift();
        if (resolve) {
          resolve();
        }
      } else {
        // Need to wait more time
        const waitTime = this.minTimeBetweenRequests - timeSinceLastRequest;
        this.logger.debug(
          `Rate limiting: waiting ${waitTime}ms before next request`,
        );
        await this.delay(waitTime);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Utility method to create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current rate limiter status
   */
  getStatus(): {
    queueLength: number;
    maxRequestsPerMinute: number;
    minTimeBetweenRequests: number;
    timeSinceLastRequest: number;
  } {
    return {
      queueLength: this.requestQueue.length,
      maxRequestsPerMinute: this.maxRequestsPerMinute,
      minTimeBetweenRequests: this.minTimeBetweenRequests,
      timeSinceLastRequest: Date.now() - this.lastRequestTime,
    };
  }

  /**
   * Reset the rate limiter (useful for testing)
   */
  reset(): void {
    this.lastRequestTime = 0;
    this.requestQueue = [];
    this.isProcessing = false;
    this.logger.log('Rate limiter reset');
  }
}
