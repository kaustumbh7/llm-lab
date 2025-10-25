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
  private requestTimes: number[] = [];
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

      // Clean up old request times (older than 1 minute)
      this.requestTimes = this.requestTimes.filter(
        (time) => now - time < 60000,
      );

      // Check if we can make another request
      if (this.requestTimes.length < this.maxRequestsPerMinute) {
        // We can make a request
        this.requestTimes.push(now);
        const resolve = this.requestQueue.shift();
        if (resolve) {
          resolve();
        }
      } else {
        // We need to wait for the oldest request to expire
        const oldestRequest = Math.min(...this.requestTimes);
        const waitTime = 60000 - (now - oldestRequest) + 100; // Add 100ms buffer
        this.logger.debug(
          `Rate limiting: waiting ${waitTime}ms before next request (${this.requestTimes.length}/${this.maxRequestsPerMinute} requests in last minute)`,
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
    requestsInLastMinute: number;
    minTimeBetweenRequests: number;
  } {
    const now = Date.now();
    const recentRequests = this.requestTimes.filter(
      (time) => now - time < 60000,
    );

    return {
      queueLength: this.requestQueue.length,
      maxRequestsPerMinute: this.maxRequestsPerMinute,
      requestsInLastMinute: recentRequests.length,
      minTimeBetweenRequests: this.minTimeBetweenRequests,
    };
  }

  /**
   * Reset the rate limiter (useful for testing)
   */
  reset(): void {
    this.requestTimes = [];
    this.requestQueue = [];
    this.isProcessing = false;
    this.logger.log('Rate limiter reset');
  }
}
