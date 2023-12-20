import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface SendMailOptions {
  subject: string;
  from: string;
  to: string;
  bodyHtml: string;
  isTransactional: boolean;
}

@Injectable()
export class MailService {
  private readonly API_KEY: string;
  readonly SYSTEM_EMAIL: string;

  constructor(config: ConfigService) {
    this.API_KEY = config.getOrThrow<string>('ELASTIC_EMAIL_API_KEY');
    this.SYSTEM_EMAIL = config.getOrThrow<string>('SYSTEM_EMAIL');
  }

  async send(options: SendMailOptions) {
    const response = await axios.post(
      'https://api.elasticemail.com/v2/email/send',
      null,
      {
        params: {
          apikey: this.API_KEY,
          // subject: 'First email',
          // from: 'sdphat175@gmail.com',
          // to: 'saudaiphat@gmail.com',
          // bodyHtml: 'Hello from elasticemail',
          // isTransactional: true,
          ...options,
        },
      },
    );

    console.log(response.data);
  }
}
