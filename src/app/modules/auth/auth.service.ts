import jwt from 'jsonwebtoken';
import User, { IUser } from '../../schemas/user.schema';
import config from '../../config';
import AppError from '../../errors/AppError';
import {
  ILoginRequest,
  ISignupRequest,
  IAuthResponse,
  IUserResponse,
  IAuthServiceResponse,
  IJWTPayload
} from './auth.interface';

import { JwtPayload, SignOptions } from 'jsonwebtoken';

class AuthService {
  /**
   * Create a JWT token
   * @param jwtPayload - Payload to include in the token
   * @param jwtSecret - Secret key for signing the token
   * @param expiresIn - Token expiration time (e.g., '1d', '2h', '60m')
   * @returns JWT token string
   */
  static createToken(
    jwtPayload: Record<string, any>,
    jwtSecret: string,
    expiresIn: string
  ): string {
    const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };
    return jwt.sign(jwtPayload, jwtSecret, options);
  }

  /**
   * Verify a JWT token
   * @param token - JWT token to verify
   * @param secret - Secret key for verification
   * @returns Decoded JWT payload
   * @throws AppError if token is invalid or expired
   */
  static verifyToken(token: string, secret: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return decoded;
    } catch (err: any) {
      throw new AppError(401, '', err.message || 'Invalid or expired token!');
    }
  }
  private static formatUserResponse(user: IUser): IUserResponse {
    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phone: user.phone,
      profilePicture: user.profilePicture,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      createdAt: user.createdAt
    };
  }

  private static generateTokens(userId: string, email: string): IAuthResponse {
      const accessToken = this.createToken(
        { user_id: userId, email },
        config.jwt_access_token_secret as string,
        config.jwt_access_token_expires_in as string
      );

      const refreshToken = this.createToken(
        { user_id: userId, email },
        config.jwt_refresh_token_secret as string,
        config.jwt_refresh_token_expires_in as string
      );

      return { accessToken, refreshToken };
  }

  // verifyToken is now implemented above and throws AppError on failure

  static async signup(payload: ISignupRequest): Promise<IAuthServiceResponse> {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      throw new AppError(409, 'auth', 'User with this email already exists');
    }

    if (payload.username) {
      const existingUsername = await User.findOne({ username: payload.username });
      if (existingUsername) {
        throw new AppError(409, 'auth', 'Username already taken');
      }
    }

    const newUser = new User({
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username
    });

    await newUser.save();
    const tokens = this.generateTokens(newUser._id.toString(), newUser.email);
    const userResponse = this.formatUserResponse(newUser);

    return { user: userResponse, tokens };
  }

  static async login(payload: ILoginRequest): Promise<IAuthServiceResponse> {
    const user = await User.findOne({ email: payload.email }).select('+password');

    if (!user) {
      throw new AppError(401, 'auth', 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new AppError(403, 'auth', 'Your account has been deactivated');
    }

    const isPasswordValid = await user.comparePassword(payload.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'auth', 'Invalid email or password');
    }

    const tokens = this.generateTokens(user._id.toString(), user.email);
    const userResponse = this.formatUserResponse(user);

    return { user: userResponse, tokens };
  }

  static async getMe(userId: string): Promise<IUserResponse> {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(404, 'auth', 'User not found');
    }

    if (!user.isActive) {
      throw new AppError(403, 'auth', 'Your account has been deactivated');
    }

    return this.formatUserResponse(user);
  }

  static async refreshAccessToken(refreshToken: string): Promise<string> {
      const decoded = this.verifyToken(refreshToken, config.jwt_refresh_token_secret as string);

      const user = await User.findById((decoded as any).user_id || (decoded as any).userId);
      if (!user || !user.isActive) {
        throw new AppError(401, 'auth', 'User not found or account is inactive');
      }

      const newAccessToken = this.createToken(
        { user_id: user._id.toString(), email: user.email },
        config.jwt_access_token_secret as string,
        config.jwt_access_token_expires_in as string
      );

      return newAccessToken;
  }

  static async logout(userId: string): Promise<void> {
    console.log(`User ${userId} logged out`);
  }
}

export default AuthService;
