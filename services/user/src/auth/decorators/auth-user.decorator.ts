import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpRequestWithUser } from '@/auth/types';
import { User } from '@/user/entity/user.entity';

export const AuthUser: () => any = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request: HttpRequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
