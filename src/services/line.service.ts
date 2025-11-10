import axios from 'axios';
import crypto from 'crypto';
import { config } from '../config/env';
import { LineWebhookBody, LineMessage } from '../models/line.model';

export class LineService {
  private readonly channelAccessToken: string;
  private readonly channelSecret: string;
  private readonly lineApiUrl = 'https://api.line.me/v2/bot/message';

  constructor() {
    this.channelAccessToken = config.line.channelAccessToken;
    this.channelSecret = config.line.channelSecret;
  }

  verifySignature(body: string, signature: string): boolean {
    if (!this.channelSecret) {
      console.warn('LINE channel secret not configured');
      return false;
    }

    const hash = crypto
      .createHmac('SHA256', this.channelSecret)
      .update(body)
      .digest('base64');

    return hash === signature;
  }

  async replyMessage(replyToken: string, messages: LineMessage[]): Promise<void> {
    if (!this.channelAccessToken) {
      throw new Error('LINE channel access token not configured');
    }

    try {
      await axios.post(
        `${this.lineApiUrl}/reply`,
        {
          replyToken,
          messages,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.channelAccessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to reply LINE message:', error);
      throw new Error('Failed to send LINE message');
    }
  }

  async pushMessage(to: string, messages: LineMessage[]): Promise<void> {
    if (!this.channelAccessToken) {
      throw new Error('LINE channel access token not configured');
    }

    try {
      await axios.post(
        `${this.lineApiUrl}/push`,
        {
          to,
          messages,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.channelAccessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to push LINE message:', error);
      throw new Error('Failed to send LINE message');
    }
  }

  async handleWebhook(webhookBody: LineWebhookBody): Promise<void> {
    const { events } = webhookBody;

    for (const event of events) {
      if (event.type === 'message' && event.message?.type === 'text') {
        const userMessage = event.message.text || '';
        const replyToken = event.replyToken;

        const replyMessage: LineMessage = {
          type: 'text',
          text: `You said: ${userMessage}`,
        };

        await this.replyMessage(replyToken, [replyMessage]);
      }
    }
  }
}
