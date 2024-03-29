export interface IJwtConfig {
  jwt_key: string;
  jwt_ttl: number;
}
export const jwtConfig: IJwtConfig = {
  jwt_key: process.env.JWT_KEY,
  jwt_ttl: +process.env.JWT_TTL,
};
