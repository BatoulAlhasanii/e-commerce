import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '@/modules/auth/dto/register-user.dto';
import { LoginUserDto } from '@/modules/auth/dto/login-user.dto';
import { ApiResponse, responseSuccess } from '@/utils/api-response';
import { AuthUserInfo } from '@/modules/auth/types';

@Controller('users/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<ApiResponse<AuthUserInfo>> {
    return responseSuccess(
      null,
      await this.authService.register(registerUserDto),
    );
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ApiResponse<AuthUserInfo>> {
    return responseSuccess(null, await this.authService.login(loginUserDto));
  }
}
