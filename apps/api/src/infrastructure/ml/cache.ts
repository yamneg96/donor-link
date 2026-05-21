/**
 * ML Response Cache
 * 
 * In-memory TTL cache for ML predictions to avoid redundant calls.
 * Predictions are expensive — cache aggressively with short TTL.
 */

import { logger } from '../../config';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MLCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private readonly defaultTTL: number;

  constructor(defaultTTLSeconds: number = 300) {
    this.defaultTTL = defaultTTLSeconds * 1000;

    // Periodic cleanup every 60 seconds
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Generate cache key from endpoint path and request body.
   */
  key(path: string, body: unknown): string {
    return `${path}:${JSON.stringify(body)}`;
  }

  /**
   * Get cached result if still valid.
   */
  get<T>(cacheKey: string): T | null {
    const entry = this.store.get(cacheKey);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(cacheKey);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Store a result with TTL.
   */
  set<T>(cacheKey: string, data: T, ttlSeconds?: number): void {
    const ttl = ttlSeconds ? ttlSeconds * 1000 : this.defaultTTL;
    this.store.set(cacheKey, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Invalidate a specific key or all keys matching a prefix.
   */
  invalidate(prefixOrKey: string): void {
    if (this.store.has(prefixOrKey)) {
      this.store.delete(prefixOrKey);
      return;
    }
    // Prefix-based invalidation
    for (const key of this.store.keys()) {
      if (key.startsWith(prefixOrKey)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Invalidate all cached ML results.
   */
  clear(): void {
    this.store.clear();
    logger.debug('[ML Cache] Cache cleared');
  }

  /**
   * Remove expired entries.
   */
  private cleanup(): void {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        removed++;
      }
    }
    if (removed > 0) {
      logger.debug(`[ML Cache] Cleaned up ${removed} expired entries`);
    }
  }

  get size(): number {
    return this.store.size;
  }
}

// ── Cache TTL Constants (seconds) ───────────────────

export const CACHE_TTL = {
  FORECAST: 600,        // 10 min — forecasts change slowly
  SHORTAGE_RISK: 300,   // 5 min — risk updates with inventory
  REDISTRIBUTION: 300,  // 5 min
  ANOMALY: 120,         // 2 min — anomalies should be fresh
  EXPIRY_RISK: 600,     // 10 min
} as const;

// Singleton
export const mlCache = new MLCache();
