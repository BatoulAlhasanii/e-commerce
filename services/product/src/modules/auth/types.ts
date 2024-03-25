export type token = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type HttpRequestWithUser = Request & { user: AuthUserPayload };

export interface AuthUserPayload {
  id: string;
  role: string;
}
