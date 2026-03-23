import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter implementation
@Injectable()
export class RateLimitingMiddleware implements NestMiddleware {
  private requests = new Map<string, { count: number; resetTime: number }>();

  constructor() {
    // Clean up expired entries every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, data] of this.requests.entries()) {
        if (now > data.resetTime) {
          this.requests.delete(key);
        }
      }
    }, 60000);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const clientId = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100; // requests per window

    const clientData = this.requests.get(clientId);

    if (!clientData || now > clientData.resetTime) {
      // First request or window expired
      this.requests.set(clientId, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
    } else if (clientData.count < maxRequests) {
      // Within limit
      clientData.count++;
      next();
    } else {
      // Rate limit exceeded
      res.status(429).send('Too Many Requests');
    }
  }
}
