export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Staging = 'staging'
}

export enum AppLogLevel {
  Error = 'error',
  Warn = 'warn',
  Log = 'log',
  Verbose = 'verbose',
  Debug = 'debug'
}

export enum PrismaLogLevel {
  Query = 'query',
  Info = 'info',
  Warn = 'warn',
  Error = 'error'
}

export interface ILogConfig {
  appLogLevel: AppLogLevel;
  prismaLogLevel: PrismaLogLevel;
}

export interface IAppConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  domain: string;
}

export interface IPostgresConfig {
  host: string;
  portInternal: number;
  portExternal: number;
  dbName: string;
  user: string;
  password: string;
  url: string;
}

export interface ISingleJwt {
  secret: string;
  time: number;
}

export interface IAccessJwt {
  publicKey: string;
  privateKey: string;
  time: number;
}

export interface IJwt {
  access: IAccessJwt;
  confirmation: ISingleJwt;
  resetPassword: ISingleJwt;
  refresh: ISingleJwt;
}

interface IEmailAuth {
  user: string;
  pass: string;
}

export interface IEmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: IEmailAuth;
}

export interface IConfig {
  app: IAppConfig;
  environment: Environment;
  dockerProjectName: string;
  apiPort: number;
  logs: ILogConfig;
  db: IPostgresConfig;
  jwt: IJwt;
  emailService: IEmailConfig;
}
