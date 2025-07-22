import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { AppService } from '../app.service';

const users: { username: string; password: string }[] = [];

@Injectable()
export class AuthService {
  constructor(@Inject(AppService) public readonly appService: AppService) {}

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
    const token = jwt.sign(
      { username: user.username },
      this.appService.secretKey,
      {
        expiresIn: '1h',
      },
    );
    return { access_token: token };
  }
}
