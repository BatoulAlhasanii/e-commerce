import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '@/user/repositories/user.repository';
import { RegisterUserDto } from '@/auth/dto/register-user.dto';
import { User } from '@/user/entity/user.entity';
import { UserSerializer } from '@/user/serializers/user.serializer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthUserInfo, token } from '@/auth/types';
import { LoginUserDto } from '@/auth/dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<AuthUserInfo> {
    let user: User = await this.userRepository.create(registerUserDto);

    user = await this.userRepository.save(user);

    return {
      user: UserSerializer.transform(user) as UserSerializer,
      token: this.generateToken(user),
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthUserInfo> {
    const user: User = await this.userRepository.findOneByOrFail({
      email: loginUserDto.email,
    });

    if (
      !user ||
      !(await bcrypt.compare(loginUserDto.password, user.password))
    ) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      user: UserSerializer.transform(user),
      token: this.generateToken(user),
    };
  }

  private generateToken(user: User): token {
    const payload = { id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'bearer',
      expires_in: this.configService.get('jwt.jwt_ttl'),
    };
  }
}