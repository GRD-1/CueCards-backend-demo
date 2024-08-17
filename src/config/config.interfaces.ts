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

export interface IRedisConfig {
  host: string;
  portInternal: number;
  portExternal: number;
  url: string;
  password: string;
}
