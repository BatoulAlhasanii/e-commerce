export interface IAppConfig {
  env: string;
}

export const appConfig: IAppConfig = {
  env: process.env.NODE_ENV,
};
