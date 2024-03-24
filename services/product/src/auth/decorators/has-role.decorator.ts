import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserRole } from '@/auth/enums/user-role.enum';
import { RoleGuard } from '@/auth/guards/role.guard';

export const ROLES_KEY: string = 'roles';

export const HasRole = (...roles: UserRole[]): ((...args: any) => void) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JWTAuthGuard, RoleGuard),
  );
};
