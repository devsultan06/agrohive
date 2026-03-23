import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private googleClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private cloudinary: CloudinaryService,
    private notifications: NotificationsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async setOtpInCache(email: string, otp: string) {
    await this.cacheManager.set(`otp_${email}`, otp, 600000);
  }

  async getOtpFromCache(email: string): Promise<string | undefined> {
    return this.cacheManager.get(`otp_${email}`);
  }

  async deleteOtpFromCache(email: string) {
    await this.cacheManager.del(`otp_${email}`);
  }

  async getTokens(userId: string, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('jwt.accessSecret'),
          expiresIn: this.configService.get<string>(
            'jwt.accessExpiresIn',
          ) as any,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
          expiresIn: this.configService.get<string>(
            'jwt.refreshExpiresIn',
          ) as any,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async register(dto: RegisterDto, image?: Express.Multer.File) {
    this.logger.log(`Registration attempt for email: ${dto.email}`);

    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username || dto.email }],
      },
    });

    if (userExists) {
      this.logger.warn(
        `Registration failed — duplicate email/username: ${dto.email}`,
      );
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    let avatarUrl = dto.avatarUrl;
    if (image) {
      const uploadResult = await this.cloudinary.uploadFile(image);
      avatarUrl = uploadResult.secure_url;
    }

    const hashedPassword = await this.hashData(dto.password);
    const otp = this.generateOTP();

    await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username || dto.email,
        fullName: dto.fullName || 'User',
        password: hashedPassword,
        avatarUrl: avatarUrl,
        phone: dto.phone,
        location: dto.location,
        bio: dto.bio,
        isVerified: false,
      },
    });

    await this.setOtpInCache(dto.email, otp);
    await this.mailService.sendUserConfirmation(dto.email, otp);

    this.logger.log(`User registered successfully: ${dto.email} — OTP sent`);

    return {
      message:
        'A 4-digit verification code has been sent to your email. Please verify to continue.',
      email: dto.email,
    };
  }

  async verify(dto: VerifyDto) {
    this.logger.log(`OTP verification attempt for: ${dto.email}`);
    const cachedOtp = await this.getOtpFromCache(dto.email);

    if (!cachedOtp) {
      this.logger.warn(`OTP expired or not found for: ${dto.email}`);
      throw new BadRequestException('Verification code expired or not found');
    }
    if (cachedOtp !== dto.code) {
      this.logger.warn(`Invalid OTP entered for: ${dto.email}`);
      throw new BadRequestException('Invalid verification code');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new BadRequestException('User not found');

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        fcmToken: dto.fcmToken,
      },
    });

    await this.notifications.create(user.id, {
      type: 'SYSTEM',
      title: 'Welcome to AgroHive! 🚜',
      message: `Hi ${user.fullName}, we're glad to have you here! Explore our marketplace and community.`,
    });

    await this.deleteOtpFromCache(dto.email);

    const tokens = await this.getTokens(
      updatedUser.id,
      updatedUser.email,
      updatedUser.role,
    );
    await this.updateRefreshToken(updatedUser.id, tokens.refresh_token);

    this.logger.log(`User verified successfully: ${dto.email} (${user.id})`);

    return {
      ...tokens,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      },
    };
  }

  async resendOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const otp = this.generateOTP();
    await this.setOtpInCache(email, otp);
    await this.mailService.sendUserConfirmation(email, otp);

    return { message: 'A new 4-digit verification code has been sent.' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new BadRequestException('User not found');

    const otp = this.generateOTP();
    await this.setOtpInCache(dto.email, otp);
    await this.mailService.sendUserConfirmation(dto.email, otp);

    return { message: 'Password reset code sent to your email.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const cachedOtp = await this.getOtpFromCache(dto.email);
    if (!cachedOtp || cachedOtp !== dto.code) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const hashedPassword = await this.hashData(dto.newPassword);
    await this.prisma.user.update({
      where: { email: dto.email },
      data: { password: hashedPassword },
    });

    await this.deleteOtpFromCache(dto.email);
    return { message: 'Password reset successful. You can now log in.' };
  }

  async login(dto: LoginDto) {
    this.logger.log(`Login attempt for: ${dto.email}`);
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      this.logger.warn(`Login failed — user not found: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      this.logger.warn(`Login blocked — unverified user: ${dto.email}`);
      const otp = this.generateOTP();
      await this.setOtpInCache(dto.email, otp);
      await this.mailService.sendUserConfirmation(user.email, otp);
      throw new ForbiddenException(
        'Please verify your email address. A new code has been sent.',
      );
    }

    if (!user.password) {
      this.logger.warn(`Login blocked — Google-only account: ${dto.email}`);
      throw new UnauthorizedException(
        'This account was created with Google. Please login with Google.',
      );
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password!);
    if (!passwordMatches) {
      this.logger.warn(`Login failed — wrong password: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    this.logger.log(
      `User logged in: ${dto.email} (${user.id}) as ${user.role}`,
    );
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async adminLogin(dto: LoginDto) {
    this.logger.log(`Admin login attempt for: ${dto.email}`);
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      this.logger.warn(`Admin login failed — user not found: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role === UserRole.USER) {
      this.logger.warn(
        `Unauthorized login attempt — user ${dto.email} tried to access dashboard`,
      );
      throw new ForbiddenException(
        'Access denied. You do not have administrator privileges.',
      );
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password!);
    if (!passwordMatches) {
      this.logger.warn(`Admin login failed — wrong password: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    this.logger.log(`Administrator logged in: ${dto.email} (${user.id})`);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async googleLogin(dto: GoogleLoginDto) {
    this.logger.log('Google login attempt');
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: dto.idToken,
        audience: [
          this.configService.get<string>('GOOGLE_ANDROID_CLIENT_ID'),
          this.configService.get<string>('GOOGLE_IOS_CLIENT_ID'),
          this.configService.get<string>('GOOGLE_WEB_CLIENT_ID'),
        ].filter(Boolean) as string[],
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email)
        throw new BadRequestException('Invalid Google token');

      const { sub: googleId, email, name, picture } = payload;
      let user = await this.prisma.user.findFirst({
        where: { OR: [{ email }, { providerId: googleId }] },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email,
            username:
              email.split('@')[0] + '_' + Math.floor(Math.random() * 1000),
            fullName: name || 'Google User',
            avatarUrl: picture,
            provider: 'google',
            providerId: googleId,
            isVerified: true,
            fcmToken: dto.fcmToken,
          },
        });
        this.logger.log(`New Google user created: ${email}`);
      }

      const tokens = await this.getTokens(user.id, user.email, user.role);
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`Google auth failed: ${error.message}`);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: { id: userId, refreshToken: { not: null } },
      data: { refreshToken: null },
    });
    this.logger.log(`User logged out: ${userId}`);
    return { message: 'Logged out successfully' };
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }
}
