import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserPayload, HttpRequestWithUser } from '@/auth/types';

export const AuthUser: () => any = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUserPayload => {
    const request: HttpRequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
