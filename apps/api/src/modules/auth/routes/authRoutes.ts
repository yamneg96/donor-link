import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate, authenticate } from '../../../core/middleware';
import { authRateLimiter } from '../../../core/middleware/rateLimiter';
import {
  loginSchema, registerSchema, refreshTokenSchema,
  forgotPasswordSchema, resetPasswordSchema, verifyOtpSchema,
} from '../validators/authValidators';

const router = Router();

router.post('/login', authRateLimiter, validate({ body: loginSchema }), AuthController.login);
router.post('/register', validate({ body: registerSchema }), AuthController.register);
router.post('/refresh', validate({ body: refreshTokenSchema }), AuthController.refresh);
router.post('/logout', validate({ body: refreshTokenSchema }), AuthController.logout);
router.post('/forgot-password', validate({ body: forgotPasswordSchema }), AuthController.forgotPassword);
router.post('/reset-password', validate({ body: resetPasswordSchema }), AuthController.resetPassword);
router.post('/verify-otp', validate({ body: verifyOtpSchema }), AuthController.verifyOtp);
router.post('/send-otp', validate({ body: forgotPasswordSchema }), AuthController.sendOtp);
router.get('/me', authenticate, AuthController.me);

export { router as authRoutes };
