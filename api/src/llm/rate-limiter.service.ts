import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Rate limiter service to respect Gemini API limits
 *
 * Gemini API Rate Limits (as of 2024):
 * - Free tier: 10 requests per minute
 * - Paid tier: 60 requests per minute
 * - Burst limit: 2 requests per second
 *
 * This service implements a token bucket algorithm to ensure we stay within limits
 */
@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);

  // Rate limiting configuration
  private readonly maxRequestsPerMinute: number;
  private readonly maxBurstRequests: number;
  private readonly minTimeBetweenRequests: number;

  // Token bucket state
  private tokens: number;
  private lastRefillTime: number;
  private requestQueue: Array<() => void> = [];
  private isProcessing = false;

  constructor(private configService: ConfigService) {
    // Get rate limiting configuration from environment
    this.maxRequestsPerMinute = this.configService.get<number>(
      'MAX_REQUESTS_PER_MINUTE',
      10,
    );
    this.maxBurstRequests = this.configService.get<number>(
      'MAX_BURST_REQUESTS',
      1,
    );
    this.minTimeBetweenRequests = this.configService.get<number>(
      'MIN_TIME_BETWEEN_REQUESTS',
      6000,
    );

    // Initialize token bucket
    this.tokens = this.maxBurstRequests;
    this.lastRefillTime = Date.now();

    this.logger.log(
      `Rate limiter initialized: ${this.maxRequestsPerMinute} req/min, ${this.maxBurstRequests} burst, ${this.minTimeBetweenRequests}ms min interval`,
    );
  }

  /**
   * Acquire a token for making a request
   * Returns a promise that resolves when a token is available
   */
  async acquireToken(): Promise<void> {
    return new Promise((resolve) => {
      this.requestQueue.push(resolve);
      void this.processQueue();
    });
  }

  /**
   * Process the request queue and manage token distribution
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      // Refill tokens based on time elapsed
      this.refillTokens();

      if (this.tokens > 0) {
        // We have tokens available
        this.tokens--;
        const resolve = this.requestQueue.shift();
        if (resolve) {
          resolve();
        }

        // Enforce minimum time between requests
        await this.delay(this.minTimeBetweenRequests);
      } else {
        // No tokens available, wait for refill
        const waitTime = this.calculateWaitTime();
        this.logger.debug(
          `Rate limit reached, waiting ${waitTime}ms for token refill`,
        );
        await this.delay(waitTime);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(): void {
    const now = Date.now();
    const timeElapsed = now - this.lastRefillTime;

    // Calculate how many tokens we can refill
    // For 10 req/min: 1 token every 6 seconds (6000ms)
    const timePerToken = 60000 / this.maxRequestsPerMinute; // ms per token
    const tokensToAdd = Math.floor(timeElapsed / timePerToken);

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.tokens + tokensToAdd, this.maxBurstRequests);
      this.lastRefillTime = now;
      this.logger.debug(
        `Refilled ${tokensToAdd} tokens, current tokens: ${this.tokens}`,
      );
    }
  }

  /**
   * Calculate how long to wait for the next token
   */
  private calculateWaitTime(): number {
    const now = Date.now();
    const timePerToken = 60000 / this.maxRequestsPerMinute; // ms per token
    const nextTokenTime = this.lastRefillTime + timePerToken;

    return Math.max(0, nextTokenTime - now);
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
    tokens: number;
    queueLength: number;
    maxRequestsPerMinute: number;
    maxBurstRequests: number;
    minTimeBetweenRequests: number;
  } {
    return {
      tokens: this.tokens,
      queueLength: this.requestQueue.length,
      maxRequestsPerMinute: this.maxRequestsPerMinute,
      maxBurstRequests: this.maxBurstRequests,
      minTimeBetweenRequests: this.minTimeBetweenRequests,
    };
  }

  /**
   * Reset the rate limiter (useful for testing)
   */
  reset(): void {
    this.tokens = this.maxBurstRequests;
    this.lastRefillTime = Date.now();
    this.requestQueue = [];
    this.isProcessing = false;
    this.logger.log('Rate limiter reset');
  }
}
