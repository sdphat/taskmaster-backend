import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

@Injectable()
export class InvitationCodeGeneratorService {
  generate(): string {
    return randomBytes(16).toString('hex');
  }
}
