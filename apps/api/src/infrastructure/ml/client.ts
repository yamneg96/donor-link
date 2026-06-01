/**
 * ML Intelligence Service — HTTP Client
 * 
 * Handles communication between Express API and FastAPI ML service.
 * Uses native fetch with retry logic, timeout, and circuit breaker pattern.
 */

import { logger } from '../../config';

// ── Configuration ───────────────────────────────────
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const ML_API_KEY = process.env.ML_API_KEY || 'dl-ml-dev-key-change-in-prod';
const ML_TIMEOUT_MS = parseInt(process.env.ML_TIMEOUT_MS || '10000');
const ML_MAX_RETRIES = parseInt(process.env.ML_MAX_RETRIES || '2');

// ── Circuit Breaker State ───────────────────────────
let consecutiveFailures = 0;
let circuitOpen = false;
let circuitOpenedAt = 0;
const CIRCUIT_THRESHOLD = 5;
const CIRCUIT_RESET_MS = 30000; // 30 seconds

function checkCircuit(): boolean {
  if (!circuitOpen) return true;
  if (Date.now() - circuitOpenedAt > CIRCUIT_RESET_MS) {
    circuitOpen = false;
    consecutiveFailures = 0;
    logger.info('[ML Client] Circuit breaker reset — attempting requests again');
    return true;
  }
  return false;
}

function recordSuccess(): void {
  consecutiveFailures = 0;
  if (circuitOpen) {
    circuitOpen = false;
    logger.info('[ML Client] Circuit breaker closed — service recovered');
  }
}

function recordFailure(): void {
  consecutiveFailures++;
  if (consecutiveFailures >= CIRCUIT_THRESHOLD && !circuitOpen) {
    circuitOpen = true;
    circuitOpenedAt = Date.now();
    logger.warn(`[ML Client] Circuit breaker OPEN — ${CIRCUIT_THRESHOLD} consecutive failures`);
  }
}

// ── Core Request Function ───────────────────────────

interface MLRequestOptions {
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
  retries?: number;
}

export async function mlRequest<T>(
  path: string,
  options: MLRequestOptions = {}
): Promise<T> {
  const { method = 'POST', body, retries = ML_MAX_RETRIES } = options;

  if (!checkCircuit()) {
    throw new MLServiceError(
      'ML service circuit breaker is open — service temporarily unavailable',
      503
    );
  }

  const url = `${ML_SERVICE_URL}${path}`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), ML_TIMEOUT_MS);

      const response: any = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-ML-API-Key': ML_API_KEY,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });


      clearTimeout(timeout);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unknown error');
        throw new MLServiceError(
          `ML service returned ${response.status}: ${errorBody}`,
          response.status
        );
      }

      const data = (await response.json()) as T;
      recordSuccess();
      return data;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (error instanceof MLServiceError && error.statusCode < 500) {
        // Don't retry client errors (4xx)
        throw error;
      }

      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        logger.warn(
          `[ML Client] Request failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms: ${lastError.message}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  recordFailure();
  throw lastError || new MLServiceError('ML service request failed', 500);
}

// ── Error Class ─────────────────────────────────────

export class MLServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'MLServiceError';
    this.statusCode = statusCode;
  }
}

// ── Health Check ────────────────────────────────────

export async function checkMLHealth(): Promise<{ status: string; available: boolean }> {
  try {
    const result = await mlRequest<{ status: string }>('/health', { method: 'GET', retries: 0 });
    return { status: result.status, available: true };
  } catch {
    return { status: 'unavailable', available: false };
  }
}
