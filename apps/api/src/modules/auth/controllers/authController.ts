import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess, sendCreated } from '../../../core/utils';

const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userAgent = req.headers['user-agent'] || '';
      const ipAddress = req.ip || req.socket.remoteAddress || '';
      const result = await authService.login(req.body, userAgent, ipAddress);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      sendCreated(res, result, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.refreshAccessToken(req.body.refreshToken);
      sendSuccess(res, result, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.logout(req.body.refreshToken);
      sendSuccess(res, result, 'Logged out');
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.forgotPassword(req.body.email);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.resetPassword(req.body.token, req.body.password);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.verifyOtp(req.body.email, req.body.otp);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.sendOtp(req.body.email);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, req.user, 'Current user');
    } catch (error) {
      next(error);
    }
  }
}
