import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const keyPath = this.configService.get<string>('firebase.keyPath');
    const projectId = this.configService.get<string>('firebase.projectId');

    if (!keyPath || !projectId) {
      this.logger.warn(
        'Firebase configuration is missing. Push notifications may not work.',
      );
      return;
    }

    try {
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(
            path.resolve(process.cwd(), keyPath),
          ),
          projectId,
        });
        this.logger.log('Firebase Admin SDK initialized successfully');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error);
    }
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: any,
  ) {
    if (admin.apps.length === 0) {
      this.logger.warn(
        'Firebase Admin SDK not initialized. Cannot send notification.',
      );
      return;
    }

    try {
      const messageData: any = {};
      if (data) {
        // FCM data values must be strings
        Object.keys(data).forEach((key) => {
          messageData[key] = String(data[key]);
        });
      }

      const response = await admin.messaging().send({
        token,
        notification: {
          title,
          body,
        },
        data: messageData,
      });
      this.logger.log(`Successfully sent message: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending push notification: ${error.message}`);
    }
  }
}
