import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler, requestLogger, rateLimiter } from './core/middleware';
import { sendSuccess } from './core/utils';

// Module route imports
import { authRoutes } from './modules/auth';
import { userRoutes } from './modules/users';
import { organizationRoutes } from './modules/organizations';
import { hospitalRoutes } from './modules/hospitals';
import { donorRoutes } from './modules/donors';
import { donationRoutes } from './modules/donations';
import { inventoryRoutes } from './modules/inventory';
import { requestRoutes } from './modules/requests';
import { transferRoutes } from './modules/transfers';
import { logisticsRoutes } from './modules/logistics';
import { analyticsRoutes } from './modules/analytics';
import { alertRoutes } from './modules/alerts';
import { campaignRoutes } from './modules/campaigns';
import { emergencyRoutes } from './modules/emergency';
import { forecastingRoutes } from './modules/forecasting';
import { recommendationRoutes } from './modules/recommendations';
import { notificationRoutes } from './modules/notifications';
import { auditRoutes } from './modules/audit';
import { dashboardRoutes } from './modules/dashboard';

const app = express();

// ==================================================
// Global Middleware
// ==================================================

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://donorlink.et', 'https://admin.donorlink.et']
    : ['http://localhost:5173', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// ==================================================
// Health Check
// ==================================================

app.get('/api/v1/health', (_req, res) => {
  sendSuccess(res, {
    status: 'healthy',
    service: 'DonorLink API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }, 'Service is healthy');
});

// ==================================================
// API Routes — v1
// ==================================================

const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/organizations`, organizationRoutes);
app.use(`${API_PREFIX}/hospitals`, hospitalRoutes);
app.use(`${API_PREFIX}/donors`, donorRoutes);
app.use(`${API_PREFIX}/donations`, donationRoutes);
app.use(`${API_PREFIX}/inventory`, inventoryRoutes);
app.use(`${API_PREFIX}/requests`, requestRoutes);
app.use(`${API_PREFIX}/transfers`, transferRoutes);
app.use(`${API_PREFIX}/logistics`, logisticsRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/alerts`, alertRoutes);
app.use(`${API_PREFIX}/campaigns`, campaignRoutes);
app.use(`${API_PREFIX}/emergency`, emergencyRoutes);
app.use(`${API_PREFIX}/forecasting`, forecastingRoutes);
app.use(`${API_PREFIX}/recommendations`, recommendationRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/audit`, auditRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);

// ==================================================
// 404 Handler
// ==================================================

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'NOT_FOUND',
    timestamp: new Date().toISOString(),
  });
});

// ==================================================
// Global Error Handler (must be last)
// ==================================================

app.use(errorHandler);

export { app };
