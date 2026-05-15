import { User, IUser } from '../../users/models/User';
import { RefreshToken, IRefreshToken } from '../models/RefreshToken';

export class AuthRepository {
  async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email, isDeleted: false }).select('+password');
  }

  async findUserById(id: string): Promise<IUser | null> {
    return User.findOne({ _id: id, isDeleted: false });
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return User.create(data);
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
  }

  async saveRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken> {
    return RefreshToken.create(data);
  }

  async findRefreshToken(token: string): Promise<IRefreshToken | null> {
    return RefreshToken.findOne({ token, isRevoked: false });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await RefreshToken.findOneAndUpdate({ token }, { isRevoked: true });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await RefreshToken.updateMany({ userId }, { isRevoked: true });
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  async setPasswordResetToken(userId: string, token: string, expires: Date): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });
  }

  async findUserByResetToken(token: string): Promise<IUser | null> {
    return User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
      isDeleted: false,
    }).select('+passwordResetToken +passwordResetExpires');
  }

  async setOTP(userId: string, otp: string, expires: Date): Promise<void> {
    await User.findByIdAndUpdate(userId, { otp, otpExpires: expires });
  }

  async findUserByOTP(email: string, otp: string): Promise<IUser | null> {
    return User.findOne({
      email,
      otp,
      otpExpires: { $gt: new Date() },
      isDeleted: false,
    }).select('+otp +otpExpires');
  }
}
