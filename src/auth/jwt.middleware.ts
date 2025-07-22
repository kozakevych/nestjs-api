import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppService } from 'src/app.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(public appService: AppService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }
    const token = authHeader.split(' ')[1];
    console.log('JWT Token:', token);
    console.log('Secret Key:', this.appService.secretKey);
    try {
      const payload = jwt.verify(token, this.appService.secretKey);
      req['user'] = payload;
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
