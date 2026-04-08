import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const serviceAccountJson = this.configService.get<string>(
      'firebase.serviceAccountJson',
    );
    const keyPath = this.configService.get<string>('firebase.keyPath');
    const projectId = this.configService.get<string>('firebase.projectId');

    try {
      if (admin.apps.length === 0) {
        let credential;

        if (serviceAccountJson) {
          try {
            const serviceAccount = JSON.parse(serviceAccountJson);
            credential = admin.credential.cert(serviceAccount);
            this.logger.log('Initializing Firebase from JSON string');
          } catch (e) {
            this.logger.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON as JSON', e);
          }
        }

        if (!credential && keyPath && projectId) {
          credential = admin.credential.cert(path.resolve(process.cwd(), keyPath));
          this.logger.log('Initializing Firebase from key file path');
        }

        if (credential) {
          admin.initializeApp({
            credential,
            projectId: projectId || (serviceAccountJson ? JSON.parse(serviceAccountJson).project_id : undefined),
          });
          this.logger.log('Firebase Admin SDK initialized successfully');
        } else {
          this.logger.warn(
            'Firebase configuration is missing. Push notifications may not work.',
          );
        }
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

  async sendMulticastNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: any,
  ) {
    if (admin.apps.length === 0 || tokens.length === 0) return;

    try {
      const messageData: any = {};
      if (data) {
        Object.keys(data).forEach((key) => {
          messageData[key] = String(data[key]);
        });
      }

      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
        data: messageData,
      });

      this.logger.log(
        `Multicast: ${response.successCount} success, ${response.failureCount} failure`,
      );
      return response;
    } catch (error) {
      this.logger.error(`Error sending multicast notification: ${error.message}`);
    }
  }
}
