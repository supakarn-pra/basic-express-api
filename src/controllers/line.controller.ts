import { Request, Response } from 'express';
import { LineService } from '../services/line.service';
import { LineWebhookBody } from '../models/line.model';

export class LineController {
  private lineService: LineService;

  constructor() {
    this.lineService = new LineService();
  }

  webhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const signature = req.headers['x-line-signature'] as string;

      if (!signature) {
        res.status(400).json({ error: 'Missing signature' });
        return;
      }

      const body = JSON.stringify(req.body);
      const isValid = this.lineService.verifySignature(body, signature);

      if (!isValid) {
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      const webhookBody: LineWebhookBody = req.body;
      await this.lineService.handleWebhook(webhookBody);

      res.status(200).json({ message: 'OK' });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { to, messages } = req.body;

      if (!to || !messages) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      await this.lineService.pushMessage(to, messages);

      res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message';
      res.status(500).json({ error: message });
    }
  };
}
