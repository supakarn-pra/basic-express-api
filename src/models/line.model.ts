export interface LineWebhookEvent {
  type: string;
  timestamp: number;
  source: {
    type: string;
    userId: string;
  };
  replyToken: string;
  message?: {
    type: string;
    id: string;
    text?: string;
  };
}

export interface LineWebhookBody {
  destination: string;
  events: LineWebhookEvent[];
}

export interface LineMessage {
  type: string;
  text: string;
}
