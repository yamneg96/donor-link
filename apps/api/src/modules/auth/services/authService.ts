import { AuthRepository } from '../repositories/authRepository';
import {
  hashPassword, comparePassword,
  generateAccessToken, generateRefreshToken, verifyRefreshToken,
  generateOTP,
} from '../../../core/utils';
import { UnauthorizedError, ConflictError, NotFoundError, ValidationError } from '../../../core/errors';
import { eventBus, EventType } from '../../../core/events';
import { LoginInput, RegisterInput } from '../validators/authValidators';
import { Role, UserStatus } from '../../../core/constants';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  private authRepo: AuthRepository;

  constructor() {
    this.authRepo = new AuthRepository();
  }

  async login(data: LoginInput, userAgent: string = '', ipAddress: string = '') {
    const user = await this.authRepo.findUserByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedError('Account is not active');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId?.toString() || null,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user._id.toString() });

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepo.saveRefreshToken({
      userId: user._id,
      token: refreshToken,
      expiresAt,
      userAgent,
      ipAddress,
    });

    // Update last login
    await this.authRepo.updateUserLastLogin(user._id.toString());

    // Emit event
    eventBus.emitEvent(EventType.USER_LOGIN, { userId: user._id.toString() }, user._id.toString());

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      accessToken,
      refreshToken,
    };
  }

  async register(data: RegisterInput) {
    // Check if user already exists
    const existingUser = await this.authRepo.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await this.authRepo.createUser({
      ...data,
      password: hashedPassword,
      role: data.role || Role.DONOR,
      status: UserStatus.ACTIVE,
      organizationId: data.organizationId as any,
    });

    eventBus.emitEvent(EventType.USER_CREATED, { userId: user._id.toString() }, user._id.toString());

    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
  }

  async refreshAccessToken(refreshTokenStr: string) {
    const storedToken = await this.authRepo.findRefreshToken(refreshTokenStr);
    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Verify token
    try {
      verifyRefreshToken(refreshTokenStr);
    } catch {
      await this.authRepo.revokeRefreshToken(refreshTokenStr);
      throw new UnauthorizedError('Expired refresh token');
    }

    // Get user
    const user = await this.authRepo.findUserById(storedToken.userId.toString());
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedError('User not found or inactive');
    }

    // Generate new access token
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId?.toString() || null,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = generateAccessToken(tokenPayload);

    return { accessToken };
  }

  async logout(refreshTokenStr: string) {
    await this.authRepo.revokeRefreshToken(refreshTokenStr);
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.authRepo.findUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.authRepo.setPasswordResetToken(user._id.toString(), resetToken, expires);

    // TODO: Send email with reset link via notification queue
    return { message: 'If the email exists, a reset link has been sent', resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.authRepo.findUserByResetToken(token);
    if (!user) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.authRepo.updateUserPassword(user._id.toString(), hashedPassword);
    await this.authRepo.revokeAllUserTokens(user._id.toString());

    return { message: 'Password reset successfully' };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.authRepo.findUserByOTP(email, otp);
    if (!user) {
      throw new ValidationError('Invalid or expired OTP');
    }

    // Clear OTP
    await this.authRepo.setOTP(user._id.toString(), '', new Date(0));

    return { message: 'OTP verified successfully', userId: user._id };
  }

  async sendOtp(email: string) {
    const user = await this.authRepo.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError('User');
    }

    const otp = generateOTP();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10);

    await this.authRepo.setOTP(user._id.toString(), otp, expires);

    // TODO: Send OTP via SMS/email queue
    return { message: 'OTP sent successfully', otp }; // Remove otp in production
  }
}
