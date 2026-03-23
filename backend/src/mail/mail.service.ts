import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(
      this.configService.get<string>('mail.resendApiKey'),
    );
  }

  async sendUserConfirmation(email: string, otp: string) {
    const { data, error } = await this.resend.emails.send({
      from: `AgroHive <${this.configService.get<string>('mail.from')}>`,
      to: [email],
      subject: 'Welcome to AgroHive! Confirm your Email',
      html: `
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
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw new Error('Failed to send email');
    }

    return data;
  }
}
