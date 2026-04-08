import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private client: BrevoClient;

  constructor(private configService: ConfigService) {
    this.client = new BrevoClient({
      apiKey: this.configService.get<string>('mail.brevoApiKey') || '',
    });
  }

  async sendUserConfirmation(email: string, otp: string) {
    const sender = {
      name: 'AgroHive',
      email: this.configService.get<string>('mail.from') || 'support@agrohive.com',
    };

    try {
      const data = await this.client.transactionalEmails.sendTransacEmail({
        subject: 'Welcome to AgroHive! Confirm your Email',
        htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1C6206;">Welcome to AgroHive!</h2>
          <p>Thank you for joining our community. To complete your registration, please enter the following OTP:</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; color: #1C6206; margin: 0;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777;">&copy; 2026 AgroHive Platform. Supporting Farmers Everywhere.</p>
        </div>
      `,
        sender,
        to: [{ email }],
      });
      this.logger.log(`Email sent successfully to ${email}`);
      return data;
    } catch (error) {
      this.logger.error('❌ Brevo error:', error);
      throw new Error('Failed to send email');
    }
  }
}
