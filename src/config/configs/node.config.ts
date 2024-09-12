import { registerAs } from '@nestjs/config';
import { Environment } from '@/config/config.interfaces';

export const nodeConfig = registerAs('node', () => ({
  mode: (process.env.NODE_ENV || Environment.Development) as string,
  portInternal: (process.env.NODE_PORT_INTERNAL ? parseInt(process.env.NODE_PORT_INTERNAL, 10) : 3000) as number,
  portExternal: (process.env.NODE_PORT_EXTERNAL ? parseInt(process.env.NODE_PORT_EXTERNAL, 10) : 3000) as number,
}));
