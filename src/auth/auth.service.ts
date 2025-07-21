import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const users: { username: string; password: string }[] = [];

const secretKey = crypto.randomBytes(32).toString('hex');

@Injectable()
export class AuthService {
  async register(dto: RegisterDto) {
    if (users.find((u) => u.username === dto.username)) {
      throw new ConflictException('Username already exists');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);

    users.push({ username: dto.username, password: hash });
    return { message: 'User registered successfully' };
  }

  async login(dto: LoginDto) {
    const user = users.find((u) => u.username === dto.username);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = jwt.sign({ username: user.username }, secretKey, {
      expiresIn: '1h',
    });
    return { access_token: token };
  }
}
