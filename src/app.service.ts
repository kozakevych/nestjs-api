import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto';
@Injectable()
export class AppService {
  private readonly _secretKey = crypto.randomBytes(32).toString('hex');
  get secretKey(): string {
    console.log('Secret Key:', this._secretKey);
    return this._secretKey;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
