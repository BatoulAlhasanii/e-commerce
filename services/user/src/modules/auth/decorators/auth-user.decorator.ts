import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpRequestWithUser } from '@/modules/auth/types';
import { User } from '@/modules/user/entities/user.entity';

export const AuthUser: () => any = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request: HttpRequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
