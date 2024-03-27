import { User } from '@/modules/user/entities/user.entity';
import { UserSerializer } from '@/modules/user/serializers/user.serializer';

export type token = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type HttpRequestWithUser = Request & { user: User };

export type AuthUserInfo = {
  user: UserSerializer;
  token;
};

export interface AuthUserPayload {
  id: string;
  role: string;
}
