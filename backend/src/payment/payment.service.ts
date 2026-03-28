import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly paystackSecret: string;
  private readonly baseUrl = 'https://api.paystack.co';

  constructor(private readonly configService: ConfigService) {
    this.paystackSecret =
      this.configService.get('paystack.secretKey') || 'sk_test_placeholder';
  }

  async initializeTransaction(
    email: string,
    amount: number,
    reference: string,
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email,
          amount: Math.round(amount * 100), // convert to kobo
          reference,
          callback_url: this.configService.get('paystack.callbackUrl'),
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecret}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.data; // authorization_url, access_code, reference
    } catch (error) {
      this.logger.error(
        'Paystack checkout error:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async verifyTransaction(reference: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecret}`,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      this.logger.error(
        'Paystack verify error:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}
